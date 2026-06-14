import {

  calculatePivot,

  calculateCPR,

  calculateVWAP,

  calculateTotalVolume,

} from "@/src/lib/marketStructure";

import {

  getCompletedWeeklyCandles,

  getCompletedMonthlyCandles,

} from "@/src/lib/eodEngine";

export function buildFibLevels(
  high: number,
  low: number
) {

  const range =
    high - low;

  return {

    fib236: Number(
      (
        high -
        range * 0.236
      ).toFixed(2)
    ),

    fib382: Number(
      (
        high -
        range * 0.382
      ).toFixed(2)
    ),

    fib50: Number(
      (
        high -
        range * 0.5
      ).toFixed(2)
    ),

    fib618: Number(
      (
        high -
        range * 0.618
      ).toFixed(2)
    ),

    fib786: Number(
      (
        high -
        range * 0.786
      ).toFixed(2)
    ),

  };

}

export function buildDailyStructure(
  lastCandle: any
) {

  const dailyVWAP =
    calculateVWAP(
      [lastCandle]
    );

  return {

    dailyPivot:
      calculatePivot(
        lastCandle.high,
        lastCandle.low,
        lastCandle.close
      ),

    dailyCPR:
      calculateCPR(
        lastCandle.high,
        lastCandle.low,
        lastCandle.close
      ),

    dailyVWAP,

    totalVolumeDaily:
      lastCandle.volume || 0,

    dailyOHLC: {

      open:
        lastCandle.open,

      high:
        lastCandle.high,

      low:
        lastCandle.low,

      close:
        lastCandle.close,

      volume:
        lastCandle.volume || 0,

      vwap:
        dailyVWAP,

    },

  };

}

export function buildWeeklyStructure(
  candles: any[],
  today: Date
) {

 const weeklyCandles =
  getCompletedWeeklyCandles(
    candles
  );

  if (
    !weeklyCandles ||
    weeklyCandles.length === 0
  ) {

    return null;

  }

  const weeklyHigh =
    Math.max(
      ...weeklyCandles.map(
        (c: any) => c.high
      )
    );

  const weeklyLow =
    Math.min(
      ...weeklyCandles.map(
        (c: any) => c.low
      )
    );

  const weeklyClose =
    weeklyCandles[
      weeklyCandles.length - 1
    ].close;

  const weeklyVWAP =
    calculateVWAP(
      weeklyCandles
    );

  const totalVolumeWeekly =
    calculateTotalVolume(
      weeklyCandles
    );

  return {

    weeklyPivot:
      calculatePivot(
        weeklyHigh,
        weeklyLow,
        weeklyClose
      ),

    weeklyCPR:
      calculateCPR(
        weeklyHigh,
        weeklyLow,
        weeklyClose
      ),

    weeklyVWAP,

    totalVolumeWeekly,

    weeklyOHLC: {

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

    },

  };

}

export function buildMonthlyStructure(
  candles: any[],
  today: Date
) {

  const previousMonthCandles =
    getCompletedMonthlyCandles(
      candles
    );

  if (
    !previousMonthCandles ||
    previousMonthCandles.length === 0
  ) {

    return null;

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

  const monthlyVWAP =
    calculateVWAP(
      previousMonthCandles
    );

  const totalVolumeMonthly =
    calculateTotalVolume(
      previousMonthCandles
    );

  return {

    monthlyPivot:
      calculatePivot(
        monthlyHigh,
        monthlyLow,
        monthlyClose
      ),

    monthlyCPR:
      calculateCPR(
        monthlyHigh,
        monthlyLow,
        monthlyClose
      ),

    monthlyVWAP,

    totalVolumeMonthly,

    monthlyOHLC: {

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

    },

  };

}