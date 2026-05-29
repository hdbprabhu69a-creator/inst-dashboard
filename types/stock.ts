export interface Stock {
  symbol: string;
  sector: string;
  exchange: string;
  active: boolean;
}

export interface WatchlistStock {
  symbol: string;
  addedAt: number;
}