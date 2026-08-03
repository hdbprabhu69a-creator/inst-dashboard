import {
  getPreviousCompletedWeekCandles,
getPreviousTwoCompletedWeekCandles,

getCompletedMonthlyCandles,
getPreviousThreeCompletedMonthCandles,
getPreviousSixCompletedMonthCandles,
getPreviousTwelveCompletedMonthCandles,
} from "@/src/lib/eodEngine";



export function buildSwing(
  candles:any[]
){

  if(!candles?.length)
    return null;

  const highCandle=
    candles.reduce((a,b)=>
      b.high>a.high?b:a
    );

  const lowCandle=
    candles.reduce((a,b)=>
      b.low<a.low?b:a
    );

  return{

    high:highCandle.high,

    low:lowCandle.low,

    range:Number(
      (
        highCandle.high-
        lowCandle.low
      ).toFixed(2)
    ),

    highDate:highCandle.date,

    lowDate:lowCandle.date,

  };

}

export function buildAllSwings(
  candles:any[]
){

  const oneWeek=
    getPreviousCompletedWeekCandles(candles);

  const twoWeek=
getPreviousTwoCompletedWeekCandles(
candles
);

const oneMonth=
    getCompletedMonthlyCandles(candles);

  const threeMonth=
getPreviousThreeCompletedMonthCandles(
candles
);

  const sixMonth=
getPreviousSixCompletedMonthCandles(
candles
);

  const oneYear=
getPreviousTwelveCompletedMonthCandles(
candles
);

  return{

    oneWeekSwing:
      buildSwing(oneWeek),

    twoWeekSwing:
      buildSwing(twoWeek),

    oneMonthSwing:
      buildSwing(oneMonth),

    threeMonthSwing:
      buildSwing(threeMonth),

    sixMonthSwing:
      buildSwing(sixMonth),

    oneYearSwing:
      buildSwing(oneYear),

  };

}

