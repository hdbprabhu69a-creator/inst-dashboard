export type MarketState =
  | "Accumulation"
  | "Compression"
  | "Expansion"
  | "Markup"
  | "Distribution"
  | "Markdown"
  | "Unknown";

export type HistoryRow = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export function detectMarketState(
  history: HistoryRow[]
): MarketState {

  if (history.length < 30) {
    return "Unknown";
  }

  return "Unknown";
}
