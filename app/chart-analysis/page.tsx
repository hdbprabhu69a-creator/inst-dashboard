"use client";

import { useEffect, useState } from "react";

import StockSearch from "@/components/StockSearch/StockSearch";
import StockSearchPopup from "@/components/StockSearch/StockSearchPopup";

import { setCurrentSymbol } from "@/lib/live/symbolManager";
import CandlestickChart from "@/lib/chart/CandlestickChart";

// 👉 ONLY ENGINE SOURCE (NEW)
import { subscribeCandles } from "@/lib/live/candleEngine";

type Interval = "D" | "W" | "M";

export default function ChartAnalysisPage() {
  const [interval] = useState<Interval>("D");
  const [symbol, setSymbol] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);

  const activeSymbol = symbol.trim();

  const [candles, setCandles] = useState<any[]>([]);

  // 🔥 SINGLE SOURCE OF TRUTH SUBSCRIPTION
  useEffect(() => {
    if (!activeSymbol) return;

    setCurrentSymbol(activeSymbol);

    const unsub = subscribeCandles(activeSymbol, interval, (data) => {
      setCandles(data);
    });

    return () => {
      unsub?.();
    };
  }, [activeSymbol, interval]);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* SEARCH */}
      <div className="relative mb-6">

        <StockSearch
          value={symbol}
          onClick={() => setSearchOpen(true)}
        />

        <StockSearchPopup
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelect={(s) => {
            setCurrentSymbol(s);
            setSymbol(s);
          }}
        />

      </div>

      {/* CHART */}
      <div className="w-full">
        {activeSymbol.length > 0 && (
          <CandlestickChart
            data={candles}
            symbol={activeSymbol}
            interval={interval}
          />
        )}
      </div>

    </div>
  );
}