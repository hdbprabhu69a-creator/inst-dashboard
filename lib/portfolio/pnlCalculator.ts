import { PortfolioPosition } from "./portfolioTypes";

export function calculatePnL(
  positions: PortfolioPosition[]
) {
  const unrealizedPnL = positions.reduce(
    (sum, p) => sum + p.unrealizedPnL,
    0
  );

  const realizedPnL = positions.reduce(
    (sum, p) => sum + p.realizedPnL,
    0
  );

  const dayPnL = positions.reduce(
    (sum, p) => sum + p.dayPnL,
    0
  );

  const totalPnL =
    unrealizedPnL + realizedPnL;

  return {
    unrealizedPnL,
    realizedPnL,
    dayPnL,
    totalPnL,
  };
}
