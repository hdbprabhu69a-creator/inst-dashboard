"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  fetchMarketData,
} from "@/services/marketService";

import {
  KiteApiResponse,
} from "@/types/market";

export function useKiteData(
  symbol: string
) {

  const [
    data,
    setData,
  ] =
    useState<KiteApiResponse | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {

    const cleanSymbol =
      symbol?.trim();

    if (

      !cleanSymbol ||

      cleanSymbol ===
        "undefined" ||

      cleanSymbol ===
        "null"

    ) {

      setLoading(false);

      setError("");

      setData(null);

      return;

    }

    let isMounted =
      true;

    const loadData =
      async () => {

        try {

          const result =
            await fetchMarketData(
              cleanSymbol
            );

          if (
            !isMounted
          ) {

            return;

          }

          setData(
            result
          );

          setError("");

        } catch (
          err: any
        ) {

          if (
            !isMounted
          ) {

            return;

          }

          console.error(
            "KITE HOOK ERROR:",
            err
          );

          setError(

            err?.message ||

            "Market data unavailable"

          );

        }

      };

    //
    // INITIAL LOAD
    //

    setLoading(
      true
    );

    loadData()

      .finally(
        () => {

          if (
            isMounted
          ) {

            setLoading(
              false
            );

          }

        }
      );

    //
    // LIVE REFRESH
    // EVERY 1 SECOND
    //

    const interval =
      setInterval(
        loadData,
        1000
      );

    return () => {

      isMounted =
        false;

      clearInterval(
        interval
      );

    };

  }, [symbol]);

  return {

    data,

    loading,

    error,

  };

}