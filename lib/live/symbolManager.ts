import { subscribe } from "./liveEngine";
import { resolveToken } from "../tokenResolver";

type Tick = {
  symbol: string;
  lastPrice: number;
  time?: number;
};

class SymbolManager {
  // 🔥 allow flexible token types (Kite / API / number mapping)
  private symbolMap: Map<string, number | string> = new Map();

  // latest tick per symbol
  private tickCache: Map<string, Tick> = new Map();

  constructor() {
    this.init();
  }

  // -----------------------------------
  // SUBSCRIBE TO GLOBAL TICK STREAM
  // -----------------------------------
  init() {
    subscribe((tick: Tick) => {
      if (!tick?.symbol) return;

      const price = Number(tick.lastPrice);
      if (!Number.isFinite(price) || price <= 0) return;

      this.tickCache.set(tick.symbol, tick);
    });
  }

  // -----------------------------------
  // TOKEN RESOLVER (SAFE NORMALIZED)
  // -----------------------------------
  async resolve(symbol: string) {
    if (this.symbolMap.has(symbol)) {
      return this.symbolMap.get(symbol);
    }

    const tokenRaw = await resolveToken(symbol);

    if (!tokenRaw) return null;

    // 🔥 normalize possible API shapes
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
  // GET LATEST TICK (FOR UI / CHART)
  // -----------------------------------
  getCurrentTick(symbol: string) {
    return this.tickCache.get(symbol) || null;
  }

  // -----------------------------------
  // GET ALL LIVE TICKS
  // -----------------------------------
  getAllTicks() {
    return Array.from(this.tickCache.values());
  }

  // -----------------------------------
  // CLEAR CACHE (RESET STATE)
  // -----------------------------------
  clear() {
    this.symbolMap.clear();
    this.tickCache.clear();
  }
}

export const symbolManager = new SymbolManager();