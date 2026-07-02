"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { liveUIBridge } from "@/lib/data/liveUIBridge";
import SDKPatternRenderer from "@/lib/chart/SDKPatternRenderer";
import { buildRenderPlan } from "@/lib/chart/render/buildRenderPlan";

export default function LiveChart() {

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [active, setActive] = useState<any>(null);
  const [drawing, setDrawing] = useState<any>(null);

  // INIT CHART
  useEffect(() => {

    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "#000" },
        textColor: "#fff",
      },
      width: containerRef.current.clientWidth,
      height: 500,
    });

    chartRef.current = chart;

    return () => {
      chart.remove();
    };

  }, []);

  // LIVE DATA STREAM
  useEffect(() => {

    liveUIBridge.subscribe((data) => {

      if (!data?.symbol) return;

      setActive(data);
      setDrawing(data?.drawing || null);

    });

  }, []);

  return (
    <div className="p-4 bg-black text-white h-screen">

      <h2 className="text-blue-400 text-lg mb-2">
        ?? LIVE INSTITUTIONAL CHART
      </h2>

      {!active ? (
        <div className="text-gray-400">
          Select a stock to view live chart...
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm">
            <p>Symbol: <b>{active.symbol}</b></p>
            <p>Pattern: {active.pattern}</p>
            <p>Direction: {active.prediction?.direction}</p>
            <p>Confidence: {active.prediction?.confidence}</p>
            <p>Risk: {active.prediction?.failureRisk}</p>
          </div>

          {/* REAL CHART CONTAINER */}
          <div ref={containerRef} className="w-full h-[500px]" />

          {/* RENDER ENGINE */}
          {chartRef.current && (
            <SDKPatternRenderer
              chart={chartRef.current}
              plan={buildRenderPlan(drawing)}
            />
          )}
        </>
      )}

    </div>
  );
}

