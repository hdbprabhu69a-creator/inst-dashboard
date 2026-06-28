"use client";

import { useEffect, useMemo, useState } from "react";

import CandlestickChart from "@/lib/chart/CandlestickChart";
import TimeframeSelector from "@/lib/chart/TimeframeSelector";
import PatternPanel from "@/lib/chart/PatternPanel";

import { analyzePattern } from "@/lib/pattern/patternEngine";
import { PatternResult } from "@/lib/pattern/types";

type Interval = "D" | "W" | "M";

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function ChartAnalysisPage() {
  const [interval, setInterval] =
    useState<Interval>("D");

  const [symbol, setSymbol] =
    useState("SBIN");

  const [data, setData] =
    useState<Candle[]>([]);

  useEffect(() => {

  async function loadData() {

    try {

      const res =
        await fetch(
          `/api/history?symbol=${symbol}`
        );

      if (!res.ok)
        throw new Error(
          "Failed to load history"
        );

      const rows =
        await res.json();

      setData(rows);

    } catch (err) {

      console.error(err);

      setData([]);

    }

  }

  loadData();

}, [symbol, interval]);
  const patternResult: PatternResult =
    useMemo(() => {
      return analyzePattern(data);
    }, [data]);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Technical Character Lab
          </h1>

          <p className="text-zinc-400">
            Market Structure Intelligence Engine
          </p>
        </div>

        <input
          value={symbol}
          onChange={(e) =>
            setSymbol(
              e.target.value.toUpperCase()
            )
          }
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
        />

      </div>

      <div className="mb-5">

        <TimeframeSelector
          interval={interval}
          setInterval={setInterval}
        />

      </div>

      <div className="grid grid-cols-12 gap-5">

        <div className="col-span-9">

          <CandlestickChart
            data={data}
          />

        </div>

        <div className="col-span-3">

          <PatternPanel
            result={patternResult}
          />

        </div>

      </div>

    </div>
  );
}