import { PortfolioHolding } from "./portfolioTypes";

export function calculateAllocation(
  holdings: PortfolioHolding[]
) {
  const investedValue = holdings.reduce(
    (sum, h) => sum + h.investedValue,
    0
  );

  const marketValue = investedValue;

  const netWorth = marketValue;

  return {
    investedValue,
    marketValue,
    netWorth,
  };
}
