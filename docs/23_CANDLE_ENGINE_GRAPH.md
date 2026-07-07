
app\chart-analysis\page.tsx
Line 7
import { candleEngine } from "@/lib/live/candleEngine";

lib\chart\CandlestickChart.tsx
Line 18
import { candleEngine, subscribeCandles } from "@/lib/live/candleEngine";

lib\chart\CandlestickChart.tsx
Line 390
candleUnsub.current = subscribeCandles(

lib\live\candleEngine.ts
Line 28
class CandleEngineV2 {

lib\live\candleEngine.ts
Line 222
initializeHistory(

lib\live\candleEngine.ts
Line 247
getCandles(symbol: string) {

lib\live\candleEngine.ts
Line 276
export const candleEngine =

lib\live\candleEngine.ts
Line 277
new CandleEngineV2();

lib\live\candleEngine.ts
Line 282
export function subscribeCandles(

lib\live\candleEngine.ts
Line 287
return candleEngine.subscribe(

lib\live\liveEngine.ts
Line 1
import { candleEngine } from "./candleEngine";

lib\live\liveEngine.ts
Line 58
candleEngine.processTick({
