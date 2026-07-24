import { PatternResult } from "./types";

export interface PatternAnalysis {

  pattern: PatternResult["pattern"];

  confidence: number;

  stage:
    | "FORMING"
    | "READY"
    | "BREAKOUT"
    | "FAILED";

  breakoutProbability: number;

  institutionalScore: number;

  breakout: number;

  stoploss: number;

  target: number;

  expectedMovePct: number;

  riskReward: number;

  timeToBreakout: string;

  verdict:
    | "VERY_BULLISH"
    | "BULLISH"
    | "NEUTRAL"
    | "BEARISH";

  reasons: string[];

  raw: PatternResult;

}
