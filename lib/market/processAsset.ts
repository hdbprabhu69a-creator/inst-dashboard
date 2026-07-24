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

import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface ProcessAssetContext{

    kite:Connect;

    instrumentMap:Map<string,number>;

    targetCollection:string;

    includeDelivery:boolean;

    skipNiftySymbols:boolean;

    

}

export interface ProcessAssetResult{

    status:"updated"|"ignored"|"failed";

    symbol:string;

}

export async function processAsset(
    stock:any,
    context:ProcessAssetContext):Promise<ProcessAssetResult>{

    try{

        
        const symbol =
          stock.symbol;

      if (
          context.skipNiftySymbols &&
          symbol.includes("NIFTY")
      ) {

        return {

            status:"ignored",

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
          await getDailyCandles(context.kite,
            Number(
              instrumentToken
            )
          );

       if (!candles || candles.length < 50) {

    return {

        status: "failed",

        symbol,

    };

}
        const lastCandle =
          getCompletedDailyCandle(
            candles
          );

       if (!lastCandle) {

    return {

        status: "failed",

        symbol,

    };

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

    return {

        status: "failed",

        symbol,

    };

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

    return {

        status: "failed",

        symbol,

    };

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
const {
  totalDeliveryDaily,
  deliveryPctDaily,

  totalDeliveryWeekly,
  deliveryPctWeekly,

  totalDeliveryMonthly,
  deliveryPctMonthly,
} = await buildDeliveryData(

    symbol,

    completedWeekDates,

    completedMonthDates,

    context.includeDelivery,

);
   
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
    context.targetCollection,
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
        return{

            status:"updated",

            symbol,

        };
}catch(error){

        console.error(error);

        return{

            status:"failed",

            symbol:stock.symbol,

        };

    }

}










