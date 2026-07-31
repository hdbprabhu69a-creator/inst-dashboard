import { subscribe } from "./liveEngine";
import { resolveToken } from "../tokenResolver";

type Tick = {
  symbol?: string;
  lastPrice: number;
  time?: number;
};

class SymbolManager {
  // allow flexible token types (Kite / API / number mapping)
  private symbolMap: Map<string, number | string> = new Map();

  // latest tick per symbol
  private tickCache: Map<string, Tick> = new Map();

  // current selected symbol
  private currentSymbol = "";

  constructor() {
    this.init();
  }

  // -----------------------------------
  // SUBSCRIBE TO GLOBAL TICK STREAM
  // -----------------------------------
  private init() {
    subscribe(
      "*",
      (tick) => {
      if (!tick.symbol) return;

      const price = Number(tick.lastPrice);

      if (!Number.isFinite(price) || price <= 0) return;

      this.tickCache.set(tick.symbol, tick);
    }
    );
  }

  // -----------------------------------
  // CURRENT SYMBOL
  // -----------------------------------
  setCurrentSymbol(symbol: string) {
    this.currentSymbol = symbol.trim().toUpperCase();
  }

  getCurrentSymbol() {
    return this.currentSymbol;
  }

  // -----------------------------------
  // TOKEN RESOLUTION
  // -----------------------------------
  async resolve(symbol: string) {
    if (this.symbolMap.has(symbol)) {
      return this.symbolMap.get(symbol)!;
    }

    const tokenRaw = await resolveToken(symbol);

    if (!tokenRaw) return null;

    const token =
      typeof tokenRaw === "object"
        ? (tokenRaw as any).instrument_token ??
          (tokenRaw as any).token ??
          null
        : tokenRaw;

    if (!token) return null;

    this.symbolMap.set(symbol, token);

    return token;
  }

  // -----------------------------------
  // LIVE TICKS
  // -----------------------------------
  getCurrentTick(symbol: string) {
    return this.tickCache.get(symbol) ?? null;
  }

  getAllTicks() {
    return [...this.tickCache.values()];
  }

  // -----------------------------------
  // RESET
  // -----------------------------------
  clear() {
    this.symbolMap.clear();
    this.tickCache.clear();
    this.currentSymbol = "";
  }
}

export const symbolManager = new SymbolManager();

// -----------------------------------
// BACKWARD COMPATIBILITY EXPORTS
// -----------------------------------
export function setCurrentSymbol(symbol: string) {
  symbolManager.setCurrentSymbol(symbol);
}

export function getCurrentSymbol() {
  return symbolManager.getCurrentSymbol();
}

export async function resolveSymbol(symbol: string) {
  return symbolManager.resolve(symbol);
}

export function getCurrentTick(symbol: string) {
  return symbolManager.getCurrentTick(symbol);
}

