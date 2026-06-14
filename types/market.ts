export interface PivotLevels {

  pivot: number;

  r1: number;
  r2: number;
  r3: number;

  s1: number;
  s2: number;
  s3: number;

}

export interface CPRLevels {

  pivot: number;

  tc: number;

  bc: number;

}

export interface OHLCData {

  open?: number;

  high: number;

  low: number;

  close: number;

  volume: number;

  vwap: number;

}

export interface SwingData {

  high: number;

  low: number;

  range: number;

  highDate: any;

  lowDate: any;

}

export interface FibData {

  fib236: number;

  fib382: number;

  fib50: number;

  fib618: number;

  fib786: number;

}

export interface MarketStructure {

  symbol: string;

  instrumentToken: number;

  cmp: number;

  //
  // DAILY
  //

  dailyOHLC: OHLCData;

  dailyPivot: PivotLevels;

  dailyCPR: CPRLevels;

  dailyVWAP: number;

  totalVolumeDaily: number;

  //
  // WEEKLY
  //

  weeklyOHLC: OHLCData;

  weeklyPivot: PivotLevels;

  weeklyCPR: CPRLevels;

  weeklyVWAP: number;

  totalVolumeWeekly: number;

  //
  // MONTHLY
  //

  monthlyOHLC: OHLCData;

  monthlyPivot: PivotLevels;

  monthlyCPR: CPRLevels;

  monthlyVWAP: number;

  totalVolumeMonthly: number;

  //
  // SWINGS
  //

  oneWeekSwing: SwingData;

  twoWeekSwing: SwingData;

  oneMonthSwing: SwingData;

  threeMonthSwing: SwingData;

  sixMonthSwing: SwingData;

  oneYearSwing: SwingData;

  //
  // FIBS
  //

  oneWeekFib: FibData;

  twoWeekFib: FibData;

  oneMonthFib: FibData;

  threeMonthFib: FibData;

  sixMonthFib: FibData;

  oneYearFib: FibData;

  //
  // SCORES
  //

  heatScore: number;

  rsScore: number;

  volumeScore: number;

  deliveryScore: number;

  sectorScore: number;

  trendScore: number;

  //
  // METADATA
  //

  updatedAt?: string;

  updatedAtReadable?: string;

}

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

export interface MarketState {

  data: KiteApiResponse | null;

  loading: boolean;

  error: string | null;

}