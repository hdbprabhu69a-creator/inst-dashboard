export type StructureType =
  | "HH_HL"
  | "LH_LL"
  | "RANGE"
  | "TRANSITION";

export type TrendPhase =
  | "ACCUMULATION"
  | "EARLY_UPTREND"
  | "MATURE_UPTREND"
  | "DISTRIBUTION"
  | "EARLY_DOWNTREND"
  | "MATURE_DOWNTREND"
  | "SIDEWAYS";

export type StructureEvent =
  | "NONE"
  | "NEW_HIGHER_HIGH"
  | "NEW_HIGHER_LOW"
  | "NEW_LOWER_HIGH"
  | "NEW_LOWER_LOW"
  | "SWING_BREAKOUT"
  | "SWING_BREAKDOWN"
  | "STRUCTURE_BREAK"
  | "RANGE_BREAKOUT"
  | "RANGE_BREAKDOWN";

export interface SwingPoint {
  index: number;
  date: string;
  price: number;
  type: "HIGH" | "LOW";
}

export interface PriceStructureResult {

  symbol: string;

  structure: StructureType;

  phase: TrendPhase;

  event: StructureEvent;

  integrity: boolean;

  confidence: number;

  structureScore: number;

  structureStrength: number;

  trendAge: number;

  higherHighCount: number;

  higherLowCount: number;

  lowerHighCount: number;

  lowerLowCount: number;

  currentSwingHigh: number;

  previousSwingHigh: number;

  currentSwingLow: number;

  previousSwingLow: number;

  breakLevel: number;

  swingHighs: SwingPoint[];

  swingLows: SwingPoint[];

  reasons: string[];

}

