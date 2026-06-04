"use client";

import { useEffect, useState } from "react";

import { getUniverseStocks }
from "@/services/firebaseUniverse";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function SearchBox() {

  const [query, setQuery] =
    useState("");

  const [stocks, setStocks] =
    useState<any[]>([]);

  const [results, setResults] =
    useState<any[]>([]);

  const {
    selectedStock,
    setSelectedStock,
  } = useSelectedStock();

  useEffect(() => {

    async function load() {

      const data =
        await getUniverseStocks();

      setStocks(data);

    }

    load();

  }, []);

  useEffect(() => {

    if (selectedStock) {

      setQuery(selectedStock);

      setResults([]);

    }

  }, [selectedStock]);

  useEffect(() => {

    if (!query) {

      setResults([]);

      return;

    }

    const filtered =
      stocks.filter(
        (stock) =>
          stock.symbol
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );

    setResults(filtered);

  }, [query, stocks]);

  return (

    <div className="relative">

      <input
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
        placeholder="Stock"
        className="
          bg-zinc-900
          border
          border-zinc-700
          rounded-lg
          px-3
          py-1
          h-8
          w-[220px]
          text-sm
          outline-none
        "
      />

      {results.length > 0 &&
        query !== selectedStock && (

        <div
          className="
            absolute
            top-9
            left-0
            w-full
            bg-zinc-900
            border
            border-zinc-700
            rounded-lg
            z-50
            max-h-80
            overflow-y-auto
          "
        >

          {results.map((stock) => (

            <div
              key={stock.id}
              className="
                p-2
                cursor-pointer
                hover:bg-zinc-800
              "
              onClick={() => {

                setSelectedStock(
                  stock.kiteSymbol ||
                  stock.symbol
                );

                setQuery(
                  stock.symbol
                );

                setResults([]);

              }}
            >

              <div className="flex justify-between">

                <span className="text-sm">

                  {stock.symbol}

                </span>

                <span className="text-zinc-500 text-xs">

                  {stock.sector}

                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}