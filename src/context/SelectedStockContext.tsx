"use client";

import { createContext, useContext, useState } from "react";

const SelectedStockContext = createContext<any>(null);

export function SelectedStockProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [selectedStock, setSelectedStock] =
    useState("KARURVYSYA");

  return (
    <SelectedStockContext.Provider
      value={{
        selectedStock,
        setSelectedStock,
      }}
    >
      {children}
    </SelectedStockContext.Provider>
  );
}

export function useSelectedStock() {
  return useContext(SelectedStockContext);
}