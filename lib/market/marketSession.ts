export type MarketSession =
  | "PREOPEN"
  | "OPEN"
  | "POSTCLOSE"
  | "CLOSED";

export function getMarketSession(now = new Date()): MarketSession {
  const h = now.getHours();
  const m = now.getMinutes();
  const t = h * 60 + m;

  if (t >= 540 && t < 555) return "PREOPEN";
  if (t >= 555 && t < 930) return "OPEN";
  if (t >= 930 && t < 960) return "POSTCLOSE";
  return "CLOSED";
}
