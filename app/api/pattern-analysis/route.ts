import { NextResponse } from "next/server";

export async function GET() {

  // TODO: Replace with your 99-stock universe
  const data = [
    {
      symbol: "SBIN",
      sector: "BANK",
      cmp: 1012,
      trend: "UPTREND",
      state: "BREAKOUT",
      pattern: "Bull Flag",
      confidence: 92,
      entry: 1018,
      target1: 1085,
      target2: 1132,
      stop: 987,
      rr: 3.4,
      action: "BUY"
    },
    {
      symbol: "TVSMOTOR",
      sector: "AUTO",
      cmp: 3911,
      trend: "RANGE",
      state: "EXPANSION",
      pattern: "Broadening",
      confidence: 80,
      entry: 0,
      target1: 0,
      target2: 0,
      stop: 0,
      rr: 0,
      action: "WATCH"
    },
    {
      symbol: "KARURVYSYA",
      sector: "BANK",
      cmp: 338,
      trend: "UPTREND",
      state: "BREAKOUT",
      pattern: "Rectangle",
      confidence: 88,
      entry: 339,
      target1: 360,
      target2: 378,
      stop: 324,
      rr: 2.8,
      action: "BUY"
    }
  ];

  return NextResponse.json({
    success: true,
    data
  });

}

