export type LiveCandle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

let liveCandle: LiveCandle | null = null;

export function getLiveCandle(): LiveCandle | null {
  return liveCandle;
}

export function setLiveCandle(
  candle: LiveCandle
): void {
  liveCandle = candle;
}
