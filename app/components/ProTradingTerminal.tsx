"use client";

import { useEffect, useState } from "react";
import LiveChart from "./LiveChart";
import { heatmapEngine } from "@/lib/data/heatmapEngine";
import { statisticsEngine } from "@/lib/engine/statisticsEngine";
import { performanceDashboard } from "@/lib/engine/performanceDashboard";

export default function ProTradingTerminal() {

  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {

    const interval = setInterval(() => {

      setHeatmap(heatmapEngine.getAll());

      setStats({
        expectancy: statisticsEngine.expectancy(),
        variance: statisticsEngine.variance(),
        sharpe: statisticsEngine.sharpeLike(),
        performance: performanceDashboard.getSummary()
      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="w-full h-screen bg-black text-white flex">

      {/* LEFT - HEATMAP */}
      <div className="w-1/4 border-r border-gray-800 p-2 overflow-auto">
        <h2 className="text-green-400 font-bold">HEATMAP</h2>

        {heatmap.slice(0, 12).map((h, i) => (
          <div key={i} className="p-2 border-b border-gray-800">
            <div>{h.symbol}</div>
            <div className="text-xs text-gray-400">
              STR: {h.strength} | {h.trend}
            </div>
          </div>
        ))}
      </div>

      {/* CENTER - CHART */}
      <div className="flex-1 border-r border-gray-800">
        <LiveChart />
      </div>

      {/* RIGHT - STATS */}
      <div className="w-1/4 p-2">

        <h2 className="text-blue-400 font-bold">STATISTICS ENGINE</h2>

        <div className="text-sm mt-2 space-y-2">
          <div>Expectancy: {stats.expectancy?.toFixed?.(3)}</div>
          <div>Variance: {stats.variance?.toFixed?.(3)}</div>
          <div>Sharpe: {stats.sharpe?.toFixed?.(3)}</div>
        </div>

        <div className="mt-4 text-yellow-400">
          📊 SYSTEM STATUS: LIVE PRO MODE
        </div>

      </div>

    </div>
  );
}
