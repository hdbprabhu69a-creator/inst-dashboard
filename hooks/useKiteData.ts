"use client";

import { useEffect, useState } from "react";
import { fetchMarketData } from "@/services/marketService";
import { KiteApiResponse } from "@/types/market";

export function useKiteData(symbol: string) {
  const [data, setData] = useState<KiteApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cleanSymbol = symbol?.trim();

    if (
      !cleanSymbol ||
      cleanSymbol === "undefined" ||
      cleanSymbol === "null"
    ) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const result = await fetchMarketData(cleanSymbol);

        if (!mounted) return;

        setData(result);
        setError("");
      } catch (err: any) {
        if (!mounted) return;

        console.error("KITE HOOK ERROR:", err);

        setError(
          err?.message ||
          "Market data unavailable"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [symbol]);

  return {
    data,
    loading,
    error,
  };
}