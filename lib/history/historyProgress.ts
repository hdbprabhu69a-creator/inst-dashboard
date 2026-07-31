export function logHistoryProgress(
  current: number,
  total: number,
  symbol: string
) {
  console.log(`[${current}/${total}] ${symbol}`);
}

export function logHistorySkip(symbol: string) {
  console.log(`SKIP  : ${symbol}`);
}

export function logHistoryDownload(symbol: string) {
  console.log(`FETCH : ${symbol}`);
}

export function logHistoryComplete(symbol: string, candles: number) {
  console.log(`DONE  : ${symbol} (${candles} candles)`);
}

