"use client";

import { startLiveBootstrap, stopLiveBootstrap } from "@/lib/live/liveBootstrap";
import { useEffect, useState } from "react";
import { setCurrentSymbol } from "@/lib/live/symbolManager";
import CandlestickChart from "@/lib/chart/CandlestickChart";

type Interval = "D" | "W" | "M";

export default function ChartAnalysisPage() {

  const [interval, setInterval] = useState<Interval>("D");

  const [symbol, setSymbol] = useState("SBIN");

  const [candles, setCandles] = useState<any[]>([]);


  const activeSymbol = symbol.trim();

  useEffect(() => {

    startLiveBootstrap();

    return () => {

        stopLiveBootstrap();

    };

}, []);

useEffect(() => {

    if (!activeSymbol) {
      setCandles([]);
      return;
    }

    setCurrentSymbol(activeSymbol);

    async function loadHistory() {

      try {

        const res = await fetch(
          `/api/history?symbol=${encodeURIComponent(activeSymbol)}&interval=${interval}`
        );

        const json = await res.json();

        setCandles(
          Array.isArray(json)
            ? json
            : (json.candles ?? [])
        );

      } catch (err) {

        console.error(err);

        setCandles([]);

      }

    }

    loadHistory();

  }, [activeSymbol, interval]);

  return (

    <div className="h-screen overflow-hidden bg-[#0b0e11] text-white p-0">

      <div className="w-full h-full">

        <CandlestickChart
    data={candles}
    symbol={activeSymbol}
    interval={interval}
    onIntervalChange={setInterval}
          onSymbolChange={setSymbol}
  />

      </div>

    </div>

  );

}













