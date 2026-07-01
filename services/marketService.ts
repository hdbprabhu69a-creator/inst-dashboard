import { KiteApiResponse } from "@/types/market";
import { getSharedMarketData } from "@/lib/market/marketStore";

export async function fetchMarketData(
  symbol: string
): Promise<KiteApiResponse> {
  const cleanSymbol = symbol?.trim();

  if (
    !cleanSymbol ||
    cleanSymbol === "undefined" ||
    cleanSymbol === "null"
  ) {
    throw new Error("Invalid symbol");
  }

  return getSharedMarketData(async () => {
    const response = await fetch(
      `/api/kite?symbol=${encodeURIComponent(cleanSymbol)}`
    );

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage =
          errorData?.error ||
          errorData?.message ||
          errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    return await response.json();
  });
}