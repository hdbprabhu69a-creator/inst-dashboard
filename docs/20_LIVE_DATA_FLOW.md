
app\api\live\stream\route.ts
Line 1
import { liveTickHub } from "@/lib/server/stream/LiveTickHub";

app\api\live\stream\route.ts
Line 10
let unsubscribe = () => {};

app\api\live\stream\route.ts
Line 12
const stream = new ReadableStream({

app\api\live\stream\route.ts
Line 24
unsubscribe();

app\api\live\stream\route.ts
Line 44
unsubscribe = liveTickHub.subscribe((tick:any) => {

app\api\live\stream\route.ts
Line 68
unsubscribe();

app\components\LiveChart.tsx
Line 42
liveUIBridge.subscribe((data) => {

app\components\LiveScanner.tsx
Line 12
scannerStore.subscribe((all: any[]) => {

lib\chart\CandlestickChart.tsx
Line 17
import { subscribe } from "@/lib/live/liveEngine";

lib\chart\CandlestickChart.tsx
Line 18
import { candleEngine, subscribeCandles } from "@/lib/live/candleEngine";

lib\chart\CandlestickChart.tsx
Line 19
import { subscribeOHLC } from "@/lib/live/ohlcEngine";

lib\chart\CandlestickChart.tsx
Line 304
chart.timeScale().subscribeVisibleLogicalRangeChange((range)=>{

lib\chart\CandlestickChart.tsx
Line 331
chart.subscribeCrosshairMove((param) => {

lib\chart\CandlestickChart.tsx
Line 390
candleUnsub.current = subscribeCandles(

lib\chart\CandlestickChart.tsx
Line 438
ohlcUnsub.current = subscribeOHLC(

lib\data\heatmapEngine.ts
Line 15
this.emit();

lib\data\heatmapEngine.ts
Line 22
subscribe(fn: Function) {

lib\data\heatmapEngine.ts
Line 26
private emit() {

lib\data\liveUIBridge.ts
Line 7
emit(data: any) {

lib\data\liveUIBridge.ts
Line 11
subscribe(fn: Listener) {

lib\data\scannerStore.ts
Line 16
this.emit();

lib\data\scannerStore.ts
Line 23
subscribe(fn: Function) {

lib\data\scannerStore.ts
Line 27
private emit() {

lib\live\candleEngine.ts
Line 45
// SUBSCRIBE

lib\live\candleEngine.ts
Line 47
subscribe(

lib\live\candleEngine.ts
Line 81
processTick(tick: Tick) {

lib\live\candleEngine.ts
Line 170
this.emit(

lib\live\candleEngine.ts
Line 177
// EMIT

lib\live\candleEngine.ts
Line 179
private emit(

lib\live\candleEngine.ts
Line 282
export function subscribeCandles(

lib\live\candleEngine.ts
Line 287
return candleEngine.subscribe(

lib\live\liveBootstrap.ts
Line 4
let source: EventSource | null = null;

lib\live\liveBootstrap.ts
Line 11
source = new EventSource(

lib\live\liveBootstrap.ts
Line 31
liveEngine.processTick(tick);

lib\live\liveEngine.ts
Line 32
processTick(tick: Tick) {

lib\live\liveEngine.ts
Line 58
candleEngine.processTick({

lib\live\liveEngine.ts
Line 64
this.emit(tick);

lib\live\liveEngine.ts
Line 69
// SUBSCRIBE

lib\live\liveEngine.ts
Line 71
subscribe(

lib\live\liveEngine.ts
Line 100
// EMIT

lib\live\liveEngine.ts
Line 102
private emit(tick: Tick) {

lib\live\liveEngine.ts
Line 145
export function subscribe(

lib\live\liveEngine.ts
Line 150
return liveEngine.subscribe(

lib\live\ohlcEngine.ts
Line 21
export function updateOHLC(tick:LiveTick){

lib\live\ohlcEngine.ts
Line 89
export function subscribeOHLC(

lib\live\symbolManager.ts
Line 1
import { subscribe } from "./liveEngine";

lib\live\symbolManager.ts
Line 25
// SUBSCRIBE TO GLOBAL TICK STREAM

lib\live\symbolManager.ts
Line 28
subscribe(

lib\server\live\KiteLiveService.ts
Line 1
import { KiteTicker } from "kiteconnect";

lib\server\live\KiteLiveService.ts
Line 2
import { liveTickHub } from "@/lib/server/stream/LiveTickHub";

lib\server\live\KiteLiveService.ts
Line 51
this.ticker=new KiteTicker({

lib\server\live\KiteLiveService.ts
Line 72
this.ticker.subscribe(this.tokens);

lib\server\live\KiteLiveService.ts
Line 89
liveTickHub.publish({

lib\server\stream\LiveTickHub.ts
Line 3
class LiveTickHub{

lib\server\stream\LiveTickHub.ts
Line 9
subscribe(listener:TickListener){

lib\server\stream\LiveTickHub.ts
Line 16
"[LiveTickHub] Subscribe:",

lib\server\stream\LiveTickHub.ts
Line 27
"[LiveTickHub] Unsubscribe:",

lib\server\stream\LiveTickHub.ts
Line 39
publish(tick:any){

lib\server\stream\LiveTickHub.ts
Line 49
"[LiveTickHub] Removing dead listener:",

lib\server\stream\LiveTickHub.ts
Line 69
export const liveTickHub=

lib\server\stream\LiveTickHub.ts
Line 70
new LiveTickHub();
