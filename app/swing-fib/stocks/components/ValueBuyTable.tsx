"use client";

import { useEffect, useMemo, useState } from "react";
import { Stock } from "./types";

export interface ValueBuyEntry {
  symbol: string;
  valueBuyPrice: number;
  addDate: string;
}

interface Props {
  stocks: Stock[];
  entries: ValueBuyEntry[];
  setEntries: React.Dispatch<
    React.SetStateAction<ValueBuyEntry[]>
  >;
  num: (v: any) => string;
  selectedSymbols: string[];

  setSelectedSymbols: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

export default function ValueBuyTable({
  stocks,
  entries,
  setEntries,
  num,
  selectedSymbols,
  setSelectedSymbols,
}: Props) {

  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");

  const availableStocks = useMemo(() => {
    return stocks
      .filter(
        stock =>
          stock.symbol &&
          !entries.some(
            entry =>
              entry.symbol === stock.symbol
          )
      )
      .sort((a, b) =>
        a.symbol.localeCompare(b.symbol)
      );
  }, [stocks, entries]);

  function addValueBuy() {

    const cleanSymbol =
      symbol.trim().toUpperCase();

    const value =
      Number(price);

    if (!cleanSymbol) {
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    const exists =
      entries.some(
        entry =>
          entry.symbol === cleanSymbol
      );

    if (exists) {
      return;
    }

    const newEntry: ValueBuyEntry = {
      symbol: cleanSymbol,
      valueBuyPrice: value,
      addDate:
        new Date().toISOString(),
    };

    setEntries(
      current => [
        ...current,
        newEntry,
      ]
    );

    setSymbol("");
    setPrice("");
  }

  function updatePrice(
    entrySymbol: string,
    value: string
  ) {

    const newPrice =
      Number(value);

    if (
      !Number.isFinite(newPrice) ||
      newPrice <= 0
    ) {
      return;
    }

    setEntries(
      current =>
        current.map(entry =>
          entry.symbol === entrySymbol
            ? {
                ...entry,
                valueBuyPrice:
                  newPrice,
              }
            : entry
        )
    );
  }

  function deleteEntry(
    entrySymbol: string
  ) {

    setEntries(
      current =>
        current.filter(
          entry =>
            entry.symbol !==
            entrySymbol
        )
    );
  }

  function formatDate(
    value: string
  ) {

    if (!value) {
      return "-";
    }

    return new Date(value)
      .toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      );
  }

  function getCmp(
    entrySymbol: string
  ) {

    const stock =
      stocks.find(
        item =>
          item.symbol ===
          entrySymbol
      );

    if (!stock) {
      return "-";
    }

    return num(
      (stock as any).liveCmp ??
      (stock as any).cmp
    );
  }

  return (
    <div className="w-full">

      <div className="mb-2 flex items-center gap-2">

        <select
          value={symbol}
          onChange={e =>
            setSymbol(e.target.value)
          }
          className="
            rounded
            border
            border-zinc-700
            bg-black
            px-3
            py-2
            text-cyan-300
            outline-none
          "
        >

          <option value="">
            Select Symbol
          </option>

          {availableStocks.map(
            stock => (
              <option
                key={stock.symbol}
                value={stock.symbol}
              >
                {stock.symbol}
              </option>
            )
          )}

        </select>

        <input
          type="number"
          step="0.01"
          value={price}
          onChange={e =>
            setPrice(e.target.value)
          }
          onKeyDown={e => {
            if (e.key === "Enter") {
              addValueBuy();
            }
          }}
          placeholder="Value Buy Price"
          className="
            w-44
            rounded
            border
            border-zinc-700
            bg-black
            px-3
            py-2
            text-yellow-300
            outline-none
            placeholder:text-zinc-600
          "
        />

        <button
          onClick={addValueBuy}
          className="
            rounded
            border
            border-lime-700
            bg-lime-950
            px-4
            py-2
            font-semibold
            text-lime-300
            hover:bg-lime-900
          "
        >
          Add Value Buy
        </button>

      </div>

      <div className="
        overflow-x-auto
        rounded
        border
        border-zinc-800
      ">

        <table className="w-full text-xs">

          <thead>

            <tr className="
              border-b
              border-zinc-800
              bg-zinc-950
              text-zinc-500
            ">
          <th className="px-2 py-2 text-center">
            <input
              type="checkbox"
              checked={
                entries.length > 0 &&
                entries.every(entry =>
                  selectedSymbols.includes(
                    entry.symbol
                  )
                )
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSymbols(
                    entries.map(
                      entry => entry.symbol
                    )
                  );
                } else {
                  setSelectedSymbols([]);
                }
              }}
            />
          </th>

              <th className="px-2 py-2 text-left">
                SYM
              </th>

              <th className="px-2 py-2 text-right">
                CMP
              </th>

              <th className="px-2 py-2 text-right">
                VALUE BUY PRICE
              </th>

              <th className="px-2 py-2 text-right">
                ADD DATE
              </th>

              <th className="px-2 py-2 text-center">
                DELETE
              </th>

            </tr>

          </thead>

          <tbody>

            {entries.length === 0 ? (<tr>
                <td
                  colSpan={5}
                  className="
                    px-2
                    py-4
                    text-center
                    text-zinc-600
                  "
                >
                  No Value Buy entries
                </td>
              </tr>

            ) : (

              entries.map(
                (entry, index) => (

                  <tr
                    key={entry.symbol}
                    className={
                      index % 2 === 0
                        ? "bg-black"
                        : "bg-zinc-950"
                    }
                  >
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedSymbols.includes(entry.symbol)}
                          onChange={(e) => {
                            setSelectedSymbols(current => {
                              if (e.target.checked) {
                                return current.includes(entry.symbol)
                                  ? current
                                  : [...current, entry.symbol];
                              }
                              return current.filter(symbol => symbol !== entry.symbol);
                            });
                          }}
                        />
                      </td>

                    <td className="
                      border
                      border-zinc-800
                      px-2
                      py-2
                      font-bold
                      text-cyan-300
                    ">
                      {entry.symbol}
                    </td>

                    <td className="
                      border
                      border-zinc-800
                      px-2
                      py-2
                      text-right
                      font-bold
                      text-lime-300
                    ">
                      {getCmp(entry.symbol)}
                    </td>

                    <td className="
                      border
                      border-zinc-800
                      px-2
                      py-1
                      text-right
                    ">

                      <input
                        type="number"
                        step="0.01"
                        value={
                          entry.valueBuyPrice
                        }
                        onChange={e =>
                          updatePrice(
                            entry.symbol,
                            e.target.value
                          )
                        }
                        className="
                          w-28
                          rounded
                          border
                          border-zinc-700
                          bg-black
                          px-2
                          py-1
                          text-right
                          text-yellow-300
                          outline-none
                        "
                      />

                    </td>

                    <td className="
                      border
                      border-zinc-800
                      px-2
                      py-2
                      text-right
                      text-zinc-400
                    ">
                      {formatDate(
                        entry.addDate
                      )}
                    </td>

                    <td className="
                      border
                      border-zinc-800
                      px-2
                      py-2
                      text-center
                    ">

                      <button
                        onClick={() =>
                          deleteEntry(
                            entry.symbol
                          )
                        }
                        className="
                          rounded
                          border
                          border-red-800
                          bg-red-950
                          px-3
                          py-1
                          text-red-300
                          hover:bg-red-900
                        "
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}




