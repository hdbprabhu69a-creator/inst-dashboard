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
calculateVWAP,
calculateAverageVolume,
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

    const latestDay =
  candles[
    candles.length - 1
  ];

    const dailyPivot =
  calculatePivot(
    latestDay.high,
    latestDay.low,
    latestDay.close
  );

const dailyCPR =
  calculateCPR(
    latestDay.high,
    latestDay.low,
    latestDay.close
  );

const dailyVWAP =
  calculateVWAP(
    [latestDay]
  );

const avgVolumeDaily =
  latestDay.volume || 0;

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

 const latestWeekCandles =
  candles.filter(
    (c: any) => {

      const d =
        new Date(
          c.date
        );

      return (
        d >=
        startOfCurrentWeek
      );

    }
  );
   if (
  latestWeekCandles.length === 0
)
    {

      failed++;

      failedSymbols.push(
        symbol
      );

      continue;

    }

    const weeklyHigh =
      Math.max(
        ...latestWeekCandles.map(
          (c: any) =>
            c.high
        )
      );

    const weeklyLow =
      Math.min(
        ...latestWeekCandles.map(
          (c: any) =>
            c.low
        )
      );

    const weeklyClose =
      latestWeekCandles[
        latestWeekCandles.length - 1
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

    const weeklyVWAP =
  calculateVWAP(
    latestWeekCandles
  );

const avgVolumeWeekly =
  calculateAverageVolume(
    latestWeekCandles
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
            d.getMonth() === targetMonth &&
            d.getFullYear() === targetYear
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

    const monthlyVWAP =
  calculateVWAP(
    previousMonthCandles
  );

const avgVolumeMonthly =
  calculateAverageVolume(
    previousMonthCandles
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
        dailyVWAP,
        avgVolumeDaily,

        weeklyPivot,
        weeklyCPR,
        weeklyVWAP,
        avgVolumeWeekly,

        monthlyPivot,
        monthlyCPR,
        monthlyVWAP,
        avgVolumeMonthly,

        weeklyFib,
        monthlyFib,

        dailySwing,
        weeklySwing,
        monthlySwing,

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

        updatedAt:
          new Date()
            .toISOString(),

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
