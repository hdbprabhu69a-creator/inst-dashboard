export type TrendStrength =
  | "VERY_WEAK"
  | "WEAK"
  | "MODERATE"
  | "STRONG"
  | "VERY_STRONG";

export interface TrendStrengthResult {
  score: number;
  strength: TrendStrength;
}

export function trendStrength(
  higherHighs: number,
  higherLows: number,
  lowerHighs: number,
  lowerLows: number,
  integrity: boolean
): TrendStrengthResult {

  const bullish = higherHighs + higherLows;
  const bearish = lowerHighs + lowerLows;

  let score = bullish - bearish + 50;

  if (integrity) score += 10;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let strength: TrendStrength;

  if (score >= 85)
    strength = "VERY_STRONG";
  else if (score >= 70)
    strength = "STRONG";
  else if (score >= 50)
    strength = "MODERATE";
  else if (score >= 30)
    strength = "WEAK";
  else
    strength = "VERY_WEAK";

  return {
    score,
    strength
  };
}

