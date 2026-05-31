"use client";

import { useEffect, useState } from "react";
import { fetchMarketData } from "@/services/marketService";
import { MarketData } from "@/types/market";

export function useKiteData(
  symbol: string
) {

  const [data, setData] =
    useState<MarketData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadData = async () => {

    try {

      const result =
        await fetchMarketData(symbol);

      setData(result);

      setError("");

    } catch (err) {

      setError(
        "Market data unavailable"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (!symbol) return;

    loadData();

    const interval =
      setInterval(() => {

        loadData();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [symbol]);

  return {

    data,
    loading,
    error,

  };

}