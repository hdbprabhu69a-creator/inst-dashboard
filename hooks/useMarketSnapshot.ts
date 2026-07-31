"use client";

import { useKiteData } from "@/hooks/useKiteData";

import {
  buildMarketStructure,
} from "@/src/lib/marketStructureBuilder";

export function useMarketSnapshot(
  symbol: string
) {

  const {
    data,
    loading,
    error,
  } = useKiteData(symbol);

  const structure =
    buildMarketStructure(
      data
    );

  return {

    structure,

    loading,

    error,

  };

}
