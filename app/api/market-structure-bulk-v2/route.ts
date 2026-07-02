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
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

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
const indiaTime =
  new Date(
    new Date().toLocaleString(
      "en-US",
      {
        timeZone:
          "Asia/Kolkata",
      }
    )
  );

const today =
  indiaTime
    .toISOString()
    .split("T")[0];

const currentSession =

  (
    indiaTime.getHours() > 15 ||

    (
      indiaTime.getHours() === 15 &&
      indiaTime.getMinutes() >= 30
    )

  )

    ? "POST_CLOSE"

    : "PRE_CLOSE";

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

  const lastSession =
    eodStatusDoc.data()
      ?.session;

  if (

    lastRunDate ===
      today &&

    lastSession ===
      currentSession

  ) {

    return NextResponse.json({

      success: false,

      message:
        "Already Updated Today",

    });

  }

}  try {

    const tokenDoc =
      await getDoc(
        doc(
          db,
          "settings",
          "kite"
        )
      );

    const accessToken = await getCachedAccessToken();

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
failed++;

          failedSymbols.push(
            stock.symbol
          );

          continue;

        }
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
  weeklyCandles,
} = weeklyData;
const completedWeekDates =
  new Set(
    weeklyCandles.map(
      (c: any) =>
        new Date(c.date)
          .toISOString()
          .split("T")[0]
    )
  );
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
          previousMonthCandles,
          monthlyPivot,
          monthlyCPR,
          monthlyVWAP,
          totalVolumeMonthly,
          monthlyOHLC,
        } = monthlyData;
        const completedMonthDates =
  new Set(
    previousMonthCandles.map(
      (c: any) =>
        new Date(c.date)
          .toISOString()
          .split("T")[0]
    )
  );
const deliverySnapshot =
  await getDocs(
    query(
      collection(
        db,
        "delivery_history"
      ),
      where(
        "symbol",
        "==",
        symbol
      )
    )
  );

const deliveryRecords =
  deliverySnapshot.docs.map(
    (doc) => doc.data()
  );
  const latestDelivery =
  deliveryRecords
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )[0];

const totalDeliveryDaily =
  latestDelivery?.deliveryQty || 0;

const deliveryPctDaily =
  latestDelivery?.deliveryPct || 0;
  const weeklyDeliveryRecords =
  deliveryRecords.filter(
    (row: any) =>
      completedWeekDates.has(
        row.date
      )
  );

const totalDeliveryWeekly =
  weeklyDeliveryRecords.reduce(
    (sum: number, row: any) =>
      sum + (row.deliveryQty || 0),
    0
  );

const totalWeeklyVolume =
  weeklyDeliveryRecords.reduce(
    (sum: number, row: any) =>
      sum + (row.volume || 0),
    0
  );

const deliveryPctWeekly =
  totalWeeklyVolume > 0
    ? Number(
        (
          totalDeliveryWeekly /
          totalWeeklyVolume *
          100
        ).toFixed(2)
      )
    : 0;
    const monthlyDeliveryRecords =
  deliveryRecords.filter(
    (row: any) =>
      completedMonthDates.has(
        row.date
      )
  );

const totalDeliveryMonthly =
  monthlyDeliveryRecords.reduce(
    (sum: number, row: any) =>
      sum + (row.deliveryQty || 0),
    0
  );

const totalMonthlyVolume =
  monthlyDeliveryRecords.reduce(
    (sum: number, row: any) =>
      sum + (row.volume || 0),
    0
  );

const deliveryPctMonthly =
  totalMonthlyVolume > 0
    ? Number(
        (
          totalDeliveryMonthly /
          totalMonthlyVolume *
          100
        ).toFixed(2)
      )
    : 0;
        const swings =
          buildAllSwings(
            candles
          );

        const oneWeekFib =
  swings.oneWeekSwing
    ? buildFibLevels(
        swings.oneWeekSwing.high,
        swings.oneWeekSwing.low
      )
    : null;

const twoWeekFib =
  swings.twoWeekSwing
    ? buildFibLevels(
        swings.twoWeekSwing.high,
        swings.twoWeekSwing.low
      )
    : null;

const oneMonthFib =
  swings.oneMonthSwing
    ? buildFibLevels(
        swings.oneMonthSwing.high,
        swings.oneMonthSwing.low
      )
    : null;

const threeMonthFib =
  swings.threeMonthSwing
    ? buildFibLevels(
        swings.threeMonthSwing.high,
        swings.threeMonthSwing.low
      )
    : null;

const sixMonthFib =
  swings.sixMonthSwing
    ? buildFibLevels(
        swings.sixMonthSwing.high,
        swings.sixMonthSwing.low
      )
    : null;

const oneYearFib =
  swings.oneYearSwing
    ? buildFibLevels(
        swings.oneYearSwing.high,
        swings.oneYearSwing.low
      )
    : null;
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

totalDeliveryDaily,
deliveryPctDaily,

weeklyPivot,
weeklyCPR,
weeklyVWAP,
totalVolumeWeekly,

totalDeliveryWeekly,
deliveryPctWeekly,

monthlyPivot,
monthlyCPR,
monthlyVWAP,
totalVolumeMonthly,

totalDeliveryMonthly,
deliveryPctMonthly,
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

    session:
      currentSession,

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



