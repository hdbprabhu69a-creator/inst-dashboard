import { getLiveCandle } from "./liveCandleStore";

export function synchronizeChartCandles(history:any[]){
    const live=getLiveCandle();
    if(!live || history.length===0) return history;

    const candles=[...history];
    candles[candles.length-1]={
        ...candles[candles.length-1],
        high:Math.max(candles[candles.length-1].high,live.high),
        low:Math.min(candles[candles.length-1].low,live.low),
        close:live.close,
        volume:live.volume
    };

    return candles;
}
