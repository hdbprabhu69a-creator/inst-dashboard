import { learningEngine } from "@/lib/engine/learningEngine";
import { analyzeAllPatterns } from "@/lib/pattern/patternEngine";
import { getLivePattern } from "@/lib/pattern/livePatternEngine";
import { detectMarketRegime } from "@/lib/pattern/marketRegime";
import { scorePattern } from "@/lib/pattern/patternScore";
import { institutionalFilter } from "@/lib/pattern/institutionalFilter";
import { predictNextMove } from "@/lib/pattern/predictionEngine";
import { scannerStore } from "./scannerStore";

type StockState = {
  candles: any[];
};

export class StockRouter {

  private state: Map<string, StockState> = new Map();

  constructor(universe: string[]) {

    for (const symbol of universe) {
      this.state.set(symbol, { candles: [] });
    }

  }

  onTick(symbol: string, candle: any) {

    const stock = this.state.get(symbol);
    if (!stock) return;

    stock.candles.push(candle);

    if (stock.candles.length > 200) {
      stock.candles.shift();
    }

    this.process(symbol, stock.candles);
  }

  process(symbol: string, candles: any[]) {

    const patterns = analyzeAllPatterns(candles);
    const regime = detectMarketRegime(candles);

    const filtered = patterns.filter(p =>
      institutionalFilter(p, regime)
    );

    if (filtered.length === 0) return;

const scored = filtered.map(p => ({
      ...p,
      ...scorePattern(p)
    }));

    const live = getLivePattern(scored as any);

    if (!live) return;

    const prediction = predictNextMove(live, regime);

    scannerStore.update({
      symbol,
      pattern: live.pattern,
      confidence: live.confidence || 0,
      prediction
    });

    console.log("LIVE:", symbol, live.pattern, prediction);
  }
}



