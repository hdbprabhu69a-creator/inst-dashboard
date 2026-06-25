"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface DeliverySummary {
  dailyVol: number;
  dailyDel: number;
  dailyPct: number;

  weeklyVol: number;
  weeklyDel: number;
  weeklyPct: number;

  monthlyVol: number;
  monthlyDel: number;
  monthlyPct: number;
}

export function useDeliveryHistory(
  symbol: string
) {
  const [data, setData] =
    useState<DeliverySummary | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        setLoading(true);

        const snap =
          await getDocs(
            collection(
              db,
              "delivery_history"
            )
          );

        const rows =
          snap.docs
            .map(d => d.data())
            .filter(
              (x: any) =>
                x.symbol === symbol
            )
            .sort(
              (a: any, b: any) =>
                String(b.date).localeCompare(
                  String(a.date)
                )
            );

        if (!rows.length) {

          setData(null);

          return;
        }

        const latest =
          rows[0];

        const latestDate =
          new Date(latest.date);

        const currentWeek =
          rows.filter(
            (r: any) => {

              const d =
                new Date(r.date);

              const diff =
                (latestDate.getTime() -
                  d.getTime()) /
                86400000;

              return diff >= 0 &&
                     diff < 7;
            }
          );

        const currentMonth =
          rows.filter(
            (r: any) => {

              const d =
                new Date(r.date);

              return (
                d.getMonth() ===
                  latestDate.getMonth() &&
                d.getFullYear() ===
                  latestDate.getFullYear()
              );
            }
          );

        const weeklyVol =
          currentWeek.reduce(
            (s: number, r: any) =>
              s + (r.volume || 0),
            0
          );

        const weeklyDel =
          currentWeek.reduce(
            (s: number, r: any) =>
              s + (r.deliveryQty || 0),
            0
          );

        const monthlyVol =
          currentMonth.reduce(
            (s: number, r: any) =>
              s + (r.volume || 0),
            0
          );

        const monthlyDel =
          currentMonth.reduce(
            (s: number, r: any) =>
              s + (r.deliveryQty || 0),
            0
          );

        setData({

          dailyVol:
            latest.volume || 0,

          dailyDel:
            latest.deliveryQty || 0,

          dailyPct:
            latest.deliveryPct || 0,

          weeklyVol,

          weeklyDel,

          weeklyPct:
            weeklyVol > 0
              ? (
                  weeklyDel /
                  weeklyVol
                ) * 100
              : 0,

          monthlyVol,

          monthlyDel,

          monthlyPct:
            monthlyVol > 0
              ? (
                  monthlyDel /
                  monthlyVol
                ) * 100
              : 0,

        });

      } finally {

        setLoading(false);

      }

    }

    if (symbol) {
      load();
    }

  }, [symbol]);

  return {
    data,
    loading,
  };
}