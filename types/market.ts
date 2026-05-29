export interface QuoteData {
  instrument_token: number;
  last_price: number;
  volume: number;
  average_price: number;
  timestamp: string;

  ohlc: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
}

export interface MarketData {
  ["NSE:KARURVYSYA"]?: QuoteData;
  ["NSE:RELIANCE"]?: QuoteData;
  ["NSE:SBIN"]?: QuoteData;
}

export interface MarketState {
  data: MarketData | null;
  loading: boolean;
  error: string | null;
}