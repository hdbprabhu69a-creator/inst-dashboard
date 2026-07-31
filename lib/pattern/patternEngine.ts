import {
  Candle,
  PatternResult,
} from "./types";

import {
  detectSwings,
} from "./swing";

import {
  createAnalysisContext,
} from "./analysisContext";

import {
  detectAscendingTriangle,
  detectDescendingTriangle,
  detectSymTriangle,
} from "./triangleEngine";

import {
  detectRisingChannel,
  detectFallingChannel,
} from "./channelEngine";

import {
  detectBullFlag,
  detectBearFlag,
} from "./flagEngine";

import {
  detectRisingWedge,
  detectFallingWedge,
} from "./wedgeEngine";

import {
  detectHeadShoulder,
  detectInverseHeadShoulder,
} from "./headShoulderEngine";

import {
  detectDoubleTop,
  detectDoubleBottom,
} from "./doubleTopEngine";

import {
  detectCupHandle,
} from "./cupHandleEngine";

import {
  analyzePatternResult,
} from "./analyzePatternResult";

export function analyzePattern(
  candles: Candle[]
): PatternResult | null {

  if (candles.length < 20)
    return null;

  const swings =
    detectSwings(
      candles
    );

  const context =
    createAnalysisContext(
      candles
    );

  const candidates: PatternResult[] = [];

  const detectors = [

    () =>
      detectAscendingTriangle(
        context
      ),

    () =>
      detectDescendingTriangle(
        context
      ),

    () =>
      detectSymTriangle(
        context
      ),

    () =>
      detectRisingChannel(
        swings
      ),

    () =>
      detectFallingChannel(
        swings
      ),

    () =>
      detectBullFlag(
        swings
      ),

    () =>
      detectBearFlag(
        swings
      ),

    () =>
      detectRisingWedge(
        swings
      ),

    () =>
      detectFallingWedge(
        swings
      ),

    () =>
      detectHeadShoulder(
        swings
      ),

    () =>
      detectInverseHeadShoulder(
        swings
      ),

    () =>
      detectDoubleTop(
        swings
      ),

    () =>
      detectDoubleBottom(
        swings
      ),

    () =>
      detectCupHandle(
        swings
      ),

  ];

 for (const detector of detectors) {

  const result = detector();

  if (!result)
    continue;

  const structure = null;

  const structureScore = 80;

  const trendScore = 75;

  const volumeScore = 70;

  candidates.push(result);

}
  if (
    candidates.length === 0
  )
    return null;

  candidates.sort(

    (a, b) =>

      b.confidence -

      a.confidence

  );

  return analyzePatternResult(
    candidates[0]
  ) as any;

}

export function analyzeAllPatterns(
  candles: Candle[]
): PatternResult[] {

  if (candles.length < 20)
    return [];

  const swings =
    detectSwings(
      candles
    );

  const context =
    createAnalysisContext(
      candles
    );

  const results: PatternResult[] = [];

  const patterns = [

    detectAscendingTriangle(
      context
    ),

    detectDescendingTriangle(
      context
    ),

    detectSymTriangle(
      context
    ),

    detectRisingChannel(
      swings
    ),

    detectFallingChannel(
      swings
    ),

    detectBullFlag(
      swings
    ),

    detectBearFlag(
      swings
    ),

    detectRisingWedge(
      swings
    ),

    detectFallingWedge(
      swings
    ),

    detectHeadShoulder(
      swings
    ),

    detectInverseHeadShoulder(
      swings
    ),

    detectDoubleTop(
      swings
    ),

    detectDoubleBottom(
      swings
    ),

    detectCupHandle(
      swings
    ),

  ];

  for (const pattern of patterns) {

    if (!pattern)
      continue;

    const structure = null;

    const structureScore = 80;

    const trendScore = 75;

    const volumeScore = 70;

    results.push(pattern);

  }

  return results.sort(

    (a, b) =>

      b.confidence -

      a.confidence

  );

}














