import { performanceEngine } from "./performanceEngine";

type Trade = {
  result: "WIN" | "LOSS";
  pnl: number;
};

class StatisticsEngine {

  getTrades() {
    return (performanceEngine as any).trades || [];
  }

  expectancy() {

    const trades = this.getTrades();

    const wins = trades.filter((t: Trade) => t.result === "WIN");
    const losses = trades.filter((t: Trade) => t.result === "LOSS");

    const avgWin =
      wins.reduce((a: number, b: Trade) => a + b.pnl, 0) / (wins.length || 1);

    const avgLoss =
      losses.reduce((a: number, b: Trade) => a + b.pnl, 0) / (losses.length || 1);

    const winRate = wins.length / (trades.length || 1);

    const lossRate = 1 - winRate;

    return (winRate * avgWin) - (lossRate * avgLoss);
  }

  variance() {

    const trades = this.getTrades();
    const mean =
      trades.reduce((a: number, b: Trade) => a + b.pnl, 0) / (trades.length || 1);

    return trades.reduce((acc: number, t: Trade) => {
      return acc + Math.pow(t.pnl - mean, 2);
    }, 0) / (trades.length || 1);

  }

  sharpeLike() {

    const exp = this.expectancy();
    const risk = Math.sqrt(this.variance() || 1);

    return exp / risk;

  }

}

export const statisticsEngine = new StatisticsEngine();


