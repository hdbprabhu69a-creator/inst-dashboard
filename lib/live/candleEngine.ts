type Tick = {
  symbol: string;
  lastPrice: number;

  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;

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

  private symbolIntervals: Map<string,number> =
    new Map();

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
    const seconds =
  this.parseInterval(interval);

this.intervalSeconds =
  seconds;

this.symbolIntervals.set(
  symbol,
  seconds
);

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

    const interval =
  this.symbolIntervals.get(
    tick.symbol
  ) ?? this.intervalSeconds;

const bucket =
  Math.floor(
    ts / interval
  ) * interval;

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

  open: tick.open ?? price,
  high: tick.high ?? price,
  low: tick.low ?? price,
  close: tick.close ?? price,
  volume: tick.volume ?? 0,
};

      if (
        candles.length === 0 ||
        candle.time > candles[candles.length-1].time
      ) {
        candles.push(candle);
      }

      this.lastBucket.set(
        tick.symbol,
        bucket
      );
    }

    candle.high =
  tick.high ??
  Math.max(candle.high,price);

candle.low =
  tick.low ??
  Math.min(candle.low,price);

candle.close =
  tick.close ??
  price;

candle.volume =
  tick.volume ??
  (candle.volume+1);

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


  initializeHistory(
    symbol:string,
    candles:Candle[]
  ){

    this.activeCandles.set(
      symbol,
      [...candles].sort(
        (a,b)=>a.time-b.time
      )
    );

    if(candles.length){

      this.lastBucket.set(
        symbol,
        candles[candles.length-1].time
      );

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



































