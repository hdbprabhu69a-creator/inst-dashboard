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

  const previousWeekCandles =
    getCompletedWeeklyCandles(
      candles
    );

  if (
    !previousWeekCandles ||
    previousWeekCandles.length === 0
  ) {
    return null;
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

  const weeklyVWAP =
    calculateVWAP(
      previousWeekCandles
    );

  const totalVolumeWeekly =
    calculateTotalVolume(
      previousWeekCandles
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