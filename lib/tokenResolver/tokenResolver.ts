import {
    cacheAll,
    getBySymbol,
    getByToken,
    getAll
} from "./cache";
import { InstrumentInfo } from "./types";

let loaded = false;

export function reload(_csvPath: string): void {
    console.warn("reload() is server-only.");
}

export function loadInstruments(instruments: InstrumentInfo[]): void {
    cacheAll(instruments);
    loaded = true;
}

export function isLoaded(): boolean {
    return loaded;
}

export function resolveToken(symbol: string): InstrumentInfo | null {
    return getBySymbol(symbol);
}

export function resolveSymbol(token: number): InstrumentInfo | null {
    return getByToken(token);
}

export function hasToken(symbol: string): boolean {
    return resolveToken(symbol) !== null;
}

export function allTokens(): InstrumentInfo[] {
    return getAll();
}
