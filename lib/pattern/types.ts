import { PatternDrawing } from "@/lib/chart/render/PatternDrawing";

export type Timeframe =
  | "D"
  | "W"
  | "M";

export type Candle = {

  time: string;

  open: number;

  high: number;

  low: number;

  close: number;

  volume: number;

};

export type SwingType =
  | "HIGH"
  | "LOW";

export type SwingClass =
  | "HH"
  | "HL"
  | "LH"
  | "LL"
  | "NONE";

export type SwingPoint = {

  index: number;

  time: string;

  price: number;

  type: SwingType;

  classification: SwingClass;

  strength: number;

};

export type TrendLine = {

  start: SwingPoint;

  end: SwingPoint;

  slope: number;

  intercept: number;

  touches: number;

  broken: boolean;

};

export type PatternPoint = {

  label: string;

  swing: SwingPoint;

};

export type PatternType =
  | "NONE"
  | "HEAD_SHOULDER"
  | "INVERSE_HEAD_SHOULDER"
  | "DOUBLE_TOP"
  | "DOUBLE_BOTTOM"
  | "TRIPLE_TOP"
  | "TRIPLE_BOTTOM"
  | "ASC_TRIANGLE"
  | "DESC_TRIANGLE"
  | "SYM_TRIANGLE"
  | "CUP_HANDLE"
  | "BULL_FLAG"
  | "BEAR_FLAG"
  | "CHANNEL"
  | "RECTANGLE"
  | "RISING_WEDGE"
  | "FALLING_WEDGE";

export type PatternResult = {

  pattern: PatternType;

  confidence: number;

  breakout: number;

  stoploss: number;

  target: number;

  swings: SwingPoint[];

  trendLines: TrendLine[];

  points: PatternPoint[];

  drawing?: PatternDrawing;

};


