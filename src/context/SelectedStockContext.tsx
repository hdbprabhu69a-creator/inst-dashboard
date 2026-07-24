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
} from "@/types/context";

import {
  MarketStructure,
} from "@/types/market";

import {
  DEFAULT_STOCK,
  MARKET_STRUCTURE_COLLECTION,
} from "@/src/lib/constants";

const INDEX_SYMBOLS = new Set([

  "NIFTY",
  "BANKNIFTY",
  "FINNIFTY",
  "MIDCPNIFTY",
  "NIFTYNXT50",

  "AUTO",
  "COMMODITIES",
  "CPSE",
  "ENERGY",
  "FMCG",
  "IT",
  "MEDIA",
  "METAL",
  "MNC",
  "PHARMA",
  "PSUBANK",
  "PVTBANK",
  "REALTY",

]);

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
  ] = useState(() => {

    if (typeof window !== "undefined") {

      return (
        localStorage.getItem(
          "selectedStock"
        ) || DEFAULT_STOCK
      );

    }

    return DEFAULT_STOCK;

  });

  const [
    marketStructure,
    setMarketStructure,
  ] = useState<
    MarketStructure | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    localStorage.setItem(
      "selectedStock",
      selectedStock
    );

  }, [selectedStock]);

  useEffect(() => {

    async function loadMarketStructure() {

      try {

        setLoading(true);

        const collectionName =
          INDEX_SYMBOLS.has(selectedStock)
            ? "indexMarketStructure"
            : MARKET_STRUCTURE_COLLECTION;

        const docRef =
          doc(
            db,
            collectionName,
            selectedStock
          );

        const snapshot =
          await getDoc(docRef);

        console.log("========================");
        console.log("COLLECTION:", collectionName);
        console.log("SYMBOL:", selectedStock);
        console.log("EXISTS:", snapshot.exists());

        if (snapshot.exists()) {

          const data =
            snapshot.data();

          console.log(data);

          setMarketStructure(
            data as MarketStructure
          );

        } else {

          console.log("DOCUMENT NOT FOUND");

          setMarketStructure(null);

        }

        console.log("========================");

      } catch (error) {

        console.error(
          "MARKET STRUCTURE ERROR:",
          error
        );

        setMarketStructure(null);

      } finally {

        setLoading(false);

      }

    }

    if (selectedStock) {

      loadMarketStructure();

    }

  }, [selectedStock]);

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