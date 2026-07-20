"use client";

import { useEffect, useState } from "react";
import { fetchPortfolioMarketData } from "@/services/portfolioMarketService";

export function usePortfolioMarketData(
  symbols: string[]
) {
  const [prices, setPrices] =
    useState<Record<string, number>>({});

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (symbols.length === 0) {
      setPrices({});
      return;
    }

    let mounted = true;

    setLoading(true);

    fetchPortfolioMarketData(symbols)
      .then((result) => {
        if (!mounted) return;

        setPrices(result);
        setError("");
      })
      .catch((err) => {
        if (!mounted) return;

        setError(err.message);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [symbols.join(",")]);

  return {
    prices,
    loading,
    error,
  };
}
