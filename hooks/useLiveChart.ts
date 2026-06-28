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

  const historyRef =
    useRef<any[]>([]);

  useEffect(() => {
    if (!symbol || !timeframe) return;

    async function loadChart() {
      try {

        /**
         * Temporary mapping.
         * Next build will read this from Firestore automatically.
         */
        const instrumentMap: Record<
          string,
          number
        > = {
          SBIN: 779521,
        };

        const instrumentToken =
          instrumentMap[
            symbol.toUpperCase()
          ];

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

        historyRef.current =
          candles;

        setData(candles);

        const detected =
          analyzePattern(
            candles
          );

        setPattern(
          detected
        );

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