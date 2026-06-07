export function calculateSwing(
  candles: any[]
) {

  if (!candles.length) {

    return null;

  }

  const highs =
    candles.map(
      (c) => c.high
    );

  const lows =
    candles.map(
      (c) => c.low
    );

  const high =
    Math.max(...highs);

  const low =
    Math.min(...lows);

  const range =
    high - low;

  return {

    high,

    low,

    range,

  };

}

export function calculateFib(
  high: number,
  low: number
) {

  const range =
    high - low;

  return {

    fib236:
      high -
      range * 0.236,

    fib382:
      high -
      range * 0.382,

    fib50:
      high -
      range * 0.50,

    fib618:
      high -
      range * 0.618,

    fib786:
      high -
      range * 0.786,

  };

}

export function calculatePivot(
  high: number,
  low: number,
  close: number
) {

  const pivot =
    (high + low + close) / 3;

  const r1 =
    (2 * pivot) - low;

  const s1 =
    (2 * pivot) - high;

  const r2 =
    pivot + (high - low);

  const s2 =
    pivot - (high - low);

  const r3 =
    high +
    2 * (
      pivot - low
    );

  const s3 =
    low -
    2 * (
      high - pivot
    );

  return {

    pivot,

    r1,

    r2,

    r3,

    s1,

    s2,

    s3,

  };

}

export function calculateCPR(
  high: number,
  low: number,
  close: number
) {

  const pivot =
    (high + low + close) / 3;

  const bc =
    (high + low) / 2;

  const tc =
    (pivot - bc) + pivot;

  return {

    pivot,

    bc,

    tc,

  };

}
export function calculateVWAP(
  candles: any[]
) {

  if (!candles.length) {
    return 0;
  }

  let totalPV = 0;
  let totalVolume = 0;

  candles.forEach((c) => {

    const typicalPrice =
      (c.high + c.low + c.close) / 3;

    totalPV +=
      typicalPrice * c.volume;

    totalVolume +=
      c.volume;

  });

  if (totalVolume === 0) {
    return 0;
  }

  return totalPV / totalVolume;

}

export function calculateAverageVolume(
  candles: any[]
) {

  if (!candles.length) {
    return 0;
  }

  const totalVolume =
    candles.reduce(
      (sum, c) =>
        sum + (c.volume || 0),
      0
    );

  return (
    totalVolume /
    candles.length
  );

}