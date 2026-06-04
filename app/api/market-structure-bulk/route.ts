import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  calculatePivot,
  calculateCPR,
  calculateSwing,
} from "@/src/lib/marketStructure";

export async function GET() {

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

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    const stocks =
      universeSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

    let saved = 0;
    let skipped = 0;
    let failed = 0;
    let ignored = 0;

    const savedSymbols: string[] = [];
    const skippedSymbols: string[] = [];
    const failedSymbols: string[] = [];
    const ignoredSymbols: string[] = [];

    for (const stock of stocks) {

      const symbol =
        stock.symbol;

      try {

        // Ignore NIFTY / INDEX symbols

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
          stock.instrumentToken;

        const existing =
          await getDoc(
            doc(
              db,
              "marketStructure",
              symbol
            )
          );

        if (
          existing.exists()
        ) {

          skipped++;

          skippedSymbols.push(
            symbol
          );

          continue;

        }

        const to =
          new Date();

        const from =
          new Date();

        from.setDate(
          from.getDate() - 400
        );

        const candles =
          await kite.getHistoricalData(
            Number(
              instrumentToken
            ),
            "day",
            from,
            to
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
          candles[
            candles.length - 1
          ];

        const prevDay =
          candles[
            candles.length - 2
          ];

        const dailyPivot =
          calculatePivot(
            prevDay.high,
            prevDay.low,
            prevDay.close
          );

        const dailyCPR =
          calculateCPR(
            prevDay.high,
            prevDay.low,
            prevDay.close
          );

        const dailySwing =
          calculateSwing(
            candles.slice(-20)
          );

        const weeklySwing =
          calculateSwing(
            candles.slice(-60)
          );

        const monthlySwing =
          calculateSwing(
            candles
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
              lastCandle.close,

            dailyPivot,

            dailyCPR,

            dailySwing,

            weeklySwing,

            monthlySwing,

            updatedAt:
              new Date()
                .toISOString(),

          }

        );

        saved++;

        savedSymbols.push(
          symbol
        );

      } catch (error) {

        failed++;

        failedSymbols.push(
          symbol
        );

        console.log(
          "FAILED:",
          symbol,
          error
        );

      }

    }

    return NextResponse.json({

      success: true,

      total:
        stocks.length,

      saved,

      skipped,

      failed,

      ignored,

      savedSymbols,

      skippedSymbols,

      failedSymbols,

      ignoredSymbols,

      message:
        "BULK COMPLETE",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}