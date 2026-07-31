"use client";

import {
  useSelectedMarketStructure,
} from "@/hooks/useSelectedMarketStructure";

export function useMarketStructure() {

  const {
    marketStructure,
    loading,
  } =
    useSelectedMarketStructure();

  return {

    marketStructure,

    loading,

    error: "",

  };

}
