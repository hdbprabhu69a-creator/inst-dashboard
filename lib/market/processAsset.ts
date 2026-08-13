import { Connect } from "kiteconnect";

import {
  buildDailyStructure,
  buildWeeklyStructure,
  buildMonthlyStructure,
  buildFibLevels,
} from "@/src/lib/marketStructureEngine";

import { buildAllSwings } from "@/src/lib/swingEngine";

import { getCompletedDailyCandle } from "@/src/lib/eodEngine";

import { getDailyCandles } from "@/src/lib/kiteData";

import { buildMetadata } from "@/src/lib/marketMetadata";

import { buildDeliveryData } from "@/lib/market/buildDeliveryData";

import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  calculatePivot,
  calculateCPR,
  calculateVWAP,
} from "@/src/lib/marketStructure";

export interface ProcessAssetContext {
  kite: Connect;

  instrumentMap: Map<string, number>;

  targetCollection: string;

  includeDelivery: boolean;

  skipNiftySymbols: boolean;
}

export interface ProcessAssetResult {
  status: "updated" | "ignored" | "failed";

  symbol: string;
}

export async function processAsset(
  stock: any,
  context: ProcessAssetContext
): Promise<ProcessAssetResult> {
  try {
    const symbol = stock.symbol;

    if (
      context.skipNiftySymbols &&
      symbol.includes("NIFTY")
    ) {
      return {
        status: "ignored",
        symbol,
      };
    }

    const instrumentToken =
      context.instrumentMap.get(
        stock.kiteSymbol
      );

    if (!instrumentToken) {
      return {
        status: "failed",
        symbol,
      };
    }

    const candles =
      await getDailyCandles(
        context.kite,
        Number(instrumentToken)
      );

    /*
     * AUTO POWER DIAGNOSTIC
     *
     * This confirms exactly what candle data
     * processAsset receives from Kite.
     */
    console.log(
      `[PROCESS ASSET] ${symbol} | CANDLE COUNT: ${
        candles?.length ?? 0
      } | FIRST: ${
        candles?.[0]?.date ?? "-"
      } | LAST: ${
        candles?.[candles.length - 1]?.date ?? "-"
      } | LAST HIGH: ${
        candles?.[candles.length - 1]?.high ?? "-"
      }`
    );

    if (
      !candles ||
      candles.length < 50
    ) {
      return {
        status: "failed",
        symbol,
      };
    }

    

    /*
     * AUTO POWER
     *
     * History was populated before EOD.
     * Use Firestore history for swings so the
     * swing engine uses the persisted candles.
     */

    let swingCandles = candles; try { const historyRef=collection(db,"universe",stock.id,"history"); const historySnap=await getDocs(query(historyRef,orderBy("date","asc"))); if(!historySnap.empty){ swingCandles=historySnap.docs.map(historyDoc=>{const h=historyDoc.data();return {date:h.date,open:Number(h.open),high:Number(h.high),low:Number(h.low),close:Number(h.close),volume:Number(h.volume??0)};}).sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()); const latest=swingCandles[swingCandles.length-1]; console.log(`[AUTO POWER HISTORY] ${symbol} | COUNT: ${swingCandles.length} | LATEST: ${latest?.date??"-"} | HIGH: ${latest?.high??"-"}`); } } catch(historyError){ console.error(`[AUTO POWER HISTORY] ${symbol}`,historyError); } /*
 * AUTO POWER STRUCTURE SOURCE
 *
 * Firestore history is the source of truth for the
 * latest completed trading candle.
 *
 * Kite candles remain the fallback when history
 * is unavailable.
 */

const structureCandles =
  swingCandles;

const lastCandle =
  getCompletedDailyCandle(
    structureCandles
  );

if (!lastCandle) {
  return {
    status: "failed",
    symbol,
  };
}

console.log(
  `[AUTO POWER STRUCTURE INPUT] ${symbol} | ` +
  `DATE: ${lastCandle.date} | ` +
  `OPEN: ${lastCandle.open} | ` +
  `HIGH: ${lastCandle.high} | ` +
  `LOW: ${lastCandle.low} | ` +
  `CLOSE: ${lastCandle.close}`
);

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

console.log(
  `[AUTO POWER DAILY PIVOT] ${symbol} | ` +
  `PIVOT: ${dailyPivot?.pivot ?? "-"} | ` +
  `S1: ${dailyPivot?.s1 ?? "-"} | ` +
  `R1: ${dailyPivot?.r1 ?? "-"}`
);

/*
 * AUTO POWER
 *
 * WEEKLY + MONTHLY STRUCTURE
 *
 * Source:
 * Firestore persisted completed daily history.
 *
 * Weekly:
 * Current completed calendar week.
 *
 * Monthly:
 * Previous completed calendar month.
 */

/* =========================
   WEEKLY STRUCTURE
   ========================= */

const latestStructureDate =
  new Date(
    lastCandle.date
  );

const latestDate =
  new Date(latestStructureDate);

latestDate.setHours(
  0,
  0,
  0,
  0
);

const latestDay =
  latestDate.getDay();
const daysFromMonday =
  latestDay === 0
    ? 6
    : latestDay - 1;

const currentWeekStart =
  new Date(latestStructureDate);

currentWeekStart.setDate(
  latestStructureDate.getDate() -
  daysFromMonday
);

currentWeekStart.setHours(
  0,
  0,
  0,
  0
);

const currentWeekEnd =
  new Date(currentWeekStart);

currentWeekEnd.setDate(
  currentWeekEnd.getDate() + 7
);

/*
 * WEEKLY PIVOT
 *
 * Always use the previous completed week.
 */

const weeklyStart =
  new Date(currentWeekStart);

const weeklyEnd =
  new Date(currentWeekEnd);

weeklyStart.setDate(
  weeklyStart.getDate() - 7
);

weeklyEnd.setDate(
  weeklyEnd.getDate() - 7
);

const weeklyCandlesForStructure =
  structureCandles.filter(
    (c: any) => {

      const d =
        new Date(c.date);

      d.setHours(
        0,
        0,
        0,
        0
      );

      return (
        d >= weeklyStart &&
        d < weeklyEnd
      );

    }
  );

console.log(
  `[AUTO POWER WEEKLY SOURCE] ${symbol} | ` +
  `FROM: ${weeklyStart.toISOString().split("T")[0]} | ` +
  `TO: ${new Date(
    weeklyEnd.getTime() - 86400000
  ).toISOString().split("T")[0]}`
);
const weeklyHigh =
  Math.max(
    ...weeklyCandlesForStructure.map(
      (c: any) => Number(c.high)
    )
  );

const weeklyLow =
  Math.min(
    ...weeklyCandlesForStructure.map(
      (c: any) => Number(c.low)
    )
  );

const weeklyClose =
  Number(
    weeklyCandlesForStructure[
      weeklyCandlesForStructure.length - 1
    ].close
  );

const weeklyVolume =
  weeklyCandlesForStructure.reduce(
    (sum: number, c: any) =>
      sum + Number(c.volume ?? 0),
    0
  );

const weeklyVWAP =
  calculateVWAP(
    weeklyCandlesForStructure
  );

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

const totalVolumeWeekly =
  weeklyVolume;

const weeklyOHLC = {

  high:
    weeklyHigh,

  low:
    weeklyLow,

  close:
    weeklyClose,

  volume:
    totalVolumeWeekly,

  vwap:
    weeklyVWAP,

};

console.log(
  `[AUTO POWER WEEKLY] ${symbol} | ` +
  `FROM: ${weeklyCandlesForStructure[0]?.date ?? "-"} | ` +
  `TO: ${
    weeklyCandlesForStructure[
      weeklyCandlesForStructure.length - 1
    ]?.date ?? "-"
  } | ` +
  `HIGH: ${weeklyHigh} | ` +
  `LOW: ${weeklyLow} | ` +
  `CLOSE: ${weeklyClose} | ` +
  `PIVOT: ${weeklyPivot.pivot}`
);

/* =========================
   MONTHLY STRUCTURE
   ========================= */

const latestYear =
  latestStructureDate.getFullYear();

const latestMonth =
  latestStructureDate.getMonth();

const previousMonthStart =
  new Date(
    latestYear,
    latestMonth - 1,
    1
  );

previousMonthStart.setHours(
  0,
  0,
  0,
  0
);

const currentMonthStart =
  new Date(
    latestYear,
    latestMonth,
    1
  );

currentMonthStart.setHours(
  0,
  0,
  0,
  0
);

const previousMonthCandlesForStructure =
  structureCandles.filter(
    (c: any) => {

      const d =
        new Date(c.date);

      return (
        d >= previousMonthStart &&
        d < currentMonthStart
      );

    }
  );

if (
  previousMonthCandlesForStructure.length === 0
) {

  return {
    status: "failed",
    symbol,
  };

}

const monthlyHigh =
  Math.max(
    ...previousMonthCandlesForStructure.map(
      (c: any) => Number(c.high)
    )
  );

const monthlyLow =
  Math.min(
    ...previousMonthCandlesForStructure.map(
      (c: any) => Number(c.low)
    )
  );

const monthlyClose =
  Number(
    previousMonthCandlesForStructure[
      previousMonthCandlesForStructure.length - 1
    ].close
  );

const monthlyVolume =
  previousMonthCandlesForStructure.reduce(
    (sum: number, c: any) =>
      sum + Number(c.volume ?? 0),
    0
  );

const monthlyVWAP =
  calculateVWAP(
    previousMonthCandlesForStructure
  );

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

const totalVolumeMonthly =
  monthlyVolume;

const monthlyOHLC = {

  high:
    monthlyHigh,

  low:
    monthlyLow,

  close:
    monthlyClose,

  volume:
    totalVolumeMonthly,

  vwap:
    monthlyVWAP,

};

console.log(
  `[AUTO POWER MONTHLY] ${symbol} | ` +
  `FROM: ${
    previousMonthCandlesForStructure[0]?.date ?? "-"
  } | ` +
  `TO: ${
    previousMonthCandlesForStructure[
      previousMonthCandlesForStructure.length - 1
    ]?.date ?? "-"
  } | ` +
  `HIGH: ${monthlyHigh} | ` +
  `LOW: ${monthlyLow} | ` +
  `CLOSE: ${monthlyClose} | ` +
  `PIVOT: ${monthlyPivot.pivot}`
);

/* =========================
   DELIVERY
   ========================= */

const completedWeekDates =
  new Set<string>(
    weeklyCandlesForStructure.map(
      (c: any) =>
        new Date(c.date)
          .toISOString()
          .split("T")[0]
    )
  );

const completedMonthDates =
  new Set<string>(
    previousMonthCandlesForStructure.map(
      (c: any) =>
        new Date(c.date)
          .toISOString()
          .split("T")[0]
    )
  );

const {
  totalDeliveryDaily,
  deliveryPctDaily,

  totalDeliveryWeekly,
  deliveryPctWeekly,

  totalDeliveryMonthly,
  deliveryPctMonthly,

} =
  await buildDeliveryData(
    symbol,
    completedWeekDates,
    completedMonthDates,
    context.includeDelivery
  );

const swings=buildAllSwings(swingCandles); console.log(`[AUTO POWER SWING] ${symbol} | 1W HIGH: ${swings.oneWeekSwing?.high??"-"} | 1W HIGH DATE: ${swings.oneWeekSwing?.highDate??"-"}`); const oneWeekFib =
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
        context.targetCollection,
        symbol
      ),
      {
        symbol,

        instrumentToken,

        cmp:
          lastCandle.close,

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

    console.log(
      `[MARKET STRUCTURE] ${symbol} UPDATED`
    );

    return {
      status: "updated",
      symbol,
    };

  } catch (error) {
    console.error(
      `[PROCESS ASSET] ${stock.symbol}`,
      error
    );

    return {
      status: "failed",
      symbol: stock.symbol,
    };
  }
}






