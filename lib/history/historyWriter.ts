import { finalizeEODCandle } from "@/lib/eod/eodFinalize";

export async function buildHistoryPayload(symbol:string){
  const candle = finalizeEODCandle();
  if(!candle) return null;

  return {
    symbol,
    candle,
    updatedAt: Date.now()
  };
}

