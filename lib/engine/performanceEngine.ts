type TradeRecord = {
  symbol: string;
  pattern: string;
  result: "WIN" | "LOSS";
  pnl: number;
};

class PerformanceEngine {

  private trades: TradeRecord[] = [];

  record(trade: TradeRecord) {
    this.trades.push(trade);
  }

  winRate() {
    const wins = this.trades.filter(t => t.result === "WIN").length;
    return this.trades.length ? (wins / this.trades.length) * 100 : 0;
  }

  avgPnL() {
    if (!this.trades.length) return 0;
    return this.trades.reduce((a, b) => a + b.pnl, 0) / this.trades.length;
  }

}

export const performanceEngine = new PerformanceEngine();
