import { performanceEngine } from "./performanceEngine";
import { learningEngine } from "./learningEngine";

export type TradeOutcome = {
  symbol: string;
  pattern: string;
  entry: number;
  exit: number;
  direction: "BUY" | "SELL";
};

export class TradeFeedbackEngine {

  process(outcome: TradeOutcome) {

    const pnl =
      outcome.direction === "BUY"
        ? outcome.exit - outcome.entry
        : outcome.entry - outcome.exit;

    const result = pnl > 0 ? "WIN" : "LOSS";

    // 1. Store performance
    performanceEngine.record({
      symbol: outcome.symbol,
      pattern: outcome.pattern,
      result,
      pnl,
    });

    // 2. Update learning engine
    learningEngine.update(outcome.pattern, result);

  }

}

export const tradeFeedbackEngine = new TradeFeedbackEngine();

