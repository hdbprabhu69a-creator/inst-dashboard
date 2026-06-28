import {
  PatternResult,
  SwingPoint,
  TrendLine,
} from "./types";

import {
  buildTrendLines,
  getBestTrendLine,
} from "./trendlineEngine";

export function detectRisingChannel(
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
    Math.abs(
      upper.slope -
      lower.slope
    ) > 0.15
  )
    return null;

  return buildChannel(
    "CHANNEL",
    upper,
    lower
  );

}

export function detectFallingChannel(
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
    Math.abs(
      upper.slope -
      lower.slope
    ) > 0.15
  )
    return null;

  return buildChannel(
    "CHANNEL",
    upper,
    lower
  );

}

function buildChannel(

  pattern:
    PatternResult["pattern"],

  upper:
    TrendLine,

  lower:
    TrendLine

): PatternResult {

  const height =

    upper.start.price -

    lower.start.price;

  const breakout =

    upper.end.price;

  const stoploss =

    lower.end.price;

  const target =

    breakout +

    height;

  let confidence = 65;

  confidence +=

    upper.touches * 4;

  confidence +=

    lower.touches * 4;

  if (!upper.broken)
    confidence += 8;

  if (!lower.broken)
    confidence += 8;

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