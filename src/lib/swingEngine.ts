export function buildSwing(
  candles: any[]
) {

  if (
    !candles ||
    candles.length === 0
  ) {
    return null;
  }

  const highCandle =
    candles.reduce(
      (prev, current) =>
        current.high > prev.high
          ? current
          : prev
    );

  const lowCandle =
    candles.reduce(
      (prev, current) =>
        current.low < prev.low
          ? current
          : prev
    );

  return {

    high:
      highCandle.high,

    low:
      lowCandle.low,

    range:
      Number(
        (
          highCandle.high -
          lowCandle.low
        ).toFixed(2)
      ),

    highDate:
      highCandle.date,

    lowDate:
      lowCandle.date,

  };

}

export function getPeriodCandles(
  candles: any[],
  days: number
) {

  if (
    !candles ||
    candles.length === 0
  ) {
    return [];
  }

  const endDate =
    new Date(
      candles[
        candles.length - 1
      ].date
    );

  const startDate =
    new Date(endDate);

  startDate.setDate(
    startDate.getDate() -
    days
  );

  return candles.filter(
    (c: any) => {

      const d =
        new Date(c.date);

      return (
        d >= startDate
      );

    }
  );

}

export function buildAllSwings(
  candles: any[]
) {

  return {

    oneWeekSwing:
      buildSwing(
        getPeriodCandles(
          candles,
          7
        )
      ),

    twoWeekSwing:
      buildSwing(
        getPeriodCandles(
          candles,
          14
        )
      ),

    oneMonthSwing:
      buildSwing(
        getPeriodCandles(
          candles,
          30
        )
      ),

    threeMonthSwing:
      buildSwing(
        getPeriodCandles(
          candles,
          90
        )
      ),

    sixMonthSwing:
      buildSwing(
        getPeriodCandles(
          candles,
          180
        )
      ),

    oneYearSwing:
      buildSwing(
        getPeriodCandles(
          candles,
          365
        )
      ),

  };

}