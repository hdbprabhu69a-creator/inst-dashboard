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
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

import {
  calculatePivot,
  calculateCPR,
} from "@/src/lib/marketStructure";

export async function GET() {

  try {

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
    const voltas: any =
  stocks.find(
    (stock: any) =>
      stock.symbol ===
      "VOLTAS"
  );
    if (!voltas) {

      return NextResponse.json({
        success: false,
        error: "VOLTAS not found",
      });

    }

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
          voltas.instrumentToken
        ),
        "day",
        from,
        to
      );

    if (
      !candles ||
      candles.length < 50
    ) {

      return NextResponse.json({
        success: false,
        error:
          "Insufficient candles",
      });

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
            new Date(c.date);

          return (
            d >= startOfPreviousWeek &&
            d <= endOfPreviousWeek
          );

        }
      );

    if (
      previousWeekCandles.length === 0
    ) {

      throw new Error(
        "No previous week candles"
      );

    }

    const weeklyHigh =
      Math.max(
        ...previousWeekCandles.map(
          (c: any) => c.high
        )
      );

    const weeklyLow =
      Math.min(
        ...previousWeekCandles.map(
          (c: any) => c.low
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
            new Date(c.date);

          return (
            d.getMonth() === targetMonth &&
            d.getFullYear() === targetYear
          );

        }
      );

    if (
      previousMonthCandles.length === 0
    ) {

      throw new Error(
        "No previous month candles"
      );

    }

    const monthlyHigh =
      Math.max(
        ...previousMonthCandles.map(
          (c: any) => c.high
        )
      );

    const monthlyLow =
      Math.min(
        ...previousMonthCandles.map(
          (c: any) => c.low
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

    await setDoc(

      doc(
        db,
        "marketStructure",
        voltas.symbol
      ),

      {

        symbol:
          voltas.symbol,

        instrumentToken:
          voltas.instrumentToken,

        cmp:
          lastCandle.close,

        dailyPivot,
        weeklyPivot,
        monthlyPivot,

        dailyCPR,
        weeklyCPR,
        monthlyCPR,

        weeklyOHLC: {
          high: weeklyHigh,
          low: weeklyLow,
          close: weeklyClose,
        },

        monthlyOHLC: {
          high: monthlyHigh,
          low: monthlyLow,
          close: monthlyClose,
        },

        updatedAt:
          new Date()
            .toISOString(),

      }

    );

    return NextResponse.json({

      success: true,

      saved: true,

      symbol:
        voltas.symbol,

      weeklyPivot:
        weeklyPivot.pivot,

      monthlyPivot:
        monthlyPivot.pivot,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}



