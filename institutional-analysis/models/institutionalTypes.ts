export interface InstitutionalAnalysis {

  symbol: string;

  sector: string;

  score: number;

  verdict:
    | "STRONG BUY"
    | "BUY"
    | "ACCUMULATE"
    | "HOLD"
    | "REDUCE"
    | "SELL";

  trendScore: number;

  structureScore: number;

  volumeScore: number;

  deliveryScore: number;

  pivotScore: number;

  cprScore: number;

  vwapScore: number;

  fibonacciScore: number;

  relativeStrengthScore: number;

  sectorScore: number;

  macroScore: number;

  newsScore: number;

  evidence: string[];

  risks: string[];

  opportunities: string[];

}

