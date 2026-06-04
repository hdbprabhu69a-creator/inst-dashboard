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
  calculateFib,
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

    const snapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    const stocks =
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
          stock.instrumentToken;

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

        const today =
          new Date();

        const day =
          today.getDay();

        const daysFromMonday =
          day === 0
            ? 6
            : day - 1;

        const startOfCurrentWeek =
          new Date(today);

        startOfCurrentWeek.setDate(
          today.getDate() -
          daysFromMonday
        );

        startOfCurrentWeek.setHours(
          0,
          0,
          0,
          0
        );

        const startOfPreviousWeek =
          new Date(
            startOfCurrentWeek
          );

        startOfPreviousWeek.setDate(
          startOfPreviousWeek.getDate() - 7
        );

        const endOfPreviousWeek =
          new Date(
            startOfCurrentWeek
          );

        endOfPreviousWeek.setMilliseconds(
          -1
        );

        const previousWeekCandles =
          candles.filter(
            (c: any) => {

              const d =
                new Date(
                  c.date
                );

              return (
                d >=
                  startOfPreviousWeek &&
                d <=
                  endOfPreviousWeek
              );

            }
          );

        if (
          previousWeekCandles.length === 0
        ) {

          failed++;

          failedSymbols.push(
            symbol
          );

          continue;

        }

        const weeklyHigh =
          Math.max(
            ...previousWeekCandles.map(
              (c: any) =>
                c.high
            )
          );

        const weeklyLow =
          Math.min(
            ...previousWeekCandles.map(
              (c: any) =>
                c.low
            )
          );

        const weeklyClose =
          previousWeekCandles[
            previousWeekCandles.length - 1
          ].close;

        const weeklyPivot =
          calculatePivot(
            weeklyHigh,
            weeklyLow,
            weeklyClose
          );

        const weeklyCPR =
          calculateCPR(
            weeklyHigh,
            weeklyLow,
            weeklyClose
          );

        const weeklyFib =
          calculateFib(
            weeklyHigh,
            weeklyLow
          );

        let targetMonth =
          today.getMonth() - 1;

        let targetYear =
          today.getFullYear();

        if (
          targetMonth < 0
        ) {

          targetMonth = 11;

          targetYear--;

        }

        const previousMonthCandles =
          candles.filter(
            (c: any) => {

              const d =
                new Date(
                  c.date
                );

              return (

                d.getMonth() ===
                  targetMonth &&

                d.getFullYear() ===
                  targetYear

              );

            }
          );

        if (
          previousMonthCandles.length === 0
        ) {

          failed++;

          failedSymbols.push(
            symbol
          );

          continue;

        }

        const monthlyHigh =
          Math.max(
            ...previousMonthCandles.map(
              (c: any) =>
                c.high
            )
          );

        const monthlyLow =
          Math.min(
            ...previousMonthCandles.map(
              (c: any) =>
                c.low
            )
          );

        const monthlyClose =
          previousMonthCandles[
            previousMonthCandles.length - 1
          ].close;

        const monthlyPivot =
          calculatePivot(
            monthlyHigh,
            monthlyLow,
            monthlyClose
          );

        const monthlyCPR =
          calculateCPR(
            monthlyHigh,
            monthlyLow,
            monthlyClose
          );

        const monthlyFib =
          calculateFib(
            monthlyHigh,
            monthlyLow
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

            weeklyOHLC: {
              high:
                weeklyHigh,
              low:
                weeklyLow,
              close:
                weeklyClose,
            },

            monthlyOHLC: {
              high:
                monthlyHigh,
              low:
                monthlyLow,
              close:
                monthlyClose,
            },

            weeklyPivot,
            monthlyPivot,

            weeklyCPR,
            monthlyCPR,

            weeklyFib,
            monthlyFib,

            dailySwing,
            weeklySwing,
            monthlySwing,

            updatedAt:
              new Date()
                .toISOString(),

          },

          {
            merge: true,
          }

        );

        updated++;

        updatedSymbols.push(
          symbol
        );

      } catch {

        failed++;

        failedSymbols.push(
          stock.symbol
        );

      }

    }

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