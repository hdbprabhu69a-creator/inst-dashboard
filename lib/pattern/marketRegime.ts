import { Candle } from "./types";

export type MarketRegime = "BULL" | "BEAR" | "RANGE";

export function detectMarketRegime(candles: Candle[]): MarketRegime {

  if (candles.length < 20) return "RANGE";

  const recent = candles.slice(-20);

  const first = recent[0].close;
  const last = recent[recent.length - 1].close;

  const change = ((last - first) / first) * 100;

  const highs = recent.map(c => c.high);
  const lows = recent.map(c => c.low);

  const volatility =
    (Math.max(...highs) - Math.min(...lows)) / first * 100;

  if (change > 2) return "BULL";
  if (change < -2) return "BEAR";
  if (volatility > 5) return "RANGE";

  return "RANGE";
}

