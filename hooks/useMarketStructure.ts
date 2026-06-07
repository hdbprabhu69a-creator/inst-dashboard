"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

import {
  calculateFib,
} from "@/src/lib/marketStructure";

export function useMarketStructure() {

  const {
    marketStructure,
    loading,
  } = useSelectedStock();

  const structure: any[] = [];

  if (
    marketStructure?.weeklySwing
  ) {

    const fib =
      calculateFib(
        marketStructure.weeklySwing.high,
        marketStructure.weeklySwing.low
      );

    structure.push({

      timeframe: "W",

      high:
        marketStructure.weeklySwing.high,

      low:
        marketStructure.weeklySwing.low,

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

    });

  }

  if (
    marketStructure?.monthlySwing
  ) {

    const fib =
      calculateFib(
        marketStructure.monthlySwing.high,
        marketStructure.monthlySwing.low
      );

    structure.push({

      timeframe: "M",

      high:
        marketStructure.monthlySwing.high,

      low:
        marketStructure.monthlySwing.low,

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

    });

  }

  if (
    marketStructure?.dailySwing
  ) {

    const fib =
      calculateFib(
        marketStructure.dailySwing.high,
        marketStructure.dailySwing.low
      );

    structure.push({

      timeframe: "D",

      high:
        marketStructure.dailySwing.high,

      low:
        marketStructure.dailySwing.low,

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

    });

  }

  return {

    structure,

    loading,

    error: "",

  };

}