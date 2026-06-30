import { publishTick, getCurrentTick } from "./liveEngine";
import { resolveToken } from "../tokenResolver";

let currentSymbol = "SBIN";

export function setCurrentSymbol(symbol:string){
  currentSymbol = symbol.toUpperCase();
}

export function getCurrentSymbol(){
  return currentSymbol;
}

export function getCurrentInstrument(){
  return resolveToken(currentSymbol);
}

export function publishCurrentTick(lastPrice:number, volume:number=0){
  const info = resolveToken(currentSymbol);
  if(!info) return;

  publishTick({
    symbol: info.symbol,
    token: info.token,
    lastPrice,
    volume,
    time: Date.now()
  });
}

export { getCurrentTick };

