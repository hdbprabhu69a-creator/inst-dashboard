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

import { aggregateCandles } from "@/lib/history/aggregateCandles";
import { analyzePattern } from "@/lib/pattern/patternEngine";
import PatternOverlay from "@/lib/chart/PatternOverlay";
import PatternInfoOverlay from "@/lib/chart/PatternInfoOverlay";
import PatternLabels from "@/lib/chart/PatternLabels";
import { getPatternMetadata } from "@/lib/pattern/patternMetadata";
import type { PatternResult } from "@/lib/pattern/types";

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
  const volumeSeries = useRef<any>(null);const disposed = useRef(false);

  const lastCandleRef = useRef<Candle | null>(null);const visibleRangeRef = useRef<any>(null);
const logicalWidthRef = useRef<number | null>(null);
const barSpacingRef = useRef<number>(10);
const firstLoadRef = useRef(true);

/* const zoomStateRef = useRef({
  D:{ width:null as number | null, spacing:10 },
  W:{ width:null as number | null, spacing:10 },
  M:{ width:null as number | null, spacing:10 },
});

  */

const [searchOpen,setSearchOpen]=useState(false);
const [showIntervalMenu,setShowIntervalMenu]=useState(false);
const intervalBtnRef = useRef<HTMLButtonElement>(null);
const [menuPos,setMenuPos]=useState({left:0,top:0});



const cleanedCandlesRef = useRef<any[]>([]);
const historyCandlesRef = useRef<any[]>([]);
const isHoveringRef = useRef(false);

const [patternEnabled,setPatternEnabled]=useState(false);

const [pattern,setPattern]=useState<PatternResult | null>(null);

const [historyOHLC, setHistoryOHLC] = useState({
    time: "",
    open: 0,
    high: 0,
    low: 0,
    close: 0,
});

const [historyVolume,setHistoryVolume]=useState(0);
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

historyCandlesRef.current = [...cleaned];
cleanedCandlesRef.current = [...cleaned];

candle.setData(cleaned as any);
    volume.setData(
      cleaned.map((c) => ({
        time: c.time,
        value: c.volume,
      })) as any
    );

    const last = cleaned[cleaned.length - 1] || null;
    lastCandleRef.current = last;
    

    if(firstLoadRef.current){

    

requestAnimationFrame(()=>{

chart.timeScale().fitContent();
chart.timeScale().scrollToRealTime();

});

    firstLoadRef.current = false;

}
else if(false && logicalWidthRef.current !== null){

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

const width =
interval==="D"
? Math.min(logicalWidthRef.current ?? 80, Math.max(25,bars))
: Math.min(bars,30);

chart.timeScale().setVisibleLogicalRange({
    from: Math.max(0,bars-width),
    to: bars
});

requestAnimationFrame(()=>{

    chart.timeScale().fitContent();
chart.timeScale().scrollToRealTime();

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

      if (!param.time) {

        isHoveringRef.current = false;

        

        isHoveringRef.current = true;

setHistoryOHLC({
          time:"",
          open:0,
          high:0,
          low:0,
          close:0,
        });

        return;
      }

      const t =
  typeof param.time === "number"
    ? param.time
    : Math.floor(
        new Date(
          (param.time as any).year,
          (param.time as any).month - 1,
          (param.time as any).day
        ).getTime() / 1000
      );

const hovered =
  historyCandlesRef.current.find(
    (c:any)=>c.time===t
  );

if(!hovered) return;

isHoveringRef.current = true;

setHistoryOHLC({
  time:String(hovered.time),
  open:hovered.open,
  high:hovered.high,
  low:hovered.low,
  close:hovered.close,
});

setHistoryVolume(hovered.volume ?? 0);



    });

    // -----------------------------`r`n// OHLC STREAM (DISPLAY ONLY)
    // -----------------------------
    return ()=> {
      disposed.current = true;

      
      


      if(chartInstance.current){
    chart.remove();
}

      chartInstance.current = null;
      candleSeries.current = null;
      volumeSeries.current = null;
    };
  }, [symbol, interval]);

  


const togglePattern = () => {

    if(patternEnabled){

        setPattern(null);

        setPatternEnabled(false);

        return;

    }

    const result = analyzePattern(cleanedCandlesRef.current);

    setPattern(result);

    setPatternEnabled(true);

};

const displayOHLC = historyOHLC;

return (
    <div className="relative flex flex-col w-full h-full bg-[#0b0e11]">

      <div className="relative h-6 flex items-center gap-1 px-1 border-b border-zinc-800 text-[10px] leading-none whitespace-nowrap overflow-hidden">

<button ref={intervalBtnRef} onClick={()=>setSearchOpen(true)}
className="flex items-center gap-1 h-5 px-2 rounded border border-zinc-700 bg-[#131722] text-[10px] text-zinc-300 shrink-0"
>
<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<circle cx="11" cy="11" r="7"/>
<line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>

<span>{symbol}</span>



</button>

        <span className="font-semibold text-[12px] leading-none text-white">{symbol}</span>

        <span className="text-zinc-500">Â·</span>

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
className="flex items-center gap-1 h-5 px-1 rounded border border-zinc-700 bg-[#131722] text-[10px] font-semibold hover:bg-[#1b1f2a]"
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

<button
onClick={togglePattern}
className={`h-5 px-2 rounded border text-[10px] transition-colors ${
patternEnabled
? "border-green-600 bg-green-700 text-white"
: "border-zinc-700 bg-[#131722] text-zinc-300 hover:bg-zinc-800"
}`}
>
{patternEnabled ? "Hide Pattern" : "Detect Pattern"}
</button>

<span className="ml-2 text-zinc-500">O</span>
        <span className="text-[10px] text-white">{displayOHLC.open.toFixed(2)}</span>

        <span className="text-zinc-500">H</span>
        <span className="text-[10px] text-white">{displayOHLC.high.toFixed(2)}</span>

        <span className="text-zinc-500">L</span>
        <span className="text-[10px] text-white">{displayOHLC.low.toFixed(2)}</span>

        <span className="text-zinc-500">C</span>
        <span
  className={
    displayOHLC.close >= displayOHLC.open
      ? "font-medium text-green-400"
      : "font-medium text-red-400"
}
>
  {displayOHLC.close.toFixed(2)}
</span>

        <span className="ml-2 text-zinc-500">Vol</span>

        <span className="text-[10px] text-white">
          {Intl.NumberFormat("en",{
            notation:"compact",
            maximumFractionDigits:2
          }).format(historyVolume)}
        </span>

      </div>

<div className="relative flex-1 flex flex-col">

  <div className="relative flex-1 min-h-0">

    <div ref={chartRef} className="absolute inset-0" />

{chartInstance.current && pattern && (
<>
<PatternOverlay
chart={chartInstance.current}
pattern={pattern}
/>

<PatternInfoOverlay
pattern={pattern}
/>

</>
)}

    {searchOpen && (
      <div className="absolute left-0 top-0 z-[9999]">
        <StockSearchPopup
          open={searchOpen}
          onClose={()=>setSearchOpen(false)}
          onSelect={(s)=>{
            
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











































































































































