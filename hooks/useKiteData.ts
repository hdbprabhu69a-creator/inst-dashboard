"use client";

import { useEffect, useState } from "react";
import { fetchMarketData } from "@/services/marketService";
import { MarketData } from "@/types/market";

export function useKiteData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const result = await fetchMarketData();
      setData(result);
      setError("");
    } catch (err) {
      setError("Market data unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
  };
}