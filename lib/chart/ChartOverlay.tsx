"use client";

import SDKPatternRenderer from "./SDKPatternRenderer";
import { IChartApi } from "lightweight-charts";
import { PatternResult } from "@/lib/pattern/types";
import { useRenderPlan } from "./render/useRenderPlan";

type Props = {
  chart: IChartApi;
  pattern: PatternResult | null;
};

export default function ChartOverlay({
  chart,
  pattern,
}: Props) {

  const plan = useRenderPlan(pattern);

  if (!plan) return null;

  return (
    <>
      <SDKPatternRenderer
        chart={chart}
        plan={plan}
      />
    </>
  );

}
