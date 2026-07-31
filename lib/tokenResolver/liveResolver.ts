import { ensureTokenResolver } from "./bootstrap";
import { resolveToken } from "./tokenResolver";

export function getLiveInstrument(symbol:string){
    ensureTokenResolver();

    const instrument = resolveToken(symbol);

    if(!instrument){
        throw new Error(`Live instrument not found: ${symbol}`);
    }

    return instrument;
}

export function getLiveToken(symbol:string):number{
    return getLiveInstrument(symbol).token;
}

export function getLiveExchange(symbol:string):string{
    return getLiveInstrument(symbol).exchange;
}

