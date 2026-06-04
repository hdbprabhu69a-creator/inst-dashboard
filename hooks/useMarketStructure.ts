"use client";

import { useEffect, useState } from "react";

import {
  calculateSwing,
  calculateFib,
} from "@/src/lib/marketStructure";

export function useMarketStructure(
  instrumentToken: number
) {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);

        const periods = [
          "1W",
          "2W",
          "1M",
          "3M",
          "6M",
          "1Y",
        ];

        const results =
          await Promise.all(

            periods.map(
              async (period) => {

                const response =
                  await fetch(
                    `/api/kite/history?token=${instrumentToken}&period=${period}`
                  );

                const result =
                  await response.json();

                return {

                  period,

                  candles:
                    result.candles || [],

                };

              }
            )

          );

        setData(results);

        setError("");

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load market structure"
        );

      } finally {

        setLoading(false);

      }

    }

    if (instrumentToken) {

      loadData();

    }

  }, [instrumentToken]);

  const structure =

    data
      .map(
        (item) => {

          const swing =
            calculateSwing(
              item.candles
            );

          if (!swing) {

            return null;

          }

          const fib =
            calculateFib(
              swing.high,
              swing.low
            );

          const lastCandle =
            item.candles[
              item.candles.length - 1
            ];

          const pivot =
            (
              swing.high +
              swing.low +
              (
                lastCandle?.close || 0
              )
            ) / 3;

          return {

            timeframe:
              item.period,

            high:
              swing.high,

            low:
              swing.low,

            pivot,

            fib236:
              fib.fib236,

            fib382:
              fib.fib382,

            fib50:
              fib.fib50,

            fib618:
              fib.fib618,

            fib786:
              fib.fib786,

          };

        }
      )

      .filter(Boolean);

  return {

    data,

    structure,

    loading,

    error,

  };

}