import { setLiveCandle } from "@/lib/liveChart/liveCandleStore";
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

export function forwardLiveCandle(candle:any){
    setLiveCandle({
        symbol:candle.symbol,
        open:candle.open,
        high:candle.high,
        low:candle.low,
        close:candle.close,
        volume:candle.volume ?? 0,
        time:candle.time ?? Date.now()
    });
}
