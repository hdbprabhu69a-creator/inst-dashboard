type Tick = {
  symbol: string;
  lastPrice: number;
  time?: number;
};

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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

  // -----------------------------------
  // SUBSCRIBE
  // -----------------------------------
  subscribe(
    symbol: string,
    interval: string,
    cb: Listener
  ) {
    this.intervalSeconds =
      this.parseInterval(interval);

    if (!this.listeners.has(symbol)) {
      this.listeners.set(
        symbol,
        new Set()
      );
    }

    this.listeners
      .get(symbol)!
      .add(cb);

    const existing =
      this.activeCandles.get(symbol) ?? [];

    cb([...existing]);

    return () => {
      this.listeners
        .get(symbol)
        ?.delete(cb);
    };
  }

  // -----------------------------------
  // PROCESS LIVE TICK
  // -----------------------------------
  processTick(tick: Tick) {
        console.log("[CandleEngine] Tick Received");
    if (!tick.symbol) return;

    const price = Number(
      tick.lastPrice
    );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return;
    }

    const ts = tick.time
      ? Math.floor(tick.time / 1000)
      : Math.floor(Date.now() / 1000);

    const bucket =
      Math.floor(
        ts / this.intervalSeconds
      ) * this.intervalSeconds;

    let candles =
      this.activeCandles.get(
        tick.symbol
      );

    if (!candles) {
      candles = [];
      this.activeCandles.set(
        tick.symbol,
        candles
      );
    }

    let candle =
      candles[candles.length - 1];

    const lastBucket =
      this.lastBucket.get(
        tick.symbol
      );

    if (
      !candle ||
      lastBucket !== bucket
    ) {
      candle = {
        time: bucket,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0,
      };

      candles.push(candle);

      this.lastBucket.set(
        tick.symbol,
        bucket
      );
    }

    candle.high = Math.max(
      candle.high,
      price
    );

    candle.low = Math.min(
      candle.low,
      price
    );

    candle.close = price;

    candle.volume++;

    this.emit(
      tick.symbol,
      candles
    );
  }

  // -----------------------------------
  // EMIT
  // -----------------------------------
  private emit(
    symbol: string,
    candles: Candle[]
  ) {
    const listeners =
      this.listeners.get(symbol);

    if (!listeners) return;

    const snapshot =
      candles.map((c) => ({ ...c }));

    for (const cb of listeners) {
      try {
        cb(snapshot);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // -----------------------------------
  // INTERVAL PARSER
  // -----------------------------------
  private parseInterval(
    interval: string
  ) {
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

  // -----------------------------------
  // GETTERS
  // -----------------------------------
  getCandles(symbol: string) {
    return (
      this.activeCandles.get(
        symbol
      ) ?? []
    );
  }

  // -----------------------------------
  // RESET
  // -----------------------------------
  reset(symbol?: string) {
    if (symbol) {
      this.activeCandles.delete(
        symbol
      );

      this.lastBucket.delete(
        symbol
      );

      return;
    }

    this.activeCandles.clear();
    this.lastBucket.clear();
  }
}

export const candleEngine =
  new CandleEngineV2();

// ----------------------------------------------------
// BACKWARD COMPATIBILITY EXPORT
// ----------------------------------------------------
export function subscribeCandles(
  symbol: string,
  interval: string,
  cb: (candles: Candle[]) => void
) {
  return candleEngine.subscribe(
    symbol,
    interval,
    cb
  );
}





