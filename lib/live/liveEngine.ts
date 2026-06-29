import { LiveTick } from "./liveTypes";

const subscribers = new Set<(tick: LiveTick) => void>();
const latest = new Map<string, LiveTick>();

export function publishTick(tick: LiveTick): void {
  latest.set(tick.symbol, tick);
  subscribers.forEach(fn => fn(tick));
}

export function subscribe(fn: (tick: LiveTick) => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function getCurrentTick(symbol: string): LiveTick | undefined {
  return latest.get(symbol);
}
