"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { STOCK_UNIVERSE } from "@/lib/universe";

const symbols: string[] =
  STOCK_UNIVERSE;

interface Candle {
  time: string;
  
  high: number;
  low: number;
  volume: number;
  close: number;
  deliveryQty?: number;
  state?: string;
  id?: string;
}

function formatVolume(value: number) {
  if (value >= 1000000000)
    return (
      value / 1000000000
    ).toFixed(2) + "B";

  if (value >= 1000000)
    return (
      value / 1000000
    ).toFixed(2) + "M";

  if (value >= 1000)
    return (
      value / 1000
    ).toFixed(1) + "K";

  return value.toString();
}

function formatDelivery(value?: number) {
  if (
    value == null ||
    isNaN(value)
  ) {
    return "";
  }

  if (value >= 1000000000)
    return (
      value / 1000000000
    ).toFixed(2) + "B";

  if (value >= 1000000)
    return (
      value / 1000000
    ).toFixed(2) + "M";

  if (value >= 1000)
    return (
      value / 1000
    ).toFixed(1) + "K";

  return value.toFixed(0);
}

function formatDeliveryPercent(
  deliveryQty?: number,
  volume?: number
) {
  if (
    deliveryQty == null ||
    volume == null ||
    volume <= 0 ||
    isNaN(deliveryQty) ||
    isNaN(volume)
  ) {
    return "0.00%";
  }

  return (
    (deliveryQty / volume) *
    100
  ).toFixed(2) + "%";
}

function formatClose(value?: number) {
  if (
    value == null ||
    isNaN(value)
  ) {
    return "";
  }

  return Number(value).toFixed(2);
}

export default function VolumeDeliveryPage() {

  const [data, setData] =
    useState<Record<string, Candle[]>>({});

  const [search, setSearch] =
    useState("");

  const [sectorFilter, setSectorFilter] =
    useState("ALL");

  const [sectorMap, setSectorMap] =
    useState<Record<string, string>>({});

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  
  const [savedState, setSavedState] =
    useState<Record<string, boolean>>({});const loadedSymbols =
    useRef<Set<string>>(new Set());

  /*
   * Load sector information only once.
   *
   * IMPORTANT:
   * No stock history is loaded here.
   */
  useEffect(() => {

    let cancelled = false;

    async function loadSectors() {

      try {

        const res =
          await fetch(
            "/api/swing-fib/stocks"
          );

        if (!res.ok) {
          return;
        }

        const json =
          await res.json();

        const sectors:
          Record<string, string> = {};

        (
          json.stocks ?? []
        ).forEach((row: any) => {

          sectors[row.symbol] =
            row.sector ?? "";

        });

        if (!cancelled) {
          setSectorMap(sectors);
        }

      } catch {
        // Sector information is optional.
      }

    }

    loadSectors();

    return () => {
      cancelled = true;
    };

  }, []);

  /*
   * LOAD ONLY THE SEARCHED STOCK.
   *
   * No STOCK_UNIVERSE.map().
   * No loading all stock histories.
   */
  useEffect(() => {

    const symbol =
      search
        .trim()
        .toUpperCase();

    if (!symbol) {
      setLoading(false);
      return;
    }

    const matchedSymbol =
  symbols.find(
    (s) =>
      s.toUpperCase() ===
      symbol
  ) ?? "";

if (!matchedSymbol) {
  setLoading(false);
  return;
}
    /*
     * Already loaded:
     * do not make another Firestore/API request.
     */
    if (
      loadedSymbols.current.has(
        matchedSymbol
      )
    ) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSymbol() {

      setLoading(true);

      try {

        /*
         * Only TWO requests:
         *
         * 1. selected stock OHLC/volume history
         * 2. selected stock delivery history
         *
         * They run in parallel.
         */
        const [
          historyRes,
          deliveryRes,
        ] = await Promise.all([
          fetch(
            `/api/history?symbol=${encodeURIComponent(
              matchedSymbol
            )}`
          ),

          fetch(
            `/api/delivery-history?symbol=${encodeURIComponent(
              matchedSymbol
            )}`
          ),
        ]);

        if (
          !historyRes.ok ||
          !deliveryRes.ok
        ) {
          throw new Error(
            "Failed to load stock history"
          );
        }

        const historyJson =
          await historyRes.json();

        const deliveryJson =
          await deliveryRes.json();

        const deliveryMap =
          new Map<
            string,
            {
              id: string;
              deliveryQty: number;
              state: string;
            }
          >();

        for (
          const row of
            deliveryJson.data ?? []
        ) {

          deliveryMap.set(
            String(row.date),
            {
              id: String(
                row.id ?? ""
              ),

              deliveryQty:
                Number(
                  row.deliveryQty ?? 0
                ),

              state:
                String(
                  row.state ?? ""
                ),
            }
          );

        }

        const candles: Candle[] =
          Array.isArray(historyJson)
            ? historyJson
                .map((c: any) => {

                  const time =
                    String(
                      c.time ??
                      c.date ??
                      ""
                    );

                  return {
                    time,

                  high:
                    Number(
                      c.high ?? 0
                    ),

                  low:
                    Number(
                      c.low ?? 0
                    ),

                 

                    volume:
                      Number(
                        c.volume ?? 0
                      ),

                    close:
                      Number(
                        c.close ?? 0
                      ),

                    deliveryQty:
                      deliveryMap.get(
                        time
                      )?.deliveryQty ?? 0,

                    state:
                      deliveryMap.get(
                        time
                      )?.state ?? "",

                    id:
                      deliveryMap.get(
                        time
                      )?.id,
                  };

                })
                .filter(
                  (c) => !!c.time
                )
                .sort(
                  (
                    a,
                    b
                  ) =>
                    b.time.localeCompare(
                      a.time
                    )
                )
            : [];

        if (cancelled) {
          return;
        }

        setData(
          (previous) => ({
            ...previous,
            [matchedSymbol]:
              candles,
          })
        );

        loadedSymbols.current.add(
          matchedSymbol
        );

      } catch {

        if (!cancelled) {

          setData(
            (previous) => ({
              ...previous,
              [matchedSymbol]: [],
            })
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }

    /*
     * Small debounce so typing
     * "SBIN" does not generate
     * four requests.
     */
    const timer =
      setTimeout(
        loadSymbol,
        400
      );

    return () => {

      cancelled = true;

      clearTimeout(timer);

    };

  }, [search]);

  const sectorList =
    useMemo(
      () => [
        "ALL",

        ...Array.from(
          new Set(
            Object.values(
              sectorMap
            ).filter(Boolean)
          )
        ).sort(),
      ],
      [sectorMap]
    );

  const selectedSymbol =
    search
      .trim()
      .toUpperCase();

  const selectedStocks =
    useMemo(() => {

      if (!selectedSymbol) {
        return [];
      }

      const matched =
        symbols.find(
          (symbol) =>
            symbol.toUpperCase() ===
            selectedSymbol
        );

      if (!matched) {
        return [];
      }

      if (
        sectorFilter !== "ALL" &&
        sectorMap[matched] !==
          sectorFilter
      ) {
        return [];
      }

      return [matched];

    }, [
      selectedSymbol,
      sectorFilter,
      sectorMap,
    ]);

  /*
   * Date filtering is completely
   * client-side.
   *
   * Changing dates = ZERO requests.
   */
  const rows = useMemo(() => {

    const result: {
      symbol: string;
      time: string;
       high: number;
  low: number;
      volume: number;
      deliveryQty: number;
      close: number;
      state: string;
      id?: string;
    }[] = [];

    for (
      const symbol of
        selectedStocks
    ) {

      const candles =
        data[symbol] ?? [];

      candles
        .filter((c) => {

          if (
            fromDate &&
            c.time < fromDate
          ) {
            return false;
          }

          if (
            toDate &&
            c.time > toDate
          ) {
            return false;
          }

          return true;

        })
        .forEach((c) => {

          result.push({

            symbol,

            time: c.time,

                  high:
                    Number(
                      c.high ?? 0
                    ),

                  low:
                    Number(
                      c.low ?? 0
                    ),

                  

            volume:
              Number(
                c.volume ?? 0
              ),

            deliveryQty:
              Number(
                c.deliveryQty ?? 0
              ),

            close:
              Number(
                c.close ?? 0
              ),

            state:
              c.state ?? "",

            id:
              c.id,

          });

        });

    }

    return result.sort(
      (a, b) =>
        b.time.localeCompare(
          a.time
        )
    );

  }, [
    selectedStocks,
    data,
    fromDate,
    toDate,
  ]);

  return (

    <div className="px-6 pt-2 pb-4">

      <div className="mb-2 flex items-center gap-3">

        <input
          className="border rounded px-3 py-1 w-72"
          placeholder="Search Stock..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {selectedSymbol && (
          <div className="font-bold text-lg text-cyan-700 min-w-[90px]">
            {selectedSymbol}
          </div>
        )}

        <select
          value={sectorFilter}
          onChange={(e) =>
            setSectorFilter(
              e.target.value
            )
          }
          className="border rounded px-3 py-1"
        >

          {sectorList.map(
            (sector) => (

              <option
                key={sector}
                value={sector}
              >
                {sector}
              </option>

            )
          )}

        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(
              e.target.value
            )
          }
          className="border rounded px-3 py-1"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(
              e.target.value
            )
          }
          className="border rounded px-3 py-1"
        />

        <div className="ml-auto text-sm text-gray-600">

          Showing{" "}
          {selectedStocks.length}
          {" / "}
          {symbols.length}

        </div>

      </div>

      {loading ? (

        <div className="text-center py-20">
          Loading...
        </div>

      ) : !search.trim() ? (

        <div className="text-center py-20 text-gray-600">
          Search a stock to view
          Volume & Delivery history.
        </div>

      ) : rows.length === 0 ? (

        <div className="text-center py-20 text-red-600">
          No history data found.
        </div>

      ) : (

        <div className="overflow-auto border rounded">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-slate-800 text-white">

                <th className="border px-2 py-[2px] text-left">
                  Date
                </th>

                <th className="border px-2 py-[2px] text-right">
                  Volume
                </th>

                <th className="border px-2 py-[2px] text-right">
                  Delivery Qty
                </th>

                <th className="border px-2 py-[2px] text-right">
                  Delivery %
                </th>
<th className="border px-2 py-[2px] text-right">
  High
</th>

<th className="border px-2 py-[2px] text-right">
  Low
</th>

                <th className="border px-2 py-[2px] text-right">
                  Close
                </th>

                <th className="border px-2 py-[2px] text-left">
                  State
                </th>

              </tr>

            </thead>

            <tbody>

              {rows.map(
                (row) => (

                  <tr
                    key={`${row.symbol}_${row.time}`}
                  >

                    <td className="border px-2 py-[2px]">
                      {row.time}
                    </td>

                    <td className="border px-2 py-[2px] text-right">
                      {formatVolume(
                        row.volume
                      )}
                    </td>

                    <td className="border px-2 py-[2px] text-right">
                      {formatDelivery(
                        row.deliveryQty
                      )}
                    </td>

                    <td className="border px-2 py-[2px] text-right">
                      {formatDeliveryPercent(
                        row.deliveryQty,
                        row.volume
                      )}
                    </td>
<td className="border px-2 py-[2px] text-right">
  {formatClose(
    row.high
  )}
</td>

<td className="border px-2 py-[2px] text-right">
  {formatClose(
    row.low
  )}
</td>
                    <td className="border px-2 py-[2px] text-right">
                      {formatClose(
                        row.close
                      )}
                    </td>

                    <td className="border px-1 py-0.5">
                      <select
                        value={row.state}
                        disabled={!row.id}
                        onChange={async (e) => {

                          const state =
                            e.target.value;

                          

                            setSavedState(
                              (previous) => ({
                                ...previous,
[row.time]: false,
                              })
                            );try {

                            const res =
                              await fetch(
                                "/api/delivery-history",
                                {
                                  method: "PUT",

                                  headers: {
                                    "Content-Type":
                                      "application/json",
                                  },

                                  body:
                                    JSON.stringify({
                                      id:
                                        row.id,

                                      symbol:
                                        row.symbol,

                                      state,
                                    }),
                                }
                              );

                            const result =
                              await res.json();

                            if (!result.success) {
                              throw new Error(
                                result.error ??
                                "Failed to save state"
                              );
                            }

                            

                            setSavedState(
                              (previous) => ({
                                ...previous,
[row.time]: true,
                              })
                            );
setData(
                              (previous) => {

                                const current =
                                  previous[
                                    row.symbol
                                  ] ?? [];

                                return {
                                  ...previous,

                                  [row.symbol]:
                                    current.map(
                                      (c) =>
                                        c.time ===
                                        row.time
                                          ? {
                                              ...c,
                                              state,
                                            }
                                          : c
                                    ),
                                };

                              }
                            );

                          } catch (error) {

                            console.error(
                              "State update failed:",
                              error
                            );

                          }

                        }}
                        className="border rounded px-1 py-0.5 text-sm"
                      >

                        <option value="">
                          Select
                        </option>

                        <option value="Accumulation">
                          Accumulation
                        </option>

                        <option value="Markup">
                          Markup
                        </option>

                        <option value="Expansion">
                          Expansion
                        </option>

                        <option value="Distribution">
                          Distribution
                        </option>

                        <option value="Markdown">
                          Markdown
                        </option>

                        <option value="Reaccumulation">
                          Reaccumulation
                        </option>

                      </select>
{savedState[row.time] && (
                        <span className="ml-2 text-xs font-semibold text-green-600">
                          Saved
                        </span>
                      )}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}









