export type HistoryCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const historyCache = new Map<string, HistoryCandle[]>();

export function getHistoryCache(
  symbol: string,
  interval: string
) {
  return historyCache.get(`${symbol}_${interval}`);
}

export function setHistoryCache(
  symbol: string,
  interval: string,
  candles: HistoryCandle[]
) {
  historyCache.set(`${symbol}_${interval}`, candles);
}

export function clearHistoryCache() {
  historyCache.clear();
}
