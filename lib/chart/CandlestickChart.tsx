
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
import { UIBridge } from "@/lib/data/UIBridge";
import { subscribe, publishTick } from "@/lib//Engine";
import { subscribeOHLC, updateOHLC } from "@/lib//ohlcEngine";
import { getCurrentSymbol } from "@/lib//symbolManager";
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
  Data?: any;
};

export default function CandlestickChart({
  data,
  symbol,
  interval,
  pattern: externalPattern,
  Data,
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
      analyzePattern(
        data
      ),
    [data]
  );
    const lastPrice =
  data.length > 0
    ? data[data.length - 1].close
    : 0;

const previousClose =

  data.length > 1

    ? data[
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

    ? data[
        data.length - 1
      ].volume ?? 0

    : 0;    // =====================================================
// BLOCK 7 -  OHLC
// =====================================================

useEffect(() => {
  console.log("==================================");
  console.log(" DATA", Data);
console.log("QUOTE", Data?.quote?.[`NSE:${symbol}`]);
      console.log("==================================");
}, [Data]);
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
      data[data.length - 1];

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
          new Date(b.time).getTime()) .filter(
        (candle, index, arr) =>
          index === 0 ||
          new Date(candle.time)getTime() !==
          new Date(arr[index - 1].time).getTime());

    candle.setData(chartData);
candleSeries.current =
  candle;
  TickUnsub.current = subscribe((tick:any)=>{
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
    time:last.time,
    open:last.open,
    high:Math.max(last.high,tick.lastPrice),
    low:Math.min(last.low,tick.lastPrice),
    close:tick.lastPrice,
  });
});

ohlcUnsub.current = subscribeOHLC((v)=>{
  setOhlc({
    time:String(v.time),
    open:v.open,
    high:v.high,
    low:v.low,
    close:v.close,
  });
});

const unsubscribe = UIBridge.subscribe((tick: any) => {
  if (!candleSeries.current) return;
  if (!data || data.length === 0) return;

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
  (chart as any)__candleSeries = candle;
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

    volume.priceScale()applyOptions({

        scaleMargins: {

          top: 0.82,

          bottom: 0,

        },

      });

    volume.setData(

      chartData.map(
        c => ({

          time:
            c.time,

          value:
            c.volume ?? 0,

          color:
            c.close >= c.open
              ? "#26a69a66"
              : "#ef535066",

        })
      )

    );

    chart.timeScale()fitContent();
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

    window.addEventListener(
      "resize",
      resize
    );

    chart.subscribeCrosshairMove(
      param => {

        if (
          !param.point ||
          !param.time
        )
          return;

        const price =
          param.seriesData.get(
            candle
          );

        if (!price)
          return;

       setOhlc({

  time:
    String(param.time),

  open:
    (price as any)open,

  high:
    (price as any)high,

  low:
    (price as any)low,

  close:
    (price as any)close,

});
        setCrosshair({
          time: String(param.time),
          open: (price as any)open,
          high: (price as any)high,
          low: (price as any)low,
          close: (price as any)close,
          volume: (price as any)volume ?? 0,
        });
      }
    );

    chart.applyOptions({

      handleScroll: {

        mouseWheel: true,

        pressedMouseMove: true,

        horzTouchDrag: true,

        vertTouchDrag: true,

      },

      handleScale: {

        mouseWheel: true,

        pinch: true,

        axisPressedMouseMove: true,

      },

    });

    return () => {

      window.removeEventListener(
        "resize",
        resize
      );

      TickUnsub.current?.();
      ohlcUnsub.current?.();
      unsubscribe?.();

      chart.remove();

    };

  }, [data]);

useEffect(() => {
  if (!Data) return;

console.log("========== 025 DEBUG ==========");
console.log("Data =", Data);
console.log("quote =", Data?.quote);
console.log("NSE Symbol =", Data?.quote?.["NSE:"+symbol]);
console.log("Plain Symbol =", Data?.quote?.[symbol]);
console.log("==================================");

  const quote =
    Data?.quote?.["NSE:"+symbol] ??
    Data?.quote?.[symbol] ??
    {};

  publishTick({
    symbol,
    token: 779521,
    lastPrice: Number(
  quote.last_price ??
  quote.lastPrice ??
  quote.ltp ??
  data[data.length-1]?.close ??
  0
),
    volume: Number(
  quote.volume ??
  Data?.volume ??
  0
),
    time: Date.now(),
  });

}, [Data, symbol]);
  useEffect(() => {
    const resize = () => {
      if (!chartInstance.current || !chartRef.current) { return }

      chartInstance.current.applyOptions({
        width: chartRef.current.clientWidth,
      })
    }

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, []);
    // =====================================================
  // BLOCK 5 - TRADINGVIEW STYLE CONTAINER
  // =====================================================

  return (

    <div className="relative flex">

  

   

  <div
    className="
      w-10
      bg-[#131722]
      border
      border-zinc-800
      rounded-l-xl
      flex
      flex-col
      items-center
      py-3
      gap-1
      shrink-0
    "
  >

    {[
  {
    icon: "+",
    name: "Crosshair",
  },
  {
    icon: "/",
    name: "Trend Line",
  },
  {
    icon: "-",
    name: "Horizontal",
  },
  {
    icon: ">",
    name: "Ray",
  },
  {
    icon: "[]",
    name: "Rectangle",
  },
  {
    icon: "O",
    name: "Circle",
  },
  {
    icon: "F",
    name: "Fibonacci",
  },
  {
    icon: "T",
    name: "Text",
  },
  {
    icon: "B",
    name: "Brush",
  },
  {
    icon: "M",
    name: "Measure",
  },
  {
    icon: "+",
    name: "Zoom In",
  },
  {
    icon: "-",
    name: "Zoom Out",
  },
].map(tool => (
      <button
       key={tool.name}
        className="
  group
  relative
  w-10
  h-10
          flex
          items-center
          justify-center
          rounded-md
          text-zinc-400
          hover:text-white
          hover:bg-[#2A2E39]
          active:bg-blue-600
          transition-all
          duration-150
          text-lg
        "
      >

      {tool.icon}

<div
  className="
    absolute
    left-12
    hidden
    group-hover:block
    whitespace-nowrap
    rounded-md
    bg-[#1c1f26]
    px-2
    py-1
    text-[10px]
    text-white
    shadow-xl
    z-50
  "
>

  {tool.name}

</div>

</button>
    ))}

  </div>
  <div className="flex-1">

      

<div
  className="
    flex
    items-center
    justify-between
    h-9
    px-5
    bg-[#131722]
    border
    border-zinc-800
    rounded-t-xl
  "
>

  <div className="flex items-center gap-5">

    <div>

      <div className="text-white text-base font-bold">

        {symbol}

      </div>

      <div className="text-xs text-zinc-500">

        NSE • Daily Chart

      </div>

    <div
      className={
        change >= 0
          ? "text-green-400"
          : "text-red-400"
      }
    >

      <div className="text-base font-semibold">

        ₹ {lastPrice.toFixed(2)}

      </div>

      <div className="text-xs">

        {change >= 0 ? "+" : ""}

        {change.toFixed(2)}

        &nbsp;

        ({changePercent.toFixed(2)}%)

      </div>

  <div
    className="
      flex
      items-center
      gap-5
      text-sm
      font-medium
      whitespace-nowrap
    "
  >

    <span className="px-2 py-1 rounded bg-blue-700">

      1D

    </span>

    <span>O {ohlc.open.toFixed(2)}</span>

    <span className="text-green-400">

      H {ohlc.high.toFixed(2)}

    </span>

    <span className="text-red-400">

      L {ohlc.low.toFixed(2)}

    </span>

    <span>

      C {ohlc.close.toFixed(2)}

    </span>

    <span className="text-zinc-500">

      {ohlc.time}

    </span>

  </div>}
{/* BLOCK 12 - PROFESSIONAL CHART AREA */}

</div>}

  <div
    className="
      absolute
      left-5
      top-5
      flex
      items-center
      gap-2
      rounded-full
      bg-[#131722]
      px-3
      py-1
      text-xs
      border
      border-zinc-700
    "
  >

    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

  </div>}
{</div>

  );

}






