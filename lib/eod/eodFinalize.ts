import { getLiveCandle } from "@/lib/liveChart/liveCandleStore";

export function finalizeEODCandle(){
  const candle=getLiveCandle();
  if(!candle) return null;

  return {
    ...candle,
    finalized:true,
    finalizedAt:Date.now()
  };
}

