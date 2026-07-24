import {
  Candle,
  SwingPoint,
  TrendLine,
} from "./types";

import {
  detectSwings,
} from "./swing";

import {
  buildTrendLines,
} from "./trendlineEngine";

export interface MarketContext {

  regime?: "BULL" | "BEAR" | "RANGE";

  nifty?: Candle[];

  bankNifty?: Candle[];

  sector?: Candle[];

}

export interface AnalysisContext {

  candles: Candle[];

  swings: SwingPoint[];

  highTrendLines: TrendLine[];

  lowTrendLines: TrendLine[];

  market?: MarketContext;

}

export function createAnalysisContext(

  candles: Candle[],

  market?: MarketContext

): AnalysisContext {

  const swings =
    detectSwings(
      candles
    );

  return {

    candles,

    swings,

    highTrendLines:
      buildTrendLines(
        swings,
        "HIGH"
      ),

    lowTrendLines:
      buildTrendLines(
        swings,
        "LOW"
      ),

    market,

  };

}

