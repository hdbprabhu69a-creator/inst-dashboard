import { candleEngine } from "./candleEngine";
import { updateOHLC } from "./ohlcEngine";

type Tick = {
  symbol: string;

  token: number;

  lastPrice: number;

  open?: number;
  high?: number;
  low?: number;
  close?: number;

  volume?: number;

  time: number;
};

type Listener = (tick: Tick) => void;

class LiveEngine {

  // -----------------------------
  // Symbol-wise listeners
  // -----------------------------
  private listeners: Map<
    string,
    Set<Listener>
  > = new Map();

  // -----------------------------
  // Last tick cache per symbol
  // -----------------------------
  private lastTickMap: Map<
    string,
    Tick
  > = new Map();

  // -----------------------------
  // PROCESS LIVE TICK
  // -----------------------------
  processTick(tick: Tick) {

    if (!tick.symbol) return;

    if (!Number.isFinite(tick.lastPrice)) return;

    if (tick.lastPrice <= 0) return;

    const last =
      this.lastTickMap.get(
        tick.symbol
      );

    if (
      last &&
      last.lastPrice === tick.lastPrice &&
      last.time === tick.time
    ) {
      return;
    }

    this.lastTickMap.set(
      tick.symbol,
      tick
    );

    if(tick.symbol==="SBIN"){

  console.log(
    "[LIVEENGINE INPUT]",
    {
      symbol:tick.symbol,

      lastPrice:tick.lastPrice,

      open:tick.open,

      high:tick.high,

      low:tick.low,

      close:tick.close,

      volume:tick.volume,

      time:tick.time,
    }
  );

}

candleEngine.processTick(
  tick
);

updateOHLC(
  tick
);

this.emit(
  tick
);

  }

  // -----------------------------
  // SUBSCRIBE
  // -----------------------------
  subscribe(
    symbol: string,
    listener: Listener
  ) {

    if (!this.listeners.has(symbol)) {

      this.listeners.set(
        symbol,
        new Set()
      );

    }

    this.listeners
      .get(symbol)!
      .add(listener);

    return () => {

      this.listeners
        .get(symbol)
        ?.delete(listener);

    };

  }

  // -----------------------------
  // EMIT
  // -----------------------------
  private emit(tick: Tick) {

    if (!tick.symbol) return;

    const listeners =
      this.listeners.get(
        tick.symbol
      );

    if (!listeners) return;

    for (const listener of listeners) {

      try {

        listener(tick);

      } catch (err) {

        console.error(err);

      }

    }

  }

  // -----------------------------
  // DISCONNECT
  // -----------------------------
  disconnect() {

    this.listeners.clear();

    this.lastTickMap.clear();

  }

}

export const liveEngine =
  new LiveEngine();

export function subscribe(
  symbol: string,
  cb: (tick: Tick) => void
) {

  return liveEngine.subscribe(
    symbol,
    cb
  );

}









