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

export interface KiteApiResponse {

  success: boolean;

  symbol: string;

  quote: {

    [exchangeSymbol: string]:
      QuoteData;

  };

}

export interface MarketStructure {

  symbol: string;

  instrument_token: number;

  ltp: number;

  open: number;

  high: number;

  low: number;

  close: number;

  volume: number;

  average_price: number;

  timestamp: string;

}

export interface MarketState {

  data: KiteApiResponse | null;

  loading: boolean;

  error: string | null;

}