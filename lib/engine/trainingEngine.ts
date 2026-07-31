import { tradeFeedbackEngine } from "./tradeFeedbackEngine";

export class TrainingEngine {

  // -------------------------
  // BACKTEST MODE
  // -------------------------
  runBacktest(data: any[], symbol: string) {

    for (let i = 50; i < data.length; i++) {

      const slice = data.slice(i - 50, i);

      // fake signal simulation
      const entry = slice[slice.length - 1].close;
      const exit = data[i].close;

      tradeFeedbackEngine.process({
        symbol,
        pattern: "BACKTEST_PATTERN",
        entry,
        exit,
        direction: "BUY"
      });

    }
  }

  // -------------------------
  // PAPER TRADING MODE
  // -------------------------
  runPaperTrade(signal: any) {

    const entry = signal.price;
    const exit = signal.price * (1 + (Math.random() - 0.5) * 0.02);

    tradeFeedbackEngine.process({
      symbol: signal.symbol,
      pattern: signal.pattern,
      entry,
      exit,
      direction: signal.direction
    });

  }

  // -------------------------
  // OPTIMIZER (META LEARNING)
  // -------------------------
  optimizeStrategy(stats: any) {
}

}

export const trainingEngine = new TrainingEngine();


