import { getLiveCandle,setLiveCandle } from "./liveCandleStore";

export function updateRealtimeOHLC(price:number){
  const c=getLiveCandle();
  if(!c) return;

  setLiveCandle({
    ...c,
    high: Math.max(c.high, price),
    low: Math.min(c.low, price),
    close: price
  });
}
