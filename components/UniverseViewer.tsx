"use client";

import { useEffect, useState } from "react";
import { getUniverseStocks } from "@/services/firebaseUniverse";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function UniverseViewer() {

  const [stocks, setStocks] =
    useState<any[]>([]);

  const {
    selectedStock,
    setSelectedStock,
  } = useSelectedStock();

  useEffect(() => {

    async function loadStocks() {

      const data =
        await getUniverseStocks();

      setStocks(data);

    }

    loadStocks();

  }, []);

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mt-6">

      <h2 className="text-xl font-bold text-cyan-400">
        FIREBASE UNIVERSE
      </h2>

      <p className="text-sm text-zinc-400 mb-4">
        Total Stocks: {stocks.length}
      </p>

      <select
        value={selectedStock}
        onChange={(e) =>
          setSelectedStock(
            e.target.value
          )
        }
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
      >

        <option value="">
          Select Stock
        </option>

        {stocks.map((stock) => (

          <option
            key={stock.id}
            value={
              stock.kiteSymbol ||
              stock.symbol
            }
          >

            {stock.symbol} - {stock.sector}

          </option>

        ))}

      </select>

      <div className="mt-4 text-green-400">

        Selected: {selectedStock}

      </div>

    </div>

  );

}
