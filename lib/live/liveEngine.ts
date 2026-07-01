import { candleEngine } from "./candleEngine";

type Tick = {
  symbol?: string;
  lastPrice: number;
  time?: number;
};

type Listener = (tick: Tick) => void;

class LiveEngine {
  private listeners: Set<Listener> = new Set();
  private ws: WebSocket | null = null;

  // per-symbol last tick cache
  private lastTickMap: Map<string, Tick> = new Map();

  connect(url: string) {
    if (this.ws) return;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("LiveEngine connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        const tick: Tick = {
          symbol: raw.symbol,
          lastPrice: Number(raw.lastPrice),
          time: raw.time ? Number(raw.time) : Date.now(),
        };

        // reject invalid ticks
        if (!tick.symbol) return;
        if (!Number.isFinite(tick.lastPrice)) return;
        if (tick.lastPrice <= 0) return;

        // ignore duplicate ticks
        const last = this.lastTickMap.get(tick.symbol);
        if (
          last &&
          last.lastPrice === tick.lastPrice &&
          last.time === tick.time
        ) {
          return;
        }

        this.lastTickMap.set(tick.symbol, tick);

        // ⭐ Feed Candle Engine
        candleEngine.processTick({
          symbol: tick.symbol,
          lastPrice: tick.lastPrice,
          time: tick.time,
        });

        // Notify other listeners
        this.emit(tick);

      } catch (err) {
        console.error("LiveEngine parse error:", err);
      }
    };

    this.ws.onerror = (err) => {
      console.error("LiveEngine error", err);
    };

    this.ws.onclose = () => {
      console.log("LiveEngine closed");

      this.ws = null;

      setTimeout(() => {
        this.reconnect(url);
      }, 2000);
    };
  }

  reconnect(url: string) {
    if (this.ws) return;
    this.connect(url);
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
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
    this.lastTickMap.clear();
  }
}

export const liveEngine = new LiveEngine();

export function subscribe(cb: (tick: Tick) => void) {
  return liveEngine.subscribe(cb);
}