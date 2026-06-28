import { PatternResult } from "./types";
import { MarketRegime } from "./marketRegime";

export function institutionalFilter(
  pattern: PatternResult,
  regime: MarketRegime
): boolean {

  // 1. CONFIDENCE GATE
  if (pattern.confidence < 70) return false;

  // 2. REGIME ALIGNMENT
  if (regime === "BULL" && pattern.pattern.includes("TOP"))
    return false;

  if (regime === "BEAR" && pattern.pattern.includes("BOTTOM"))
    return false;

  // 3. RANGE FILTER (avoid noise)
  if (regime === "RANGE" && pattern.confidence < 80)
    return false;

  // 4. BREAKOUT VALIDATION
  if (pattern.breakout && pattern.target) {
    const strength = Math.abs(pattern.target - pattern.breakout);
    if (strength < 1) return false;
  }

  return true;
}
