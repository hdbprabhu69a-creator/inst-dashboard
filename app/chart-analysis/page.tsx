"use client";

import { useState } from "react";

import StockSearch from "@/components/StockSearch/StockSearch";
import StockSearchPopup from "@/components/StockSearch/StockSearchPopup";

import { setCurrentSymbol } from "@/lib/live/symbolManager";

import CandlestickChart from "@/lib/chart/CandlestickChart";

import { useLiveChart } from "@/hooks/useLiveChart";
import { useHistory } from "@/hooks/useHistory";
import { usePatternHistory } from "@/hooks/usePatternHistory";
import { useKiteData } from "@/hooks/useKiteData";

type Interval = "D" | "W" | "M";

export default function ChartAnalysisPage() {
  const [interval] = useState<Interval>("D");

  const [symbol, setSymbol] = useState<string>("");

  const [searchOpen, setSearchOpen] = useState(false);

  const activeSymbol = symbol.trim();

  const { data, pattern } =
    useLiveChart(activeSymbol, interval);

  const { candles } =
    useHistory(activeSymbol);

  const historyPattern =
    usePatternHistory(candles);

  const { data: liveData } =
    useKiteData(activeSymbol);

  return (
    <div className="min-h-screen bg-black text-white p-6">

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

      <div className="w-full">

        {activeSymbol.length > 0 && (

          <CandlestickChart
  data={data}
  symbol={activeSymbol}
  interval={interval}
  pattern={pattern}
  liveData={liveData}
/>
        )}

      </div>

    </div>
  );
}