"use client";

import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

import { useEffect, useRef, useState } from "react";

import StockSearchPopup from "@/components/StockSearch/StockSearchPopup";
import { setCurrentSymbol } from "@/lib/live/symbolManager";

import { subscribe } from "@/lib/live/liveEngine";
import { subscribeOHLC } from "@/lib/live/ohlcEngine";
import { aggregateCandles } from "@/lib/history/aggregateCandles";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Props = {
  data: Candle[];
  symbol: string;
  interval: "D" | "W" | "M";
  onIntervalChange: (interval: "D" | "W" | "M") => void;
  onSymbolChange: (symbol: string) => void;
};

export default function CandlestickChart({
  data,
  symbol,
  interval,
  onIntervalChange,
  onSymbolChange,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartInstance = useRef<any>(null);
  const candleSeries = useRef<any>(null);
  const volumeSeries = useRef<any>(null);

  const tickUnsub = useRef<null | (() => void)>(null);
  const ohlcUnsub = useRef<null | (() => void)>(null);

  const disposed = useRef(false);

  const lastCandleRef = useRef<Candle | null>(null);
  const liveCandleRef = useRef<Candle | null>(null);
const visibleRangeRef = useRef<any>(null);
const logicalWidthRef = useRef<number | null>(null);
const barSpacingRef = useRef<number>(10);
const firstLoadRef = useRef(true);

  const [searchOpen,setSearchOpen]=useState(false);
const [showIntervalMenu,setShowIntervalMenu]=useState(false);
const intervalBtnRef = useRef<HTMLButtonElement>(null);
const [menuPos,setMenuPos]=useState({left:0,top:0});



const [ohlc, setOhlc] = useState({
    time: "",
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });

  useEffect(() => {
    if (!chartRef.current) return;

    disposed.current = false;

    tickUnsub.current?.();
    ohlcUnsub.current?.();

    chartInstance.current?.remove();

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: window.innerHeight - 42,

      layout: {
        background: { type: ColorType.Solid, color: "#0b0e11" },
        textColor: "#B2B5BE",
      },

      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },

      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { style: LineStyle.Dashed },
        horzLine: { style: LineStyle.Dashed },
      },

      rightPriceScale: {
  autoScale: true,
  mode: 1,
  scaleMargins: {
    top: 0.02,
    bottom: 0.18,
  },
},

      timeScale: {
        rightOffset: 10,
        barSpacing: 10,
      },
    });

    chartInstance.current = chart;

    const candle = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const volume = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
    });

    volume.priceScale().applyOptions({
      scaleMargins: {
  top: 0.80, bottom: 0.01,
},
    });

    candleSeries.current = candle;
    volumeSeries.current = volume;

    // -----------------------------
    // SAFE DATA LOAD
    // -----------------------------
    const cleaned = aggregateCandles((data || [])
      .map((c) => {
        let time = c.time;

        if (typeof time === "string") {
          time = Math.floor(new Date(time).getTime() / 1000);
        }

        if (time > 100000000000) {
          time = Math.floor(time / 1000);
        }

        return {
          time,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
          volume: Number(c.volume ?? 0),
        };
      })
      .filter((c) => Number.isFinite(c.time))
      .sort((a, b) => a.time - b.time), interval as "D" | "W" | "M");

    chart.applyOptions({
    timeScale:{
        barSpacing: barSpacingRef.current || 10,
        rightOffset:8,
        minBarSpacing:3
    }
});

candle.setData(cleaned as any);
    volume.setData(
      cleaned.map((c) => ({
        time: c.time,
        value: c.volume,
      })) as any
    );

    const last = cleaned[cleaned.length - 1] || null;
    lastCandleRef.current = last;
    liveCandleRef.current = last;

    if(firstLoadRef.current){

    

requestAnimationFrame(()=>{

chart.timeScale().scrollToPosition(6,false);

});

    firstLoadRef.current = false;

}
else if(logicalWidthRef.current !== null){

    chart.applyOptions({
timeScale:{
barSpacing:barSpacingRef.current
}
});

const bars = cleaned.length;

chart.applyOptions({
    timeScale:{
        barSpacing: barSpacingRef.current,
        rightOffset:8,
        minBarSpacing:3
    }
});

const width = logicalWidthRef.current ?? 80;

chart.timeScale().setVisibleLogicalRange({
    from: Math.max(0,bars-width),
    to: bars
});

requestAnimationFrame(()=>{

    chart.timeScale().scrollToPosition(6,false);

});

}

    const resize = () => {
      if (!chartRef.current) return;

      chart.applyOptions({
        width: chartRef.current.clientWidth,
        height: window.innerHeight - 42,
      });
    };

    window.addEventListener("resize", resize);
    resize();

    chart.timeScale().subscribeVisibleLogicalRangeChange((range)=>{


    visibleRangeRef.current = range;

    if(range){

        logicalWidthRef.current = range.to - range.from;

const opts = chart.timeScale().options();
if (opts?.barSpacing) {
    barSpacingRef.current = opts.barSpacing;
}

try{
    barSpacingRef.current =
        chart.timeScale().options().barSpacing;
}catch{}

    }

});

chart.subscribeCrosshairMove((param) => {

      if (!param.time) return;

      const t =
        typeof param.time === "number"
          ? param.time
          : (param.time as any).timestamp;

      const candle = cleaned.find(c => c.time === t);

      if (!candle) return;

      setOhlc({
        time: String(candle.time),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      });

    });

    // -----------------------------
    // LIVE TICK ENGINE (FIXED)
    // -----------------------------
    tickUnsub.current = subscribe((tick: any) => {
      if (disposed.current) return;
      if (!candleSeries.current) return;

      const last = liveCandleRef.current;
      if (!last) return;

      const price = Number(tick.lastPrice);
      if (!Number.isFinite(price) || price <= 0) return;

      if (Math.abs(price - last.close) > last.close * 0.5) return;

      const updated: Candle = {
        ...last,
        time: last.time,
        open: last.open,
        high: Math.max(last.high, price),
        low: Math.min(last.low, price),
        close: price,
        volume:
          Number(tick.volume ?? last.volume),
      };

      liveCandleRef.current = updated;

setOhlc({
  time: String(updated.time),
  open: updated.open,
  high: updated.high,
  low: updated.low,
  close: updated.close,
});

candleSeries.current.update(updated);

volumeSeries.current?.update({
  time: updated.time,
  value: updated.volume,
});
});

    // -----------------------------
    // OHLC STREAM (DISPLAY ONLY)
    // -----------------------------
    ohlcUnsub.current = subscribeOHLC((v) => {
      if (disposed.current) return;
});

    return () => {
      disposed.current = true;

      tickUnsub.current?.();
      ohlcUnsub.current?.();

      chart.remove();

      chartInstance.current = null;
      candleSeries.current = null;
      volumeSeries.current = null;
    };
  }, [data, symbol, interval]);

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0b0e11]">

      <div className="relative h-10 flex items-center gap-3 px-4 border-b border-zinc-800 text-sm whitespace-nowrap overflow-visible">

<button ref={intervalBtnRef} onClick={()=>setSearchOpen(true)}
className="flex items-center gap-2 h-8 px-3 rounded border border-zinc-700 bg-[#131722] text-xs text-zinc-300 shrink-0"
>
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<circle cx="11" cy="11" r="7"/>
<line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>

<span>{symbol}</span>

<span className="text-zinc-500">?</span>

</button>

        <span className="font-semibold text-white">{symbol}</span>

        <span className="text-zinc-500">·</span>

        <div className="relative inline-block">

<button ref={intervalBtnRef}
onClick={()=>{
const r=intervalBtnRef.current?.getBoundingClientRect();
if(r){
setMenuPos({
left:r.left,
top:r.bottom+4
});
}
setShowIntervalMenu(v=>!v);
}}
className="flex items-center gap-1 h-6 px-2 rounded border border-zinc-700 bg-[#131722] text-[10px] font-semibold hover:bg-[#1b1f2a]"
>

<span>{interval}</span>

<svg
xmlns="http://www.w3.org/2000/svg"
width="10"
height="10"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
>
<polyline points="6 9 12 15 18 9"/>
</svg>

</button>

{showIntervalMenu && (

<div
style={{
position:"fixed",
left:menuPos.left,
top:menuPos.top,
width:96,
zIndex:999999
}}
className="rounded border border-zinc-700 bg-[#131722] shadow-2xl"
>

{(["D","W","M"] as const).map(v=>(

<button key={v}
onClick={()=>{
onIntervalChange(v);
setShowIntervalMenu(false);
}}
className={`block w-full px-2 py-2 text-left text-[10px] hover:bg-zinc-700 ${
interval===v
? "bg-[#2A2E39] text-white"
: "text-zinc-300"
}`}
>

{v==="D"?"DAY":v==="W"?"WEEK":"MONTH"}

</button>

))}

</div>

)}

</div>

<span className="ml-5 text-zinc-500">O</span>
        <span className="text-white">{ohlc.open.toFixed(2)}</span>

        <span className="text-zinc-500">H</span>
        <span className="text-white">{ohlc.high.toFixed(2)}</span>

        <span className="text-zinc-500">L</span>
        <span className="text-white">{ohlc.low.toFixed(2)}</span>

        <span className="text-zinc-500">C</span>
        <span
  className={
    ohlc.close >= ohlc.open
      ? "font-medium text-green-400"
      : "font-medium text-red-400"
}
>
  {ohlc.close.toFixed(2)}
</span>

        <span className="ml-5 text-zinc-500">Vol</span>

        <span className="text-white">
          {Intl.NumberFormat("en",{
            notation:"compact",
            maximumFractionDigits:2
          }).format(liveCandleRef.current?.volume ?? 0)}
        </span>

      </div>

<div className="relative flex-1 flex flex-col">

  <div className="relative flex-1 min-h-0">

    <div ref={chartRef} className="absolute inset-0" />

    {searchOpen && (
      <div className="absolute left-0 top-0 z-[9999]">
        <StockSearchPopup
          open={searchOpen}
          onClose={()=>setSearchOpen(false)}
          onSelect={(s)=>{
            setCurrentSymbol(s);
            setSearchOpen(false);
            onSymbolChange(s);
          }}
        />
      </div>
    )}

  </div>

</div>

</div>
  );


}





























