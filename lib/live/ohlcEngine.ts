import { LiveTick } from "./liveTypes";

export interface OHLCState{
  open:number;
  high:number;
  low:number;
  close:number;
  volume:number;
  time:number;
}

let state:OHLCState|null=null;
const listeners=new Set<(s:OHLCState)=>void>();

export function updateOHLC(tick:LiveTick){
  if(!state){
    state={open:tick.lastPrice,high:tick.lastPrice,low:tick.lastPrice,close:tick.lastPrice,volume:tick.volume??0,time:tick.time};
  }else{
    state.high=Math.max(state.high,tick.lastPrice);
    state.low=Math.min(state.low,tick.lastPrice);
    state.close=tick.lastPrice;
    state.volume=tick.volume??state.volume;
    state.time=tick.time;
  }
  listeners.forEach(fn=>fn(state!));
}

export function getCurrentOHLC(){ return state; }
export function resetOHLC(){ state=null; }
export function subscribeOHLC(fn:(s:OHLCState)=>void){
 listeners.add(fn);
 return ()=>listeners.delete(fn);
}
