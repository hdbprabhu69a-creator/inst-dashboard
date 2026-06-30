"use client";

import { useState } from "react";

import StockSearch from "@/components/StockSearch/StockSearch";

import CandlestickChart from "@/lib/chart/CandlestickChart";import PatternPanel from "@/lib/chart/PatternPanel";

import { useLiveChart } from "@/hooks/useLiveChart";
import { useHistory } from "@/hooks/useHistory";
import { usePatternHistory } from "@/hooks/usePatternHistory";
import { useKiteData } from "@/hooks/useKiteData";

import { PatternResult } from "@/lib/pattern/types";

type Interval = "D" | "W" | "M";

export default function ChartAnalysisPage() {
  const [interval, setInterval] = useState<Interval>("D");
  const [symbol, setSymbol] = useState<string>("");

  // âœ… LIVE ENGINE (REPLACES FETCH COMPLETELY)
  const activeSymbol = symbol.trim();
const { data, pattern } = useLiveChart(activeSymbol, interval);
const { candles } = useHistory(activeSymbol);
const historyPattern = usePatternHistory(candles);

const { data: liveData } = useKiteData(activeSymbol);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex items-center justify-between mb-6">
  <StockSearch value={symbol} onChange={setSymbol} />

        

      </div>

      <div className="w-full">

        <div className="w-full">

          {activeSymbol && (
<CandlestickChart
            data={candles.length ? candles : data}
            symbol={activeSymbol}
            interval={interval}
            pattern={historyPattern ?? pattern}
            liveData={liveData}
          />
)}
</div>

        </div>

    </div>
  );
}









