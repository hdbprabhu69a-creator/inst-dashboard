import { candleEngine } from "./candleEngine";

type Tick = {
  symbol?: string;
  lastPrice: number;
  time?: number;
};

type Listener = (tick: Tick) => void;

class LiveEngine {
  private listeners: Set<Listener> = new Set();
  

  // per-symbol last tick cache
  private lastTickMap: Map<string, Tick> = new Map();

  processTick(tick: Tick) {

    if (!tick.symbol) return;
    if (!Number.isFinite(tick.lastPrice)) return;
    if (tick.lastPrice <= 0) return;

    const last = this.lastTickMap.get(tick.symbol);

    if (
      last &&
      last.lastPrice === tick.lastPrice &&
      last.time === tick.time
    ) {
      return;
    }

    this.lastTickMap.set(tick.symbol, tick);

    console.log("[LiveEngine]", tick.symbol, tick.lastPrice);

    candleEngine.processTick({
      symbol: tick.symbol,
      lastPrice: tick.lastPrice,
      time: tick.time,
    });

    this.emit(tick);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(tick: Tick) {
    for (const listener of this.listeners) {
      try {
        listener(tick);
      } catch (err) {
        console.error(err);
      }
    }
  }

  disconnect() {
    this.listeners.clear();
    this.lastTickMap.clear();
  }

}

export const liveEngine = new LiveEngine();

export function subscribe(cb: (tick: Tick) => void) {
  return liveEngine.subscribe(cb);
}


