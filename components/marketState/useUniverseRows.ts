import { useEffect, useState } from "react";
import { getUniverseStocks } from "@/services/firebaseUniverse";

export function useUniverseRows() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const stocks = await getUniverseStocks();

      setRows(
        stocks.map((s: any) => ({
          symbol: s.symbol ?? "-",
          sector: s.sector ?? "-",
          state: "Pending",
          score: s.score ?? "-",
          confidence: "-",
          strength: "-",
          days: "-",
          previous: "-",
          next: "-",
          trend: "-",
        }))
      );
    })();
  }, []);

  return rows;
}

