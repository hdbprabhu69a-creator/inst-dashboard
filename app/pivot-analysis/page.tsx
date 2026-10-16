"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { STOCK_UNIVERSE } from "@/lib/universe";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { calculatePivot } from "@/src/lib/marketStructure";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const symbols: string[] = STOCK_UNIVERSE;

function formatPrice(value?: number) {
  if (value == null || !Number.isFinite(value)) {
    return "";
  }

  return Number(value).toFixed(1);
}


function formatVolume(value?: number) {
  if (value == null || !Number.isFinite(value)) return "";
  if (value >= 10000000) return (value / 10000000).toFixed(2) + " Cr";
  if (value >= 100000) return (value / 100000).toFixed(2) + " L";
  return value.toLocaleString("en-IN");
}
export default function PivotAnalysisPage() {
  const [selectedSymbol, setSelectedSymbol] =
    useState("");

  const [sectorFilter, setSectorFilter] =
    useState("ALL");

  const [sectorMap, setSectorMap] =
    useState<Record<string, string>>({});

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [data, setData] =
    useState<Record<string, Candle[]>>({});

  const [loading, setLoading] =
    useState(false);
  const [pivotData, setPivotData] = useState<any>(null);
  const [liveQuote, setLiveQuote] = useState<any>(null);

  const loadedSymbols =
    useRef<Set<string>>(new Set());

  // Load sector information
  useEffect(() => {
    let cancelled = false;

    async function loadSectors() {
      try {
        const res = await fetch(
          "/api/swing-fib/stocks"
        );

        if (!res.ok) return;

        const json = await res.json();

        const sectors: Record<string, string> = {};

        (json.stocks ?? []).forEach(
          (row: any) => {
            if (row.symbol) {
              sectors[
                String(row.symbol).toUpperCase()
              ] = row.sector ?? "";
            }
          }
        );

        if (!cancelled) {
          setSectorMap(sectors);
        }
      } catch (error) {
        console.error(
          "Sector loading failed:",
          error
        );
      }
    }

    loadSectors();

    return () => {
      cancelled = true;
    };
  }, []);

  // Sector dropdown options
  const sectorList = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          Object.values(sectorMap).filter(Boolean)
        )
      ).sort(),
    ],
    [sectorMap]
  );

  // Filter stocks by sector
  const filteredSymbols = useMemo(() => {
    return symbols.filter((symbol) => {
      if (sectorFilter === "ALL") {
        return true;
      }

      return (
        sectorMap[symbol.toUpperCase()] ===
        sectorFilter
      );
    });
  }, [sectorFilter, sectorMap]);

  // Load history only for selected stock
  useEffect(() => {
    if (!selectedSymbol) return;

    if (
      loadedSymbols.current.has(selectedSymbol)
    ) {
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/history?symbol=${encodeURIComponent(
            selectedSymbol
          )}`
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load OHLC history"
          );
        }

        const json = await res.json();

        const candles: Candle[] =
          Array.isArray(json)
            ? json
                .map((c: any) => ({
                  time: String(
                    c.time ?? c.date ?? ""
                  ),

                  open: Number(c.open ?? 0),

                  high: Number(c.high ?? 0),

                  low: Number(c.low ?? 0),

                  close: Number(c.close ?? 0),
                  volume: Number(c.volume ?? c.vol ?? c.volumeTraded ?? 0),
                }))
                .filter((c) => c.time)
                .sort(
                  (a, b) =>
                    b.time.localeCompare(a.time)
                )
            : [];

        if (cancelled) return;

        setData((previous) => ({
          ...previous,
          [selectedSymbol]: candles,
        }));

        loadedSymbols.current.add(
          selectedSymbol
        );
      } catch (error) {
        console.error(
          "OHLC history load failed:",
          error
        );

        if (!cancelled) {
          setData((previous) => ({
            ...previous,
            [selectedSymbol]: [],
          }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedSymbol]);

  // Load existing Daily / Weekly / Monthly Pivot from Firestore
  useEffect(() => {
    if (!selectedSymbol) {
      setPivotData(null);
      return;
    }

    let cancelled = false;

    async function loadPivot() {
      setPivotData(null);

      try {
        const snap = await getDoc(
          doc(db, "marketStructure", selectedSymbol)
        );

        if (!cancelled) {
          setPivotData(
            snap.exists() ? snap.data() : null
          );
        }
      } catch (error) {
        console.error("Pivot loading failed:", error);

        if (!cancelled) {
          setPivotData(null);
        }
      }
    }

    loadPivot();

    return () => {
      cancelled = true;
    };
  }, [selectedSymbol]);
  // Clear stock if it does not belong to selected sector
  useEffect(() => {
    if (
      selectedSymbol &&
      sectorFilter !== "ALL" &&
      sectorMap[
        selectedSymbol.toUpperCase()
      ] !== sectorFilter
    ) {
      setSelectedSymbol("");
    }
  }, [
    sectorFilter,
    selectedSymbol,
    sectorMap,
  ]);


  // Live Kite quote
  useEffect(() => {
    if (!selectedSymbol) {
      setLiveQuote(null);
      return;
    }

    let cancelled = false;

    const loadLiveQuote = async () => {
      try {
        const res = await fetch(
          `/api/kite?symbol=${encodeURIComponent(selectedSymbol)}`,
          { cache: "no-store" }
        );

        const json = await res.json();
        const quote = json.quote?.[`NSE:${selectedSymbol}`];

        if (!cancelled && json.success && quote) {
          setLiveQuote({
            cmp: Number(quote.last_price ?? 0),
            open: Number(quote.ohlc?.open ?? 0),
            high: Number(quote.ohlc?.high ?? 0),
            low: Number(quote.ohlc?.low ?? 0),
            volume: Number(
              quote.volume_traded ?? quote.volume ?? 0
            ),
          });
        }
      } catch (error) {
        console.error("Live quote error:", error);
      }
    };

    loadLiveQuote();
    const timer = setInterval(loadLiveQuote, 15000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [selectedSymbol]);
  // Date filtering
  const rows = useMemo(() => {
    const candles = selectedSymbol
      ? data[selectedSymbol] ?? []
      : [];

    return candles.filter((candle) => {
      const date = candle.time.slice(0, 10);

      if (fromDate && date < fromDate) {
        return false;
      }

      if (toDate && date > toDate) {
        return false;
      }

      return true;
    });
  }, [
    data,
    selectedSymbol,
    fromDate,
    toDate,
  ]);

  // Date-wise pivots using the existing pivot engine
  const pivotRows = useMemo(() => {
    const candles: Candle[] = selectedSymbol
      ? data[selectedSymbol] ?? []
      : [];

    const getWeekStart = (date: string) => {
      const d = new Date(date + "T00:00:00Z");
      const day = d.getUTCDay();
      d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
      return d.toISOString().slice(0, 10);
    };

    const getPivot = (items: Candle[]) => {
      if (!items.length) return null;

      const sorted = [...items].sort(
        (a, b) => a.time.localeCompare(b.time)
      );

      return calculatePivot(
        Math.max(...sorted.map(c => c.high)),
        Math.min(...sorted.map(c => c.low)),
        sorted[sorted.length - 1].close
      );
    };

    return rows.map((row: Candle) => {
      const date = row.time.slice(0, 10);
      const previous = candles.filter(
        c => c.time.slice(0, 10) < date
      );

      const dailyCandle = [...previous].sort(
        (a, b) => b.time.localeCompare(a.time)
      )[0];

      const dailyPivot = calculatePivot(
        row.high,
        row.low,
        row.close
      );

      const weekStart = getWeekStart(date);
      const previousWeeks = previous.filter(
        c => getWeekStart(c.time.slice(0, 10)) < weekStart
      );

      const priorWeek = previousWeeks.length
        ? getWeekStart(
            [...previousWeeks].sort(
              (a, b) => b.time.localeCompare(a.time)
            )[0].time.slice(0, 10)
          )
        : "";

      const weeklyCandles: Candle[] = priorWeek
        ? previousWeeks.filter(
            c => getWeekStart(c.time.slice(0, 10)) === priorWeek
          )
        : [];

      const weeklyPivot = weeklyCandles.length
        ? getPivot(weeklyCandles)
        : null;

      const month = date.slice(0, 7);
      const priorMonths = previous.filter(
        c => c.time.slice(0, 7) < month
      );

      const priorMonth = priorMonths.length
        ? priorMonths.map(c => c.time.slice(0, 7)).sort().at(-1) ?? ""
        : "";

      const monthlyPivot = priorMonth
        ? getPivot(
            priorMonths.filter(
              c => c.time.slice(0, 7) === priorMonth
            )
          )
        : null;

      const currentWeekCandles = candles.filter(
        c => getWeekStart(c.time.slice(0, 10)) === weekStart
      );

      const currentWeekHigh = currentWeekCandles.length
        ? Math.max(...currentWeekCandles.map(c => c.high))
        : null;

      const currentWeekLow = currentWeekCandles.length
        ? Math.min(...currentWeekCandles.map(c => c.low))
        : null;

      return {
        ...row,
        currentWeekHigh,
        currentWeekLow,
        dailyPivot,
        weeklyPivot,
        monthlyPivot,
        weeklyHigh: weeklyCandles.length
          ? Math.max(...weeklyCandles.map(c => c.high))
          : null,
        weeklyLow: weeklyCandles.length
          ? Math.min(...weeklyCandles.map(c => c.low))
          : null,
      };
    });
  }, [rows, data, selectedSymbol]);
  return (
    <div className="px-6 pt-2 pb-4">

      {/* Filters */}

      <div className="mb-3 flex flex-wrap items-center gap-3">

        {/* Sector */}

        <select
          value={sectorFilter}
          onChange={(e) =>
            setSectorFilter(e.target.value)
          }
          className="min-w-[150px] rounded border px-2 py-0.5"
        >
          {sectorList.map((sector) => (
            <option
              key={sector}
              value={sector}
            >
              {sector}
            </option>
          ))}
        </select>

        {/* Stock */}

        <select
          value={selectedSymbol}
          onChange={(e) =>
            setSelectedSymbol(e.target.value)
          }
          className="min-w-[180px] rounded border px-2 py-0.5"
        >
          <option value="">
            Select Stock
          </option>

          {filteredSymbols.map((symbol) => (
            <option
              key={symbol}
              value={symbol}
            >
              {symbol}
            </option>
          ))}
        </select>

        {/* From Date */}

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
          className="rounded border px-2 py-0.5"
        />

        {/* To Date */}

        <input
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(e) =>
            setToDate(e.target.value)
          }
          className="rounded border px-2 py-0.5"
        />

        {/* Live Stock OHLC Summary */}
        {selectedSymbol && (
          <div className="flex flex-wrap items-center gap-3 rounded border bg-slate-900 px-2 py-0.5 text-sm text-white">
            <span className="font-bold text-cyan-400">{selectedSymbol}</span>
            <span>CMP <b className="text-green-400">{formatPrice(liveQuote?.cmp)}</b></span>
            <span>O <b>{formatPrice(liveQuote?.open)}</b></span>
            <span>H <b className="text-green-400">{formatPrice(liveQuote?.high)}</b></span>
            <span>L <b className="text-red-400">{formatPrice(liveQuote?.low)}</b></span>
            <span>VOL <b className="text-yellow-400">{formatVolume(liveQuote?.volume)}</b></span>
          </div>
        )}

        {/* Record count */}

      </div>
      {/* Table */}

      {!selectedSymbol ? (

        <div className="py-16 text-center text-gray-600">
          Select a sector and stock to view
          date-wise OHLC history.
        </div>

      ) : loading ? (

        <div className="py-16 text-center text-gray-600">
          Loading OHLC history...
        </div>

      ) : rows.length === 0 ? (

        <div className="py-16 text-center text-gray-600">
          No OHLC history found for the
          selected stock and date range.
        </div>

      ) : (

        <div className="overflow-auto rounded border">

          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-slate-800 text-white">

                <th className="border px-2 py-0.5 text-left">
                  Date
                </th>

                <th className="border px-2 py-0.5 text-right">
                  Open
                </th>

                <th className="border px-2 py-0.5 text-right">
                  High
                </th>

                <th className="border px-2 py-0.5 text-right">
                  Low
                </th>

                <th className="border px-2 py-0.5 text-right">
                  Close
                </th>
                <th className="border px-2 py-0.5 text-right">F23.6</th>
                <th className="border px-2 py-0.5 text-right">F76.3</th>
                <th className="border px-2 py-0.5 text-right">D PVT</th>
                <th className="border px-2 py-0.5 text-right">D R1</th>
                <th className="border px-2 py-0.5 text-right">D S1</th>
                <th className="border px-2 py-0.5 text-right">W PVT</th>
                <th className="border px-2 py-0.5 text-right">W R1</th>
                <th className="border px-2 py-0.5 text-right">W S1</th>
                <th className="border px-2 py-0.5 text-right">M PVT</th>
                <th className="border px-2 py-0.5 text-right">M R1</th>
                <th className="border px-2 py-0.5 text-right">M S1</th>

              </tr>
            </thead>

            <tbody>
              {pivotRows.map((row) => (

                                <tr
                  key={`${selectedSymbol}_${row.time}`}
                  className={(() => {
                    const index = pivotRows.findIndex((r) => r.time === row.time);
                    const nextRow = pivotRows[index + 1];

                    if (!nextRow) return "[&>td]:!bg-blue-100";

                    const currentDate = new Date(
                      row.time.slice(0, 10) + "T00:00:00Z"
                    );
                    const nextDate = new Date(
                      nextRow.time.slice(0, 10) + "T00:00:00Z"
                    );

                    const getWeekStart = (d: Date) => {
                      const day = d.getUTCDay();
                      const weekStart = new Date(d);
                      weekStart.setUTCDate(
                        d.getUTCDate() - ((day + 6) % 7)
                      );
                      return weekStart.getTime();
                    };

                    return getWeekStart(currentDate) !== getWeekStart(nextDate)
                      ? "[&>td]:!bg-blue-100"
                      : "";
                  })()}
                >
                  <td
                    className="border px-2 py-0.5"
                  >
                    {row.time.slice(0, 10)}
                  </td>

                  <td className="border px-2 py-0.5 text-right">
                    {<span className="text-slate-900">{formatPrice(row.open)}</span>}
                  </td>

                  <td className={`border px-2 py-0.5 text-right ${
                    row.high === row.currentWeekHigh ? "bg-green-100" : ""
                  }`}>
                    {<span className="text-green-600">{formatPrice(row.high)}</span>}
                  </td>

                  <td className={`border px-2 py-0.5 text-right ${
                    row.low === row.currentWeekLow ? "bg-red-100" : ""
                  }`}>
                    {<span className="text-red-600">{formatPrice(row.low)}</span>}
                  </td>

                  <td className="border px-2 py-0.5 text-right">
                    {<span className="text-blue-600">{formatPrice(row.close)}</span>}
                  </td>
                  <td className="border px-2 py-0.5 text-right">
                    {formatPrice(row.weeklyHigh != null && row.weeklyLow != null ? row.weeklyHigh - (row.weeklyHigh - row.weeklyLow) * 0.236 : undefined)}
                  </td>
                  <td className="border px-2 py-0.5 text-right">
                    {formatPrice(row.weeklyHigh != null && row.weeklyLow != null ? row.weeklyHigh - (row.weeklyHigh - row.weeklyLow) * 0.763 : undefined)}
                  </td>
                  <td className="border px-2 py-0.5 text-right bg-blue-50 text-blue-900 font-semibold">{formatPrice(row.dailyPivot?.pivot)}</td>
                  <td className="border px-2 py-0.5 text-right">{formatPrice(row.dailyPivot?.r1)}</td>
                  <td className="border px-2 py-0.5 text-right">{formatPrice(row.dailyPivot?.s1)}</td>
                  <td className="border px-2 py-0.5 text-right bg-green-50 text-green-900 font-semibold">{formatPrice(row.weeklyPivot?.pivot)}</td>
                  <td className="border px-2 py-0.5 text-right">{formatPrice(row.weeklyPivot?.r1)}</td>
                  <td className="border px-2 py-0.5 text-right">{formatPrice(row.weeklyPivot?.s1)}</td>
                  <td className="border px-2 py-0.5 text-right bg-purple-50 text-purple-900 font-semibold">{formatPrice(row.monthlyPivot?.pivot)}</td>
                  <td className="border px-2 py-0.5 text-right">{formatPrice(row.monthlyPivot?.r1)}</td>
                  <td className="border px-2 py-0.5 text-right">{formatPrice(row.monthlyPivot?.s1)}</td>

                </tr>

              ))}
            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}



























