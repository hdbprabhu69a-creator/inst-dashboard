"use client";

import { useEffect, useState } from "react";

import {
  calculatePivot,
} from "@/src/lib/marketStructure";

export function usePivotStructure(
  instrumentToken: number
) {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        setLoading(true);

        const response =
          await fetch(
            `/api/kite/history?token=${instrumentToken}&period=1Y`
          );

        const result =
          await response.json();

        const candles =
          result.candles || [];

        if (
          candles.length < 50
        ) {

          setData([]);
          return;

        }

        // -----------------
        // DAILY
        // PREVIOUS DAY
        // -----------------

        const prevDay =
          candles[
            candles.length - 2
          ];

        const dailyPivot =
          calculatePivot(
            prevDay.high,
            prevDay.low,
            prevDay.close
          );

        // -----------------
        // WEEKLY
        // PREVIOUS COMPLETED WEEK
        // -----------------

        const now =
          new Date();

        const currentWeek =
          now.getDay();

        const weekStart =
          new Date(now);

        weekStart.setDate(
          now.getDate() -
          currentWeek - 6
        );

        const weekEnd =
          new Date(now);

        weekEnd.setDate(
          now.getDate() -
          currentWeek
        );

        const weekCandles =
          candles.filter(
            (c: any) => {

              const d =
                new Date(
                  c.date
                );

              return (
                d >= weekStart &&
                d <= weekEnd
              );

            }
          );

        const weekHigh =
          Math.max(
            ...weekCandles.map(
              (c: any) =>
                c.high
            )
          );

        const weekLow =
          Math.min(
            ...weekCandles.map(
              (c: any) =>
                c.low
            )
          );

        const weekClose =
          weekCandles[
            weekCandles.length - 1
          ]?.close;

        const weeklyPivot =
          calculatePivot(
            weekHigh,
            weekLow,
            weekClose
          );

        // -----------------
        // MONTHLY
        // PREVIOUS MONTH
        // -----------------

        const currentDate =
          new Date();

        let targetMonth =
          currentDate.getMonth() - 1;

        let targetYear =
          currentDate.getFullYear();

        if (
          targetMonth < 0
        ) {

          targetMonth = 11;

          targetYear--;

        }

        const monthCandles =
          candles.filter(
            (c: any) => {

              const d =
                new Date(
                  c.date
                );

              return (

                d.getMonth() ===
                  targetMonth &&

                d.getFullYear() ===
                  targetYear

              );

            }
          );

        const monthHigh =
          Math.max(
            ...monthCandles.map(
              (c: any) =>
                c.high
            )
          );

        const monthLow =
          Math.min(
            ...monthCandles.map(
              (c: any) =>
                c.low
            )
          );

        const monthClose =
          monthCandles[
            monthCandles.length - 1
          ]?.close;

        const monthlyPivot =
          calculatePivot(
            monthHigh,
            monthLow,
            monthClose
          );

        setData([

          {
            timeframe: "D",
            ...dailyPivot,
          },

          {
            timeframe: "W",
            ...weeklyPivot,
          },

          {
            timeframe: "M",
            ...monthlyPivot,
          },

        ]);

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);

      }

    }

    if (
      instrumentToken
    ) {

      load();

    }

  }, [instrumentToken]);

  return {

    data,

    loading,

  };

}