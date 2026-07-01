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

type Listener = (candles: Candle[]) => void;

class CandleEngineV2 {
  private listeners: Map<string, Set<Listener>> = new Map();

  private activeCandles: Map<string, Candle[]> = new Map();
  private lastBucket: Map<string, number> = new Map();

  // default 1 minute
  private intervalSeconds = 60;

  setInterval(seconds: number) {
    this.intervalSeconds = seconds;
  }

  // ✅ FIXED SUBSCRIBE API (matches UI)
  subscribe(symbol: string, interval: string, cb: Listener) {
    // convert interval
    this.intervalSeconds = this.parseInterval(interval);

    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
    }

    this.listeners.get(symbol)!.add(cb);

    // send initial state
    const existing = this.activeCandles.get(symbol) || [];
    cb(existing);

    return () => {
      this.listeners.get(symbol)?.delete(cb);
    };
  }

  // ✅ MAIN TICK ENTRY (called from liveEngine)
  processTick(tick: Tick) {
    if (!tick?.symbol) return;

    const price = Number(tick.lastPrice);
    if (!Number.isFinite(price) || price <= 0) return;

    const time = tick.time
      ? Math.floor(tick.time / 1000)
      : Math.floor(Date.now() / 1000);

    const bucket =
      Math.floor(time / this.intervalSeconds) * this.intervalSeconds;

    let candles = this.activeCandles.get(tick.symbol);

    if (!candles) {
      candles = [];
      this.activeCandles.set(tick.symbol, candles);
    }

    let lastCandle = candles[candles.length - 1];
    const lastBucket = this.lastBucket.get(tick.symbol);

    // 🔥 NEW CANDLE
    if (!lastCandle || lastBucket !== bucket) {
      const newCandle: Candle = {
        time: bucket,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0,
      };

      candles.push(newCandle);
      this.lastBucket.set(tick.symbol, bucket);
      lastCandle = newCandle;
    }

    // 🔥 UPDATE CANDLE
    lastCandle.high = Math.max(lastCandle.high, price);
    lastCandle.low = Math.min(lastCandle.low, price);
    lastCandle.close = price;
    lastCandle.volume += 1;

    this.emit(tick.symbol, candles);
  }

  private emit(symbol: string, candles: Candle[]) {
    const subs = this.listeners.get(symbol);
    if (!subs) return;

    const snapshot = [...candles];

    for (const cb of subs) {
      try {
        cb(snapshot);
      } catch {}
    }
  }

  private parseInterval(interval: string): number {
    switch (interval) {
      case "D":
        return 86400;
      case "W":
        return 604800;
      case "M":
        return 2592000;
      default:
        return 60;
    }
  }

  getCandles(symbol: string) {
    return this.activeCandles.get(symbol) || [];
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

export const candleEngine = new CandleEngineV2();