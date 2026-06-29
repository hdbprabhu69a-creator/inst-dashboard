import { InstrumentInfo, SymbolMap, TokenMap } from "./types";

const symbolMap: SymbolMap = new Map();
const tokenMap: TokenMap = new Map();

export function clearCache(): void {
    symbolMap.clear();
    tokenMap.clear();
}

export function cacheInstrument(info: InstrumentInfo): void {
    symbolMap.set(info.symbol.toUpperCase(), info);
    tokenMap.set(info.token, info);
}

export function cacheAll(items: InstrumentInfo[]): void {
    clearCache();
    for (const item of items) {
        cacheInstrument(item);
    }
}

export function getBySymbol(symbol: string): InstrumentInfo | null {
    return symbolMap.get(symbol.toUpperCase()) ?? null;
}

export function getByToken(token: number): InstrumentInfo | null {
    return tokenMap.get(token) ?? null;
}

export function getAll(): InstrumentInfo[] {
    return [...symbolMap.values()];
}
