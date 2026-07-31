export type TrendConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";

export interface TrendConfidenceResult {
  score: number;
  confidence: TrendConfidence;
}

import { TrendStrengthResult } from "./trendStrength";

export function trendConfidence(
  strength: TrendStrengthResult,
  integrity: boolean,
  phase: string
): TrendConfidenceResult {

  let score = strength.score;

  if (integrity) score += 10;

  switch (phase) {
    case "STRONG_UPTREND":
    case "CONFIRMED_UPTREND":
    case "CONFIRMED_DOWNTREND":
      score += 10;
      break;

    case "PULLBACK":
    case "RECOVERY":
      score -= 10;
      break;
  }

  score = Math.max(0, Math.min(100, score));

  let confidence: TrendConfidence;

  if (score >= 85)
    confidence = "VERY_HIGH";
  else if (score >= 70)
    confidence = "HIGH";
  else if (score >= 50)
    confidence = "MEDIUM";
  else
    confidence = "LOW";

  return {
    score,
    confidence
  };
}

