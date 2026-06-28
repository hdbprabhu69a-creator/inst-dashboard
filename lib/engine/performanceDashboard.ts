import { performanceEngine } from "./performanceEngine";

export class PerformanceDashboard {

  getSummary() {

    return {
      winRate: performanceEngine.winRate(),
      avgPnL: performanceEngine.avgPnL(),
      totalTrades: (performanceEngine as any).trades?.length || 0
    };

  }

}

export const performanceDashboard = new PerformanceDashboard();
