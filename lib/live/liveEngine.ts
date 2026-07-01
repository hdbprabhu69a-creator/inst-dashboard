type Tick = {
  symbol?: string;
  lastPrice: number;
  time?: number;
};

type Listener = (tick: Tick) => void;

class LiveEngine {
  private listeners: Set<Listener> = new Set();
  private ws: WebSocket | null = null;

  // 🔥 per-symbol last tick cache (prevents duplicates)
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

        // ❌ reject invalid ticks
        if (!tick.symbol || !Number.isFinite(tick.lastPrice)) return;
        if (tick.lastPrice <= 0) return;

        // 🔥 prevent duplicate spam ticks
        const last = this.lastTickMap.get(tick.symbol);
        if (last && last.lastPrice === tick.lastPrice) return;

        this.lastTickMap.set(tick.symbol, tick);

        this.emit(tick);
      } catch (e) {
        // ignore broken payloads
      }
    };

    this.ws.onerror = () => {
      console.log("LiveEngine error");
    };

    this.ws.onclose = () => {
      console.log("LiveEngine closed");
      this.ws = null;

      // auto reconnect (safe backoff)
      setTimeout(() => this.reconnect(url), 2000);
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
    for (const l of this.listeners) {
      try {
        l(tick);
      } catch {}
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

// convenience wrapper (your existing usage)
export function subscribe(cb: (tick: any) => void) {
  return liveEngine.subscribe(cb);
}