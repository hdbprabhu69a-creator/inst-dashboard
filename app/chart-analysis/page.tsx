"use client";

import { useEffect, useState } from "react";

import StockSearch from "@/components/StockSearch/StockSearch";
import StockSearchPopup from "@/components/StockSearch/StockSearchPopup";

import { setCurrentSymbol } from "@/lib/live/symbolManager";
import CandlestickChart from "@/lib/chart/CandlestickChart";

type Interval = "D" | "W" | "M";

export default function ChartAnalysisPage() {

  const [interval] = useState<Interval>("D");

  const [symbol,setSymbol]=useState("");

  const [searchOpen,setSearchOpen]=useState(false);

  const [candles,setCandles]=useState<any[]>([]);

  const activeSymbol=symbol.trim();

  useEffect(()=>{

    if(!activeSymbol){

      setCandles([]);

      return;

    }

    setCurrentSymbol(activeSymbol);

    async function loadHistory(){

      try{

        const res=await fetch(
          `/api/history?symbol=${encodeURIComponent(activeSymbol)}&interval=${interval}`
        );

        const json=await res.json();

        setCandles(
          Array.isArray(json)
            ? json
            : (json.candles ?? [])
        );

      }catch(err){

        console.error(err);

        setCandles([]);

      }

    }

    loadHistory();

  },[activeSymbol,interval]);

  return(

    <div className="min-h-screen bg-black text-white p-6">

      <div className="relative mb-6">

        <StockSearch
          value={symbol}
          onClick={()=>setSearchOpen(true)}
        />

        <StockSearchPopup
          open={searchOpen}
          onClose={()=>setSearchOpen(false)}
          onSelect={(s)=>{
            setCurrentSymbol(s);
            setSymbol(s);
          }}
        />

      </div>

      <div className="w-full">

        {activeSymbol.length>0 && (

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
