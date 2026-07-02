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
console.log("FIRESTORE HISTORY");
console.log("TOTAL ROWS:", rows.length);
rows.slice(0, 20).forEach((r: any, i: number) => {
});
rows.slice(-20).forEach((r: any, i: number) => {
});
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
