import { ensureTokenResolver } from "./bootstrap";
import { resolveSymbol, resolveToken } from "./tokenResolver";

export function getWebSocketToken(symbol:string):number{
    ensureTokenResolver();
    const info = resolveToken(symbol);
    if(!info){
        throw new Error(`WebSocket instrument not found: ${symbol}`);
    }
    return info.token;
}

export function getWebSocketSymbol(token:number):string{
    ensureTokenResolver();
    const info = resolveSymbol(token);
    if(!info){
        throw new Error(`WebSocket token not found: ${token}`);
    }
    return info.symbol;
}

