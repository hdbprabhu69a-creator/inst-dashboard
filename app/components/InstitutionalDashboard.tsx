"use client";

import { useState } from "react";
import LiveScanner from "./LiveScanner";
import LiveChart from "./LiveChart";
import { heatmapEngine } from "@/lib/data/heatmapEngine";

export default function InstitutionalDashboard() {

  const [mode, setMode] = useState<"GRID" | "TRADER">("GRID");

  return (
    <div className="w-full h-screen bg-black text-white">

      {/* TOP BAR */}
      <div className="p-2 flex justify-between border-b border-gray-800">

        <div className="text-blue-400 font-bold">
          🏦 INSTITUTIONAL TERMINAL
        </div>

        <div className="space-x-2">
          <button onClick={() => setMode("GRID")} className="px-2 py-1 bg-gray-800">
            GRID
          </button>

          <button onClick={() => setMode("TRADER")} className="px-2 py-1 bg-gray-800">
            TRADER
          </button>
        </div>

      </div>

      {/* BODY */}
      {mode === "GRID" ? (

        <div className="grid grid-cols-3 h-full">

          {/* HEATMAP */}
          <div className="border-r border-gray-800 p-2">
            <h2 className="text-green-400">HEATMAP</h2>
            <pre className="text-xs text-gray-400">
              {JSON.stringify(heatmapEngine.getAll(), null, 2)}
            </pre>
          </div>

          {/* SCANNER */}
          <div className="border-r border-gray-800">
            <LiveScanner />
          </div>

          {/* SUMMARY */}
          <div className="p-2 text-gray-400">
            <h2 className="text-yellow-400">MARKET VIEW</h2>
            Live institutional signals streaming...
          </div>

        </div>

      ) : (

        /* TRADER MODE */
        <div className="h-full grid grid-cols-1">

          <div className="border-b border-gray-800">
            <LiveChart />
          </div>

          <div className="p-2 text-sm text-gray-400">
            <h2 className="text-blue-400">TRADER PANEL</h2>
            Live pattern + prediction view active...
          </div>

        </div>

      )}

    </div>
  );
}

