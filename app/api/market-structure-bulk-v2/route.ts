import {
  buildDailyStructure,
  buildWeeklyStructure,
  buildMonthlyStructure,
  buildFibLevels,
} from "@/src/lib/marketStructureEngine";
import {
  canRunEOD,
} from "@/src/lib/eodGuard";

import {
  buildAllSwings,
} from "@/src/lib/swingEngine";

import {
  getCompletedDailyCandle,
} from "@/src/lib/eodEngine";

import {
  loadInstrumentMap,
  getDailyCandles,
} from "@/src/lib/kiteData";

import {
  buildMetadata,
} from "@/src/lib/marketMetadata";

import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
if (
  !canRunEOD()
) {

  return NextResponse.json({

    success: false,

    message:
      "Market Still Open",

  });

}
const today =
  new Date()
    .toISOString()
    .split("T")[0];

const eodStatusRef =
  doc(
    db,
    "settings",
    "eodStatus"
  );

const eodStatusDoc =
  await getDoc(
    eodStatusRef
  );

if (
  eodStatusDoc.exists()
) {

  const lastRunDate =
    eodStatusDoc.data()
      ?.lastRunDate;

  if (
    lastRunDate ===
    today
  ) {

    return NextResponse.json({

      success: false,

      message:
        "Already Updated Today",

    });

  }

}
  try {

    const tokenDoc =
      await getDoc(
        doc(
          db,
          "settings",
          "kite"
        )
      );

    const accessToken =
      tokenDoc.data()?.accessToken;

    if (!accessToken) {

      return NextResponse.json({
        success: false,
        error: "No Access Token",
      });

    }

    const kite =
      new KiteConnect({
        api_key:
          process.env.KITE_API_KEY!,
      });

    kite.setAccessToken(
      accessToken
    );

    const instrumentMap =
      await loadInstrumentMap();

    const snapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    const stocks: any[] =
      snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

    let updated = 0;
    let ignored = 0;
    let failed = 0;

    const updatedSymbols: string[] = [];
    const ignoredSymbols: string[] = [];
    const failedSymbols: string[] = [];

    for (const stock of stocks) {

      try {

        const symbol =
          stock.symbol;

        if (
          symbol.includes(
            "NIFTY"
          )
        ) {

          ignored++;

          ignoredSymbols.push(
            symbol
          );

          continue;

        }

        const instrumentToken =
          instrumentMap.get(
            stock.kiteSymbol
          );

        if (
          !instrumentToken
        ) {

          console.log(
            "TOKEN NOT FOUND:",
            stock.kiteSymbol
          );

          failed++;

          failedSymbols.push(
            stock.symbol
          );

          continue;

        }

        console.log(
          "TOKEN:",
          symbol,
          instrumentToken
        );

        const candles =
          await getDailyCandles(
            kite,
            Number(
              instrumentToken
            )
          );

        if (
          !candles ||
          candles.length < 50
        ) {

          failed++;

          failedSymbols.push(
            symbol
          );

          continue;

        }

        const lastCandle =
          getCompletedDailyCandle(
            candles
          );

        if (!lastCandle) {

          failed++;

          failedSymbols.push(
            symbol
          );

          continue;

        }

        const {
          dailyPivot,
          dailyCPR,
          dailyVWAP,
          totalVolumeDaily,
          dailyOHLC,
        } =
          buildDailyStructure(
            lastCandle
          );

        const today =
          new Date();

        const weeklyData =
          buildWeeklyStructure(
            candles,
            today
          );

        if (!weeklyData) {

          failed++;

          failedSymbols.push(
            symbol
          );

          continue;

        }

        const {
          weeklyPivot,
          weeklyCPR,
          weeklyVWAP,
          totalVolumeWeekly,
          weeklyOHLC,
        } = weeklyData;

        const monthlyData =
          buildMonthlyStructure(
            candles,
            today
          );

        if (!monthlyData) {

          failed++;

          failedSymbols.push(
            symbol
          );

          continue;

        }

        const {
          monthlyPivot,
          monthlyCPR,
          monthlyVWAP,
          totalVolumeMonthly,
          monthlyOHLC,
        } = monthlyData;

        const swings =
          buildAllSwings(
            candles
          );

        const oneWeekFib =
          buildFibLevels(
            swings.oneWeekSwing.high,
            swings.oneWeekSwing.low
          );

        const twoWeekFib =
          buildFibLevels(
            swings.twoWeekSwing.high,
            swings.twoWeekSwing.low
          );

        const oneMonthFib =
          buildFibLevels(
            swings.oneMonthSwing.high,
            swings.oneMonthSwing.low
          );

        const threeMonthFib =
          buildFibLevels(
            swings.threeMonthSwing.high,
            swings.threeMonthSwing.low
          );

        const sixMonthFib =
          buildFibLevels(
            swings.sixMonthSwing.high,
            swings.sixMonthSwing.low
          );

        const oneYearFib =
          buildFibLevels(
            swings.oneYearSwing.high,
            swings.oneYearSwing.low
          );

        await setDoc(

          doc(
            db,
            "marketStructure",
            symbol
          ),

          {

            symbol,

            instrumentToken,

            cmp:
              candles[
                candles.length - 1
              ].close,

            dailyOHLC,

            dailyPivot,
            dailyCPR,
            dailyVWAP,
            totalVolumeDaily,

            weeklyPivot,
            weeklyCPR,
            weeklyVWAP,
            totalVolumeWeekly,

            monthlyPivot,
            monthlyCPR,
            monthlyVWAP,
            totalVolumeMonthly,

            weeklyOHLC,
            monthlyOHLC,

            ...swings,

            oneWeekFib,
            twoWeekFib,
            oneMonthFib,
            threeMonthFib,
            sixMonthFib,
            oneYearFib,

            ...buildMetadata(),

            heatScore: 0,
            rsScore: 0,
            volumeScore: 0,
            deliveryScore: 0,
            sectorScore: 0,
            trendScore: 0,

          },

          {
            merge: true,
          }

        );

        updated++;

        updatedSymbols.push(
          symbol
        );

      } catch (error: any) {

        console.log(
          "FAILED:",
          stock.symbol
        );

        console.log(
          error
        );

        failed++;

        failedSymbols.push(
          stock.symbol
        );

      }

    }
await setDoc(

  eodStatusRef,

  {

    lastRunDate:
      today,

    updatedAt:
      serverTimestamp(),

  },

  {
    merge: true,
  }

);


    return NextResponse.json({

      success: true,

      total:
        stocks.length,

      updated,

      ignored,

      failed,

      updatedSymbols,

      ignoredSymbols,

      failedSymbols,

      message:
        "BULK V2 COMPLETE",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}