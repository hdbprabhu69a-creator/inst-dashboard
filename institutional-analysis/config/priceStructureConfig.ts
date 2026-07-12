export const PRICE_STRUCTURE_CONFIG = {

  // 6 Months Daily History
  lookbackCandles: 126,

  // Swing Detection
  leftStrength: 2,
  rightStrength: 2,

  // Ignore very small swings
  minimumSwingPercent: 2.0,

  // Merge nearby swings
  mergeNearbySwings: true,
  mergePercent: 1.0,

  // Minimum candles between swings
  minimumSwingDistance: 5,

  // Trend confirmation
  minimumTrendSwings: 4,

  // Confidence
  strongStructureScore: 90,
  mediumStructureScore: 70,
  weakStructureScore: 50,

} as const;
