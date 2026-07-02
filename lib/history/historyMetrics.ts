export type HistoryMetrics = {
  startedAt: number;
  downloadedStocks: number;
  skippedStocks: number;
  totalStocks: number;
  totalCandles: number;
};

export function createHistoryMetrics(): HistoryMetrics {
  return {
    startedAt: Date.now(),
    downloadedStocks: 0,
    skippedStocks: 0,
    totalStocks: 0,
    totalCandles: 0,
  };
}

export function printHistoryMetrics(m: HistoryMetrics) {
  console.log("================================");
  console.log(`Duration: ${((Date.now()-m.startedAt)/1000).toFixed(2)}s`);
  console.log(`Stocks Processed: ${m.totalStocks}`);
  console.log(`Downloaded: ${m.downloadedStocks}`);
  console.log(`Skipped: ${m.skippedStocks}`);
  console.log(`Candles Written: ${m.totalCandles}`);
  console.log("================================");
}
