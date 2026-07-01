type Tick = {
  symbol: string;
  lastPrice: number;
  time?: number;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Listener = (candle: Candle) => void;

class CandleEngineV2 {
  private listeners: Map<string, Set<Listener>> = new Map();

  // symbol → current forming candle
  private activeCandles: Map<string, Candle> = new Map();

  // symbol → last candle timestamp bucket
  private lastBucket: Map<string, number> = new Map();

  // interval in seconds (default 1m)
  private interval: number = 60;

  setInterval(seconds: number) {
    this.interval = seconds;
  }

  subscribe(symbol: string, cb: Listener) {
    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
    }

    this.listeners.get(symbol)!.add(cb);

    return () => {
      this.listeners.get(symbol)?.delete(cb);
    };
  }

  processTick(tick: Tick) {
    if (!tick.symbol) return;

    const price = Number(tick.lastPrice);
    if (!Number.isFinite(price) || price <= 0) return;

    const time = tick.time
      ? Math.floor(tick.time / 1000)
      : Math.floor(Date.now() / 1000);

    const bucket = Math.floor(time / this.interval) * this.interval;

    const lastBucket = this.lastBucket.get(tick.symbol);

    let candle = this.activeCandles.get(tick.symbol);

    // 🔥 NEW CANDLE START
    if (!candle || lastBucket !== bucket) {
      candle = {
        time: bucket,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0,
      };

      this.activeCandles.set(tick.symbol, candle);
      this.lastBucket.set(tick.symbol, bucket);
    }

    // 🔥 UPDATE EXISTING CANDLE (NO REPAINT)
    candle.high = Math.max(candle.high, price);
    candle.low = Math.min(candle.low, price);
    candle.close = price;
    candle.volume += 1;

    this.emit(tick.symbol, candle);
  }

  private emit(symbol: string, candle: Candle) {
    const subs = this.listeners.get(symbol);
    if (!subs) return;

    for (const cb of subs) {
      try {
        cb({ ...candle });
      } catch {}
    }
  }

  getActiveCandle(symbol: string) {
    return this.activeCandles.get(symbol) || null;
  }

  reset(symbol?: string) {
    if (symbol) {
      this.activeCandles.delete(symbol);
      this.lastBucket.delete(symbol);
      return;
    }

    this.activeCandles.clear();
    this.lastBucket.clear();
  }
}

export const candleEngineV2 = new CandleEngineV2();