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

import {
  detectMultiLevelStructure,
} from "@/lib/structure/latestStructureEngine";

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

  structure?: ReturnType<typeof detectMultiLevelStructure>;

}

export function createAnalysisContext(

  candles:Candle[],

  market?:MarketContext,

  structure?:ReturnType<typeof detectMultiLevelStructure>

): AnalysisContext {

  const swings =
    detectSwings(
      candles
    );

  const resolvedStructure =
    structure ??
    detectMultiLevelStructure(
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

    structure:
      resolvedStructure,

  };

}






