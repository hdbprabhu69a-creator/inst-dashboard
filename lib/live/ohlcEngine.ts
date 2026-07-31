import { LiveTick } from "./liveTypes";

export interface OHLCState{
  open:number;
  high:number;
  low:number;
  close:number;
  volume:number;
  time:number;
}

const states =
  new Map<string,OHLCState>();

const listeners =
  new Map<
    string,
    Set<(s:OHLCState)=>void>
  >();

export function updateOHLC(tick:LiveTick){

  const symbol = tick.symbol;

  if(!symbol) return;

  let state = states.get(symbol);

  if(!state){

    state={
      open:tick.open ?? tick.lastPrice,
      high:tick.high ?? tick.lastPrice,
      low:tick.low ?? tick.lastPrice,
      close:tick.close ?? tick.lastPrice,
      volume:tick.volume ?? 0,
      time:tick.time,
    };

  }else{

    state.high=
      tick.high ?? state.high;

    state.low=
      tick.low ?? state.low;

    state.close=
      tick.close ?? tick.lastPrice;

    state.open=
      tick.open ?? state.open;
    state.volume=tick.volume ?? state.volume;
    state.time=tick.time;

  }

  states.set(symbol,state);

  listeners
    .get(symbol)
    ?.forEach(fn=>fn({...state!}));

}

export function getCurrentOHLC(
  symbol:string
){
  return states.get(symbol) ?? null;
}

export function resetOHLC(
  symbol?:string
){

  if(symbol){

    states.delete(symbol);
    listeners.delete(symbol);
    return;

  }

  states.clear();
  listeners.clear();

}

export function subscribeOHLC(
  symbol:string,
  fn:(s:OHLCState)=>void
){

  if(!listeners.has(symbol)){
    listeners.set(
      symbol,
      new Set()
    );
  }

  listeners
    .get(symbol)!
    .add(fn);

  const state =
    states.get(symbol);

  if(state){
    fn({...state});
  }

  return ()=>{

    listeners
      .get(symbol)
      ?.delete(fn);

  };

}




