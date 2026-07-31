"use client";

import { useState, useEffect } from "react";
import LiveChart from "./LiveChart";
import { heatmapEngine } from "@/lib/data/heatmapEngine";
import { performanceDashboard } from "@/lib/engine/performanceDashboard";
import { statisticsEngine } from "@/lib/engine/statisticsEngine";
import { learningEngine } from "@/lib/engine/learningEngine";

export default function LiveDashboard() {

  const [mode, setMode] = useState<"GRID" | "TRADER">("GRID");
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {

    const interval = setInterval(() => {

      setHeatmap(heatmapEngine.getAll());

      setStats({
        performance: performanceDashboard.getSummary(),
        expectancy: statisticsEngine.expectancy(),
        variance: statisticsEngine.variance(),
        sharpe: statisticsEngine.sharpeLike(),
        learningPatterns: learningEngine
      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">

      {/* TOP BAR */}
      <div className="flex justify-between p-2 border-b border-gray-800">

        <div className="text-green-400 font-bold">
          🏦 LIVE INSTITUTIONAL DASHBOARD
        </div>

        <div className="space-x-2">
          <button onClick={() => setMode("GRID")} className="px-3 py-1 bg-gray-800">
            GRID
          </button>
          <button onClick={() => setMode("TRADER")} className="px-3 py-1 bg-gray-800">
            TRADER
          </button>
        </div>

      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-1/3 border-r border-gray-800 p-2 overflow-auto">

          <h2 className="text-yellow-400">HEATMAP</h2>
          <pre className="text-xs text-gray-400">
            {JSON.stringify(heatmap.slice(0, 10), null, 2)}
          </pre>

          <h2 className="text-blue-400 mt-4">STATISTICS ENGINE</h2>
          <pre className="text-xs text-gray-400">
            {JSON.stringify(stats, null, 2)}
          </pre>

        </div>

        {/* CENTER PANEL */}
        <div className="flex-1 p-2">

          {mode === "TRADER" ? (
            <LiveChart />
          ) : (
            <div className="text-gray-400">
              📊 GRID MODE ACTIVE — Scanner + Heatmap Running
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

