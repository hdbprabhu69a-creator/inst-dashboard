import { getLiveCandle, setLiveCandle } from "./liveCandleStore";

export function updateRealtimeVolume(volume:number){
  const candle=getLiveCandle();
  if(!candle) return;

  setLiveCandle({
    ...candle,
    volume
  });
}
