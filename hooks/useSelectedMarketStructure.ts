"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export function useSelectedMarketStructure() {

  const {
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  return {

    marketStructure,

    loading:
      marketStructureLoading,

  };

}