import { PatternResult } from "./types";
import { MarketRegime } from "./marketRegime";

export type Prediction = {
  direction: "UP" | "DOWN" | "SIDE";
  confidence: number;
  targetProbability: number;
  failureRisk: number;
};

export function predictNextMove(
  pattern: PatternResult,
  regime: MarketRegime
): Prediction {

  let direction: "UP" | "DOWN" | "SIDE" = "SIDE";
  let confidence = pattern.confidence;

  // =========================
  // DIRECTION LOGIC
  // =========================

  if (
    pattern.pattern.includes("BOTTOM") ||
    pattern.pattern === "CUP_HANDLE"
  ) {
    direction = "UP";
  }

  if (
    pattern.pattern.includes("TOP") ||
    pattern.pattern === "HEAD_SHOULDER"
  ) {
    direction = "DOWN";
  }

  // =========================
  // REGIME BOOST
  // =========================

  if (regime === "BULL" && direction === "UP") {
    confidence += 10;
  }

  if (regime === "BEAR" && direction === "DOWN") {
    confidence += 10;
  }

  if (regime === "RANGE") {
    confidence -= 10;
  }

  // =========================
  // PROBABILITY MODEL (SIMPLE HEURISTIC)
  // =========================

  const targetProbability = Math.min(95, confidence + 5);

  const failureRisk = Math.max(5, 100 - confidence);

  return {
    direction,
    confidence: Math.max(0, Math.min(100, confidence)),
    targetProbability,
    failureRisk,
  };
}
