type Candle = {
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
};

const store = new Map<string, Candle>();

export function getLiveCandle(symbol: string): Candle | undefined {
  return store.get(symbol);
}

export function setLiveCandle(
  symbol: string,
  candle: Candle
): void {
  store.set(symbol, candle);
}
