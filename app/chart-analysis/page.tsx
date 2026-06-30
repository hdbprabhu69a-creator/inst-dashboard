"use client";

import { useState } from "react";

import StockSearch from "@/components/StockSearch/StockSearch";

import CandlestickChart from "@/lib/chart/CandlestickChart";
import TimeframeSelector from "@/lib/chart/TimeframeSelector";
import PatternPanel from "@/lib/chart/PatternPanel";

import { useLiveChart } from "@/hooks/useLiveChart";
import { useHistory } from "@/hooks/useHistory";
import { usePatternHistory } from "@/hooks/usePatternHistory";
import { useKiteData } from "@/hooks/useKiteData";

import { PatternResult } from "@/lib/pattern/types";

type Interval = "D" | "W" | "M";

export default function ChartAnalysisPage() {
  const [interval, setInterval] = useState<Interval>("D");
  const [symbol, setSymbol] = useState("SBIN");

  // âœ… LIVE ENGINE (REPLACES FETCH COMPLETELY)
  const { data, pattern } = useLiveChart(symbol, interval);
const { candles } = useHistory(symbol);
const historyPattern = usePatternHistory(candles);

const { data: liveData } = useKiteData(symbol);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex items-center justify-between mb-6">

        

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
            data={candles.length ? candles : data}
            symbol={symbol}
            interval={interval}
            pattern={historyPattern ?? pattern}
            liveData={liveData}
          />

        </div>

        <div className="col-span-3">

          <PatternPanel
            result={pattern as PatternResult}
          />

        </div>

      </div>

    </div>
  );
}






