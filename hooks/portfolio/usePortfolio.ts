"use client";

import { useEffect, useState } from "react";

export function usePortfolio() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, holdingsRes, tradesRes] = await Promise.all([
          fetch("/api/portfolio/summary"),
          fetch("/api/portfolio/holdings"),
          fetch("/api/portfolio/trades"),
        ]);

        const summary = await summaryRes.json();
        const holdings = await holdingsRes.json();
const trades = await tradesRes.json();

        setData({
          ...summary.data,
          holdings: holdings.data,
          trades: trades.data,
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading, error };
}


