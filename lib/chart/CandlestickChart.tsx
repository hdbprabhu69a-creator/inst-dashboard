
"use client";

import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineStyle,
  CrosshairMode,
  ColorType,
} from "lightweight-charts";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { liveUIBridge } from "@/lib/liveData/liveUIBridge";

import { subscribe, publishTick } from "@/lib/live/liveEngine";

import { subscribeOHLC, updateOHLC } from "@/lib/live/ohlcEngine";

import { getCurrentSymbol } from "@/lib/live/symbolManager";

import PatternOverlay from "@/lib/chart/PatternOverlay";
import PatternInfoCard from "@/lib/chart/PatternInfoCard";
import PatternToolbar from "@/lib/chart/PatternToolbar";
import PatternLegend from "@/lib/chart/PatternLegend";
import PatternRenderer from "@/lib/chart/PatternRenderer";
import ChartOverlay from "@/lib/chart/ChartOverlay";
import CrosshairInfo from "@/lib/chart/CrosshairInfo";
import { useCrosshair } from "@/lib/chart/useCrosshair";

import {
  analyzePattern,
} from "@/lib/pattern/patternEngine";

import {
  PatternResult,
} from "@/lib/pattern/types";

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

type Props = {
  data: Candle[];
  symbol: string;
  interval: string;
  pattern?: any;
  liveData?: any;
};

export default function CandlestickChart({
  data,
  symbol,
  interval,
  pattern: externalPattern,
  liveData,
}: Props) {

  const chartRef =
    useRef<HTMLDivElement>(null);
    const chartInstance =
  useRef<any>(null);

const TickUnsub = useRef<null | (() => void)>(null);

const ohlcUnsub = useRef<null | (() => void)>(null);

const candleSeries =
  useRef<any>(null);

const { crosshair, setCrosshair } = useCrosshair();

const pattern =
  useMemo<PatternResult | null>(
    () =>
      analyzePattern(data),
    [liveData]
  );
    const lastPrice =
  data.length > 0
    ? liveData[data.length - 1].close
    : 0;

const previousClose =

  data.length > 1

    ? liveData[
        data.length - 2
      ].close

    : lastPrice;

const change =

  lastPrice -
  previousClose;

const changePercent =

  previousClose === 0

    ? 0

    : (
        change /
        previousClose
      ) * 100;

const lastVolume =

  data.length > 0

    ? liveData[
        data.length - 1
      ].volume ?? 0

    : 0;    // =====================================================
// BLOCK 7 -  OHLC
// =====================================================

useEffect(() => {
  console.log("==================================");
  console.log(" liveData", liveData);
console.log("QUOTE", liveData?.quote?.[`NSE:${symbol}`]);
      console.log("==================================");
}, [data]);
const [ohlc, setOhlc] =
  useState(() => {

    if (data.length === 0) {

      return {

        time: "",

        open: 0,

        high: 0,

        low: 0,

        close: 0,

      };

    }

    const last =
      liveData[data.length - 1];

    return {

      time:
        last.time,

      open:
        last.open,

      high:
        last.high,

      low:
        last.low,

      close:
        last.close,

    };

  });      // =====================================================
  // BLOCK 2 - CREATE TRADINGVIEW STYLE CHART
  // =====================================================

  useEffect(() => {

    if (
      !chartRef.current ||
      data.length === 0
    ) {
      return;
    }

    chartRef.current.innerHTML = "";

   const chart =
  createChart(
    chartRef.current,
    {

      width:
        chartRef.current.clientWidth,

      height: 700,

      layout: {

        background: {
          type:
            ColorType.Solid,
          color:
            "#0b0e11",
        },

        textColor:
          "#B2B5BE",

      },

      grid: {

        vertLines: {
          color:
            "#1f2937",
        },

        horzLines: {
          color:
            "#1f2937",
        },

      },

      crosshair: {

        mode:
          CrosshairMode.Normal,

        vertLine: {

          color:
            "#6b7280",

          width: 1,

          style:
            LineStyle.Dashed,

        },

        horzLine: {

          color:
            "#6b7280",

          width: 1,

          style:
            LineStyle.Dashed,

        },

      },

      rightPriceScale: {

        visible: true,

        borderColor:
          "#27272a",

        autoScale: true,

      },

      timeScale: {

        borderColor:
          "#27272a",

        rightOffset: 15,

        barSpacing: 10,

        fixLeftEdge: false,

        fixRightEdge: false,

        timeVisible: false,

      },

    }

  );
  chartInstance.current = chart;

          // =====================================================
    // BLOCK 3 - CANDLES + VOLUME (TradingView Style)
    // =====================================================

   const candle =
  chart.addSeries(
        CandlestickSeries,
        {

          upColor:
            "#26a69a",

          downColor:
            "#ef5350",

          borderVisible:
            false,

          wickUpColor:
            "#26a69a",

          wickDownColor:
            "#ef5350",

          priceLineVisible:
            true,

          lastValueVisible:
            true,

        }
      );

   const chartData = [...data]
  .sort(
    (a, b) =>
      new Date(a.time).getTime() -
      new Date(b.time).getTime()
  )
  .filter(
    (candle, index, arr) =>
      index === 0 ||
      new Date(candle.time).getTime() !==
      new Date(arr[index - 1].time).getTime()
  )
  .map(c => ({
    time: Math.floor(
      new Date(c.time).getTime() / 1000
    ),
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume ?? 0,
}));

candle.setData(chartData);

candleSeries.current = candle;

TickUnsub.current = subscribe((tick: any) => {
  const last = chartData[chartData.length - 1];
  if (!last) return;

  updateOHLC({
    symbol: getCurrentSymbol(),
    token: 0,
    lastPrice: tick.lastPrice,
    volume: tick.volume ?? 0,
    time: tick.time,
  });

  candleSeries.current?.update({
    time: last.time,
    open: last.open,
    high: Math.max(last.high, tick.lastPrice),
    low: Math.min(last.low, tick.lastPrice),
    close: tick.lastPrice,
    volume: tick.volume ?? 0,
  });
});

ohlcUnsub.current = subscribeOHLC((v) => {  setOhlc({
    time:String(v.time),
    open:v.open,
    high:v.high,
    low:v.low,
    close:v.close,
  });
});

const unsubscribe = liveUIBridge.subscribe((tick: any) => {
  if (!candleSeries.current) return;
  if (!liveData || data.length === 0) return;

  const last = chartData[chartData.length - 1];

  if (!last) return;

  candleSeries.current.update({
    time: last.time, // IMPORTANT: keep historical format
    open: last.open,
    high: Math.max(last.high, tick.last_price),
    low: Math.min(last.low, tick.last_price),
    close: tick.last_price,
  });
});
  (chart as any).__candleSeries = candle;
    const volume =
      chart.addSeries(
        HistogramSeries,
        {

          priceFormat: {
            type:
              "volume",
          },

          priceScaleId:
            "",

        }
      );

    volume.priceScale().applyOptions({

        scaleMargins: {

          top: 0.82,

          bottom: 0,

        },

      });

   volume.setData(

  chartData.map(
    c => ({

      time: c.time,

      value:
        ("volume" in c ? c.volume : 0),

      color:
        c.close >= c.open
          ? "#26a69a66"
          : "#ef535066",

    })
  )

);
    chart.timeScale().fitContent();
          // =====================================================
    // BLOCK 4 - TV INTERACTION + RESIZE + CLEANUP
    // =====================================================

    const resize = () => {

      if (!chartRef.current)
        return;

      chart.applyOptions({

        width:
          chartRef.current.clientWidth,

        height: 700,

      });

    };

window.addEventListener("resize", resize);

chart.subscribeCrosshairMove((param) => {
  if (!param.point || !param.time) return;

  const price = param.seriesData.get(candle);
  if (!price) return;

  setOhlc({
    time: String(param.time),
    open: (price as any).open,
    high: (price as any).high,
    low: (price as any).low,
    close: (price as any).close,
  });

  setCrosshair({
    time: String(param.time),
    open: (price as any).open,
    high: (price as any).high,
    low: (price as any).low,
    close: (price as any).close,
    volume: (price as any).volume ?? 0,
  });
});

// IMPORTANT: CLEAN CLOSE OF EFFECT
}, [data]);// IMPORTANT CLOSE


return (
  <div className="flex w-full h-full bg-[#0b0e11] text-white">

    {/* LEFT TOOLBAR */}
    <div className="w-12 bg-[#131722] border-r border-zinc-800 flex flex-col items-center py-3 gap-2">
      {/* tools preserved */}
    </div>

    {/* MAIN PANEL */}
    <div className="flex-1 flex flex-col">

      {/* TOP INSTITUTIONAL STRIP */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-zinc-800 bg-[#131722]">

        {/* SYMBOL */}
        <div className="flex flex-col">
          <div className="font-bold text-white">{symbol}</div>
          <div className="text-[10px] text-zinc-400">Institutional Desk</div>
        </div>

        {/* PRICE */}
        <div className="text-right">
          <div className="text-base font-semibold">
            â‚¹ {lastPrice.toFixed(2)}
          </div>
          <div className={change >= 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
        </div>

        {/* OHLC */}
        <div className="hidden md:flex gap-4 text-xs text-zinc-300">
          <span>O {ohlc.open.toFixed(2)}</span>
          <span>H {ohlc.high.toFixed(2)}</span>
          <span>L {ohlc.low.toFixed(2)}</span>
          <span>C {ohlc.close.toFixed(2)}</span>
        </div>

      </div>

      {/* CHART AREA */}
      <div className="relative flex-1">
        <div ref={chartRef} className="w-full h-full" />

        {/* STATUS DOT */}
        <div className="absolute left-4 top-4 flex items-center gap-2 bg-[#131722] border border-zinc-700 px-3 py-1 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          ACTIVE
        </div>

      </div>

    </div>

  </div>
);
}

