"use client";

import { useEffect, useState } from "react";
import { getHistory } from "@/lib/history/historyService";

export function useHistory(symbol: string) {

  const [candles, setCandles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!symbol) {
      setCandles([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    getHistory(symbol)
      .then((rows) => {

        console.log("======================================");
        console.log("FIRESTORE HISTORY");
        console.log("SYMBOL:", symbol);
        console.log("TOTAL ROWS:", rows.length);

        console.log("FIRST 20 CANDLES");

        rows.slice(0, 20).forEach((r: any, i: number) => {
          console.log(
            i,
            r.time,
            r.open,
            r.high,
            r.low,
            r.close
          );
        });

        console.log("LAST 20 CANDLES");

        rows.slice(-20).forEach((r: any, i: number) => {
          console.log(
            rows.length - 20 + i,
            r.time,
            r.open,
            r.high,
            r.low,
            r.close
          );
        });

        console.log("======================================");

        setCandles(rows);

      })
      .catch((err) => {

        console.error("History Error:", err);

        setCandles([]);

      })
      .finally(() => {

        setLoading(false);

      });

  }, [symbol]);

  return {
    candles,
    loading,
  };
}