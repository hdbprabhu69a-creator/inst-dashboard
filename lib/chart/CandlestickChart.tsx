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

import { subscribe } from "@/lib/live/liveEngine";
import { subscribeOHLC } from "@/lib/live/ohlcEngine";

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
  interval: string;
};

export default function CandlestickChart({
  data,
  symbol,
  interval,
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
      height: 700,

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
      },

      timeScale: {
        rightOffset: 10,
        barSpacing: 6,
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
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    candleSeries.current = candle;
    volumeSeries.current = volume;

    // -----------------------------
    // SAFE DATA LOAD
    // -----------------------------
    const cleaned = (data || [])
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
      .sort((a, b) => a.time - b.time);

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

    chart.timeScale().fitContent();

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
        time: last.time,
        open: last.open,
        high: Math.max(last.high, price),
        low: Math.min(last.low, price),
        close: price,
        volume: last.volume,
      };

      liveCandleRef.current = updated;

      candleSeries.current.update(updated);

      setOhlc({
        time: String(updated.time),
        open: updated.open,
        high: updated.high,
        low: updated.low,
        close: updated.close,
      });
    });

    // -----------------------------
    // OHLC STREAM (DISPLAY ONLY)
    // -----------------------------
    ohlcUnsub.current = subscribeOHLC((v) => {
      if (disposed.current) return;

      setOhlc({
        time: String(v.time),
        open: v.open,
        high: v.high,
        low: v.low,
        close: v.close,
      });
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
    <div className="flex flex-col w-full h-full bg-[#0b0e11]">

      <div className="h-10 flex items-center gap-3 px-4 border-b border-zinc-800 text-sm whitespace-nowrap overflow-x-auto">

        <span className="font-semibold text-white">{symbol}</span>

        <span className="text-zinc-500">Â·</span>

        <span className="text-zinc-400">{interval === "D" ? "1D" : interval === "W" ? "1W" : "1M"}</span>

        <span className="text-zinc-500">Â· NSE</span>

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
          {Intl.NumberFormat("en-IN",{
            notation:"compact",
            maximumFractionDigits:1
          }).format(liveCandleRef.current?.volume ?? 0)}
        </span>

      </div>

      <div ref={chartRef} className="flex-1" />

    </div>
  );
}


