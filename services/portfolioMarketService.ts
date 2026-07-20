import { getSharedMarketData } from "@/lib/market/marketStore";

export async function fetchPortfolioMarketData(
  symbols: string[]
): Promise<Record<string, number>> {
  const unique = [...new Set(symbols)]
    .map((s) => s.trim())
    .filter(Boolean);

  if (unique.length === 0) {
    return {};
  }

  return getSharedMarketData(async () => {
    const response = await fetch(
      `/api/kite/batch?symbols=${encodeURIComponent(unique.join(","))}`
    );

    if (!response.ok) {
      let message = `HTTP ${response.status}`;

      try {
        const error = await response.json();

        message =
          error?.error ??
          error?.message ??
          message;
      } catch {}

      throw new Error(message);
    }

    return await response.json();
  });
}
