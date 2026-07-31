import { PatternResult } from "./types";

export type LivePatternState = {
  active: PatternResult | null;
};

export function getLivePattern(
  patterns: PatternResult[]
): PatternResult | null {

  if (!patterns || patterns.length === 0)
    return null;

  // 1. Filter weak patterns
  const filtered = patterns.filter(p => p.confidence >= 70);

  if (filtered.length === 0)
    return null;

  // 2. Sort by strongest confidence
  filtered.sort((a, b) => b.confidence - a.confidence);

  // 3. Return ONLY best pattern
  return filtered[0];
}

