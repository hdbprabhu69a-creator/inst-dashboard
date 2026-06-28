"use client";

import { useEffect } from "react";
import { IChartApi, LineSeries } from "lightweight-charts";
import { RenderPlan } from "./render/RenderPlan";
import { PatternSeriesManager } from "./render/PatternSeriesManager";

type Props = {
  chart: IChartApi;
  plan: RenderPlan | null;
};

export default function SDKPatternRenderer({
  chart,
  plan,
}: Props) {

  useEffect(() => {

    if (!plan) return;

    PatternSeriesManager.clear(chart);

    // =========================
    // DRAW LINES
    // =========================
    plan.lines.forEach((line) => {

      const s = chart.addSeries(LineSeries, {
        color: line.color,
        lineWidth: line.width,
      });

      s.setData(line.points);

      PatternSeriesManager.register(chart, s, "line");

    });

    // =========================
    // DRAW MARKERS
    // =========================
    plan.markers.forEach((m) => {

      const marker = chart.addSeries(LineSeries, {
        color: m.color,
        lineWidth: 0,
      });

      marker.setData([
        {
          time: m.time as any,
          value: m.price,
        }
      ]);

      PatternSeriesManager.register(chart, marker, "marker");

    });

    return () => {
      PatternSeriesManager.clear(chart);
    };

  }, [chart, plan]);

  return null;
}
