"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

interface Cycle {
  period: string;
  returnPct: number;
  interpretation: string;
  low: number;
  high: number;
}

interface StockTimeCycle {
  symbol: string;
  cycle15: Cycle | null;
  cycle45: Cycle | null;
  cycle63: Cycle | null;
  cycle90: Cycle | null;
  cycle180: Cycle | null;
  cycle252: Cycle | null;
}

interface ApiResponse {
  success: boolean;
  total: number;
  data: StockTimeCycle[];
}

export default function TimeCycleDashboard() {
  const [rows, setRows] = useState<StockTimeCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/institutional-analysis/time-cycle",
        {
          cache: "no-store",
        }
      );

      const json: ApiResponse = await res.json();

      setRows(json.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (
        !row.symbol
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      if (filter === "ALL") return true;

      return (
        row.cycle15?.interpretation === filter ||
        row.cycle45?.interpretation === filter ||
        row.cycle63?.interpretation === filter ||
        row.cycle90?.interpretation === filter ||
        row.cycle180?.interpretation === filter ||
        row.cycle252?.interpretation === filter
      );
    });
  }, [rows, search, filter]);

  if (loading)
    return (
      <div className="p-10 text-center text-lg font-semibold">
        Loading Time Cycle Dashboard...
      </div>
    );

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Time Cycle Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Institutional Multi Time Cycle Analysis
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Download size={18} />
          Export CSV
        </button>

      </div>

      {/* Toolbar */}

      <div className="sticky top-0 z-20 rounded-xl border bg-white p-4 shadow">

        <div className="flex flex-wrap gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search Symbol..."
              className="w-72 rounded-lg border py-2 pl-10 pr-4"
            />

          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="rounded-lg border px-4"
          >
            <option value="ALL">
              All Interpretations
            </option>

            <option value="Primary">
              Primary
            </option>

            <option value="Uptrend">
              Uptrend
            </option>

            <option value="Expansion">
              Expansion
            </option>

            <option value="Consolidation">
              Consolidation
            </option>

            <option value="Accumulation">
              Accumulation
            </option>

            <option value="Distribution">
              Distribution
            </option>

          </select>

          <div className="ml-auto flex items-center font-semibold">

            Stocks :
            <span className="ml-2 rounded bg-blue-100 px-3 py-1">

              {filtered.length}

            </span>

          </div>

        </div>

      </div>

      {/* Cards */}

      <div className="space-y-6">

        {filtered.map((stock) => (
          /* PART 2 STARTS HERE */
          <div
  key={stock.symbol}
  className="overflow-x-auto rounded-xl border bg-white shadow"
>
  <div className="flex items-center justify-between border-b bg-slate-50 px-5 py-3">
    <div>
      <h2 className="text-xl font-bold">
        {stock.symbol}
      </h2>

      <p className="text-sm text-gray-500">
        Institutional Time Cycle Analysis
      </p>
    </div>

    <div className="text-right">
      <div className="text-xs text-gray-500">
        CMP
      </div>

      <div className="text-lg font-bold">
        --
      </div>
    </div>
  </div>

  <table className="min-w-full border-collapse text-sm">

    <thead className="bg-gray-100">

      <tr>

        <th className="border p-3">
          15 Sessions
        </th>

        <th className="border p-3">
          45 Sessions
        </th>

        <th className="border p-3">
          63 Sessions
        </th>

        <th className="border p-3">
          90 Sessions
        </th>

        <th className="border p-3">
          180 Sessions
        </th>

        <th className="border p-3">
          252 Sessions
        </th>

      </tr>

    </thead>

    <tbody>

      <tr>

        {[
          stock.cycle15,
          stock.cycle45,
          stock.cycle63,
          stock.cycle90,
          stock.cycle180,
          stock.cycle252,
        ].map((cycle, i) => (

          <td
            key={i}
            className="border p-4 align-top"
          >

            {!cycle ? (

              <div className="text-center text-gray-400">
                N/A
              </div>

            ) : (

              <div className="space-y-2">

                <div
                  className={`text-xl font-bold ${
                    cycle.returnPct >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {cycle.returnPct >= 0 ? "▲" : "▼"}{" "}
                  {cycle.returnPct.toFixed(2)}%
                </div>

                <div className="rounded bg-blue-50 py-1 text-center font-semibold">
                  {cycle.interpretation}
                </div>

                <div className="text-center text-sm text-gray-600">
                  {cycle.period}
                </div>

                <div className="rounded bg-gray-100 py-1 text-center font-medium">
                  {cycle.low.toFixed(2)}
                  {" - "}
                  {cycle.high.toFixed(2)}
                </div>

              </div>

            )}

          </td>

        ))}

      </tr>

    </tbody>

  </table>

</div>
        ))}

      </div>

    </div>
  );
}
    
