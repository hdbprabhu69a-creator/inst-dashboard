import { PatternResult } from "./types";

export type MarketBias = "BULLISH" | "BEARISH" | "NEUTRAL";

export type Signal = {
  bias: MarketBias;
  action: "BUY" | "SELL" | "WATCH";
  strength: number;
};

export function generateSignal(p: PatternResult): Signal {

  let bias: MarketBias = "NEUTRAL";
  let action: "BUY" | "SELL" | "WATCH" = "WATCH";

  // =========================
  // PATTERN BIAS
  // =========================
  const bullish = [
    "DOUBLE_BOTTOM",
    "TRIPLE_BOTTOM",
    "INVERSE_HEAD_SHOULDER",
    "CUP_HANDLE",
  ];

  const bearish = [
    "DOUBLE_TOP",
    "TRIPLE_TOP",
    "HEAD_SHOULDER",
  ];

  if (bullish.includes(p.pattern)) bias = "BULLISH";
  if (bearish.includes(p.pattern)) bias = "BEARISH";

  // =========================
  // BREAKOUT CONFIRMATION
  // =========================
  if (bias === "BULLISH" && p.target > p.breakout) {
    action = "BUY";
  }

  if (bias === "BEARISH" && p.target < p.breakout) {
    action = "SELL";
  }

  const strength = Math.round(p.confidence);

  return {
    bias,
    action,
    strength,
  };
}
