import { PatternResult } from "@/lib/pattern/types";
import { RenderPlan } from "./RenderPlan";
import { generateSignal } from "@/lib/pattern/signalEngine";

export function buildRenderPlan(pattern: PatternResult | null): RenderPlan | null {

  if (!pattern) return null;

  const signal = generateSignal({
    ...pattern,
    pattern: pattern.pattern,
    confidence: pattern.confidence,
    breakout: pattern.breakout,
    target: pattern.target,
    stoploss: pattern.stoploss,
  } as any);

  if (!pattern || pattern.trendLines.length === 0) return null;

const last = pattern.trendLines.at(-1);

  return {

    lines: (pattern.trendLines ?? []).map((t:any) => ({
      points: [
        { time: t.start.time, value: t.start.price },
        { time: t.end.time, value: t.end.price }
      ],
      color: "#FFD54F",
      width: 2
    })),

    markers: [
      {
        time: last?.end.time ?? "",
        price: last?.end.price ?? 0,
        color:
          signal.action === "BUY" ? "#22c55e" :
          signal.action === "SELL" ? "#ef4444" :
          "#f59e0b",
        type: "signal"
      }
    ]

  };

}






