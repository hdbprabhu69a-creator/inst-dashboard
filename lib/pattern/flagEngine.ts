import {
  PatternResult,
  SwingPoint,
  TrendLine,
} from "./types";

import {
  buildTrendLines,
  getBestTrendLine,
} from "./trendlineEngine";

export function detectBullFlag(
  swings: SwingPoint[]
): PatternResult | null {

  const highs =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lows =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if (!highs || !lows)
    return null;

  if (
    highs.slope >= 0
  )
    return null;

  if (
    lows.slope >= 0
  )
    return null;

  if (
    Math.abs(
      highs.slope -
      lows.slope
    ) > 0.15
  )
    return null;

  return buildFlag(

    "BULL_FLAG",

    highs,

    lows

  );

}

export function detectBearFlag(
  swings: SwingPoint[]
): PatternResult | null {

  const highs =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lows =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if (!highs || !lows)
    return null;

  if (
    highs.slope <= 0
  )
    return null;

  if (
    lows.slope <= 0
  )
    return null;

  if (
    Math.abs(
      highs.slope -
      lows.slope
    ) > 0.15
  )
    return null;

  return buildFlag(

    "BEAR_FLAG",

    highs,

    lows

  );

}

function buildFlag(

  pattern:
    PatternResult["pattern"],

  upper:
    TrendLine,

  lower:
    TrendLine

): PatternResult {

  const height =

    Math.abs(

      upper.start.price -

      lower.start.price

    );

  const breakout =

    upper.end.price;

  const stoploss =

    lower.end.price;

  const target =

    pattern ===
    "BULL_FLAG"

      ? breakout +
        height

      : breakout -
        height;

  let confidence = 70;

  confidence +=

    upper.touches * 4;

  confidence +=

    lower.touches * 4;

  if (!upper.broken)
    confidence += 6;

  if (!lower.broken)
    confidence += 6;

  confidence =

    Math.min(
      confidence,
      100
    );

  return {

    pattern,

    confidence,

    breakout,

    stoploss,

    target,

    swings: [

      upper.start,

      upper.end,

      lower.start,

      lower.end,

    ],

    trendLines: [

      upper,

      lower,

    ],

    points: [

      {

        label: "A",

        swing:
          upper.start,

      },

      {

        label: "B",

        swing:
          lower.start,

      },

      {

        label: "C",

        swing:
          upper.end,

      },

      {

        label: "D",

        swing:
          lower.end,

      },

    ],

  };

}
