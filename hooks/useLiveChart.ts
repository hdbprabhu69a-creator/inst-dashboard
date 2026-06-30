"use client";

import { useEffect, useRef, useState } from "react";

import { getMarketData } from "@/lib/market/getMarketData";
import { analyzePattern } from "@/lib/pattern/patternEngine";

export function useLiveChart(
  symbol: string,
  timeframe: string
) {
  const [data, setData] = useState<any[]>([]);
  const [pattern, setPattern] = useState<any>(null);

  const historyRef = useRef<any[]>([]);

  useEffect(() => {
    if (!symbol || !timeframe) return;

    async function loadChart() {
      try {

        console.log("==================================");
        console.log("useLiveChart symbol =", symbol);
        console.log("uppercase =", symbol.toUpperCase());

        const instrumentMap: Record<string, number> = {
          SBIN: 779521,
        };

        console.log("instrumentMap =", instrumentMap);

        const instrumentToken =
          instrumentMap[symbol.toUpperCase()];

        console.log(
          "instrumentToken =",
          instrumentToken
        );

        if (!instrumentToken) {

          console.error(
            "Instrument token not found:",
            symbol
          );

          setData([]);
          setPattern(null);

          return;
        }

        const candles =
          await getMarketData(
            instrumentToken,
            timeframe
          );

        console.log("==================================");
        console.log(
          "Candles Loaded:",
          candles.length
        );
        console.log(
          "First Candle:",
          candles[0]
        );
        console.log(
          "Last Candle:",
          candles[candles.length - 1]
        );
        console.log("==================================");

        historyRef.current = candles;

        setData(candles);

        const detected =
          analyzePattern(candles);

        setPattern(detected);

      } catch (err) {

        console.error(
          "Chart Load Error:",
          err
        );

      }
    }

    loadChart();

  }, [
    symbol,
    timeframe,
  ]);

  return {
    data,
    pattern,
  };
}
