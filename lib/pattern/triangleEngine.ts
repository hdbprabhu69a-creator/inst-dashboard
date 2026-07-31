import { AnalysisContext } from "./analysisContext";
import { SwingPoint,
  TrendLine,
  PatternResult,
 } from "./types";

import {
  buildTrendLines,
  getBestTrendLine,
} from "./trendlineEngine";

export function detectAscendingTriangle(context: AnalysisContext): PatternResult | null {

  const swings = context.swings;

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
    Math.abs(upper.slope) > 0.05
  )
    return null;

  if (
    lower.slope <= 0
  )
    return null;

  return buildPattern(
    "ASC_TRIANGLE",
    upper,
    lower
  );

}

export function detectDescendingTriangle(context: AnalysisContext): PatternResult | null {

  const swings = context.swings;

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
    upper.slope >= 0
  )
    return null;

  if (
    Math.abs(lower.slope) > 0.05
  )
    return null;

  return buildPattern(
    "DESC_TRIANGLE",
    upper,
    lower
  );

}

export function detectSymTriangle(context: AnalysisContext): PatternResult | null {

  const swings = context.swings;

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
    upper.slope >= 0
  )
    return null;

  if (
    lower.slope <= 0
  )
    return null;

  return buildPattern(
    "SYM_TRIANGLE",
    upper,
    lower
  );

}

function buildPattern(

  type: PatternResult["pattern"],

  upper: TrendLine,

  lower: TrendLine

): PatternResult {

  const breakout =
    upper.end.price;

  const stoploss =
    lower.end.price;

  const height =
    upper.start.price -
    lower.start.price;

  const target =
    breakout + height;

  const confidence =
    calculateConfidence(
      upper,
      lower
    );

  return {

    pattern: type,

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
        swing: upper.start,
      },

      {
        label: "B",
        swing: lower.start,
      },

      {
        label: "C",
        swing: upper.end,
      },

      {
        label: "D",
        swing: lower.end,
      },

    ],

  };

}

function calculateConfidence(

  upper: TrendLine,

  lower: TrendLine

): number {

  let score = 60;

  score +=
    upper.touches * 5;

  score +=
    lower.touches * 5;

  if (!upper.broken)
    score += 10;

  if (!lower.broken)
    score += 10;

  return Math.min(
    score,
    100
  );

}



