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

const SelectedStockContext =
  createContext<any>(null);

export function SelectedStockProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [selectedStock, setSelectedStock] =
    useState("KARURVYSYA");

  const [
    marketStructure,
    setMarketStructure,
  ] = useState<any>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    async function loadMarketStructure() {

      try {

        setLoading(true);

        const snapshot =
          await getDoc(
            doc(
              db,
              "marketStructure",
              selectedStock
            )
          );

        if (
          snapshot.exists()
        ) {

          setMarketStructure(
            snapshot.data()
          );

        } else {

          setMarketStructure(
            null
          );

        }

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);

      }

    }

    if (
      selectedStock
    ) {

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

  return useContext(
    SelectedStockContext
  );

}