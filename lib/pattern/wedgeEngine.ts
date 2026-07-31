import {
  PatternResult,
  SwingPoint,
  TrendLine,
} from "./types";

import {
  buildTrendLines,
  getBestTrendLine,
} from "./trendlineEngine";

export function detectRisingWedge(
  swings: SwingPoint[]
): PatternResult | null {

  const upper =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lower =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if (!upper || !lower)
    return null;

  if (
    upper.slope <= 0 ||
    lower.slope <= 0
  )
    return null;

  if (
    upper.slope <=
    lower.slope
  )
    return null;

  return buildWedge(
    "RISING_WEDGE",
    upper,
    lower
  );

}

export function detectFallingWedge(
  swings: SwingPoint[]
): PatternResult | null {

  const upper =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lower =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if (!upper || !lower)
    return null;

  if (
    upper.slope >= 0 ||
    lower.slope >= 0
  )
    return null;

  if (
    upper.slope >=
    lower.slope
  )
    return null;

  return buildWedge(
    "FALLING_WEDGE",
    upper,
    lower
  );

}

function buildWedge(

  pattern:
    PatternResult["pattern"],

  upper:
    TrendLine,

  lower:
    TrendLine

): PatternResult {

  const height = Math.abs(

    upper.start.price -

    lower.start.price

  );

  const breakout =

    upper.end.price;

  const stoploss =

    lower.end.price;

  const target =

    pattern ===
    "RISING_WEDGE"

      ? stoploss -
        height

      : breakout +
        height;

  let confidence = 72;

  confidence +=
    upper.touches * 4;

  confidence +=
    lower.touches * 4;

  if (!upper.broken)
    confidence += 6;

  if (!lower.broken)
    confidence += 6;

  confidence = Math.min(
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
