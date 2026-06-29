export interface InstrumentInfo {
  token:number;
  symbol:string;
  exchange:string;
  tradingsymbol:string;
  tickSize:number;
  lotSize:number;
}

export type SymbolMap = Map<string, InstrumentInfo>;
export type TokenMap = Map<number, InstrumentInfo>;

export interface ResolverState {
  symbolMap: SymbolMap;
  tokenMap: TokenMap;
  loaded: boolean;
  lastLoaded?: Date;
}
