import { MarketData } from "@/types/market";

export async function fetchMarketData(
  symbol: string
): Promise<MarketData> {

  const response = await fetch(
    `/api/kite?symbol=${symbol}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch market data"
    );
  }

  return response.json();
}