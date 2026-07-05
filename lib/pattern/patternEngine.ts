import { buildPatternDrawing } from "./PatternDrawingFactory";
import {
  Candle,
  PatternResult,
} from "./types";

import {
  detectSwings,
} from "./swing";

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
  scorePattern,
} from "./patternScore";

export function analyzePattern(
  candles: Candle[]
): PatternResult | null {

  if (candles.length < 20)
    return null;

  const swings =
    detectSwings(
      candles
    );

  const candidates: PatternResult[] = [];

  const detectors = [

    () =>
      detectAscendingTriangle(
        swings
      ),

    () =>
      detectDescendingTriangle(
        swings
      ),

    () =>
      detectSymTriangle(
        swings
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

    const result =
      detector();

    if (!result)
      continue;

    candidates.push(

      scorePattern(
        result
      )

    );

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

  const best =
  candidates[0];

best.drawing =
  buildPatternDrawing(
    best
  )!;

return best;

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

  const results: PatternResult[] = [];

  const detectors = [

    detectAscendingTriangle,

    detectDescendingTriangle,

    detectSymTriangle,

    detectRisingChannel,

    detectFallingChannel,

    detectBullFlag,

    detectBearFlag,

    detectRisingWedge,

    detectFallingWedge,

    detectHeadShoulder,

    detectInverseHeadShoulder,

    detectDoubleTop,

    detectDoubleBottom,

    detectCupHandle,

  ];

  for (const detector of detectors) {

    const pattern =
      detector(
        swings
      );

    if (!pattern)
      continue;

    results.push(

      scorePattern(
        pattern
      )

    );

  }

  return results.sort(

    (a, b) =>

      b.confidence -

      a.confidence

  );

}


