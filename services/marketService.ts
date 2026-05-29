import { MarketData } from "@/types/market";

export async function fetchMarketData(): Promise<MarketData> {
  const response = await fetch("/api/kite");

  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }

  return response.json();
}