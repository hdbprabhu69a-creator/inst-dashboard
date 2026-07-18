import { getHoldings } from "./holdingsRepository";
import { getPositions } from "./positionsRepository";
import { getOrders } from "./orderRepository";
import { getFunds } from "./fundsRepository";

export async function getPortfolioData() {
  const [
    holdings,
    positions,
    orders,
    funds,
  ] = await Promise.all([
    getHoldings(),
    getPositions(),
    getOrders(),
    getFunds(),
  ]);

  return {
    holdings,
    positions,
    orders,
    funds,
  };
}
