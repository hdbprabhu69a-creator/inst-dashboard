import { ensureTokenResolver } from "./bootstrap";
import { resolveToken } from "./tokenResolver";
import { InstrumentInfo } from "./types";

export function getHistoricalInstrument(symbol:string):InstrumentInfo{
    ensureTokenResolver();
    const info = resolveToken(symbol);
    if(!info){
        throw new Error(`Instrument not found: ${symbol}`);
    }
    return info;
}

export function getHistoricalToken(symbol:string):number{
    return getHistoricalInstrument(symbol).token;
}
