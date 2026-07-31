"use client";

import { useEffect, useState } from "react";
import { getHistoryData } from "@/services/firebaseHistory";

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

    getHistoryData(symbol)
      .then((rows) => {
console.log("FIRESTORE HISTORY");
console.log("TOTAL ROWS:", rows.length);
rows.slice(0, 20).forEach((r: any, i: number) => {
});
rows.slice(-20).forEach((r: any, i: number) => {
});
const chartData = rows.map((r:any)=>({ time:r.date, open:Number(r.open), high:Number(r.high), low:Number(r.low), close:Number(r.close), volume:Number(r.volume ?? 0) })); setCandles(chartData);

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


