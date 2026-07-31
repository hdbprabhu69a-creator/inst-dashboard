import { getPortfolioData } from "./portfolioRepository";
import {
  mapHoldings,
  mapPositions,
  mapOrders,
} from "./portfolioMapper";
import { calculatePnL } from "./pnlCalculator";
import { calculateAllocation } from "./allocationCalculator";
import { PortfolioSnapshot } from "./portfolioTypes";

export async function getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  const {
    holdings,
    positions,
    orders,
    funds,
  } = await getPortfolioData();

  const mappedHoldings = mapHoldings(holdings);
  const mappedPositions = mapPositions(positions);
  const mappedOrders = mapOrders(orders);

  const pnl = calculatePnL(mappedPositions);
  const allocation = calculateAllocation(mappedHoldings);

  return {
    summary: {
      netWorth: allocation.netWorth,
      dayPnL: pnl.dayPnL,
      totalPnL: pnl.totalPnL,
      unrealizedPnL: pnl.unrealizedPnL,
      realizedPnL: pnl.realizedPnL,

      cash: funds.equity?.available.cash ?? 0,
      buyingPower: funds.equity?.available.live_balance ?? 0,

      investedValue: allocation.investedValue,
      marketValue: allocation.marketValue,
    },

    holdings: mappedHoldings,

    positions: mappedPositions,

    openOrders: mappedOrders.filter(
      (o) => o.status !== "COMPLETE"
    ),

    completedOrders: mappedOrders.filter(
      (o) => o.status === "COMPLETE"
    ),

    lastUpdated: new Date().toISOString(),
  };
}

