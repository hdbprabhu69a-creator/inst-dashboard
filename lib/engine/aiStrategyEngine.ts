import { learningEngine } from "./learningEngine";
import { performanceEngine } from "./performanceEngine";

export type Strategy = {
  name: string;
  pattern: string;
  confidence: number;
};

class AIStrategyEngine {

  generateStrategies(symbol: string): Strategy[] {

    return [
      {
        name: "Momentum Breakout",
        pattern: "BREAKOUT",
        confidence: 70
      },
      {
        name: "Reversal Play",
        pattern: "DOUBLE_BOTTOM",
        confidence: 65
      },
      {
        name: "Trend Continuation",
        pattern: "TREND_FOLLOW",
        confidence: 75
      }
    ];
  }

  selectBest(strategies: Strategy[]) {

    let best = strategies[0];

    for (const s of strategies) {

      const adjusted = learningEngine.adjustConfidence(
        s.pattern,
        s.confidence
      );

      if (adjusted > best.confidence) {
        best = { ...s, confidence: adjusted };
      }

    }

    return best;
  }

  evolve(strategy: Strategy) {

    const mutation = Math.random() * 5;

    return {
      ...strategy,
      confidence: Math.min(100, strategy.confidence + mutation)
    };

  }

}

export const aiStrategyEngine = new AIStrategyEngine();

