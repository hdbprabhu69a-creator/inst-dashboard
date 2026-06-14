"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  SelectedStockContextType,
} from "@/src/types/context";

import {
  MarketStructure,
} from "@/types/market";

import {
  DEFAULT_STOCK,
  MARKET_STRUCTURE_COLLECTION,
} from "@/src/lib/constants";

const SelectedStockContext =
  createContext<
    SelectedStockContextType | null
  >(null);

export function SelectedStockProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    selectedStock,
    setSelectedStock,
  ] = useState(
    DEFAULT_STOCK
  );

  const [
    marketStructure,
    setMarketStructure,
  ] = useState<
    MarketStructure | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  useEffect(() => {

    async function loadMarketStructure() {

      try {

        setLoading(true);

        const docRef =
          doc(
            db,
            MARKET_STRUCTURE_COLLECTION,
            selectedStock
          );

        const snapshot =
          await getDoc(
            docRef
          );

        if (
          snapshot.exists()
        ) {

          const data =
            snapshot.data();

          console.log(
            "================================="
          );

          console.log(
            "SELECTED STOCK:",
            selectedStock
          );

          console.log(
            "MONTHLY OHLC:",
            data.monthlyOHLC
          );

          console.log(
            "MONTHLY PIVOT:",
            data.monthlyPivot
          );

          console.log(
            "MONTHLY CPR:",
            data.monthlyCPR
          );

          console.log(
            "================================="
          );

          setMarketStructure(
            data as MarketStructure
          );

        } else {

          setMarketStructure(
            null
          );

        }

      } catch (
        error
      ) {

        console.error(
          "MARKET STRUCTURE ERROR:",
          error
        );

        setMarketStructure(
          null
        );

      } finally {

        setLoading(
          false
        );

      }

    }

    if (
      selectedStock
    ) {

      loadMarketStructure();

    }

  }, [
    selectedStock,
  ]);

  return (

    <SelectedStockContext.Provider

      value={{

        selectedStock,

        setSelectedStock,

        marketStructure,

        marketStructureLoading:
          loading,

      }}

    >

      {children}

    </SelectedStockContext.Provider>

  );

}

export function useSelectedStock() {

  const context =
    useContext(
      SelectedStockContext
    );

  if (!context) {

    throw new Error(
      "useSelectedStock must be used inside SelectedStockProvider"
    );

  }

  return context;

}