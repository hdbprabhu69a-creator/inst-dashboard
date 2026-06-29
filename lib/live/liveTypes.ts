export interface LiveTick {
  symbol: string;
  token: number;
  lastPrice: number;
  volume?: number;
  time: number;
}
