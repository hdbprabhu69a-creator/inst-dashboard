"use client";

import { useEffect, useMemo, useState } from "react";

type TF = "D" | "W" | "M";

type Row = {
  symbol?: string;
  date: string;
  high: number | null;
  low: number | null;
  close: number | null;
  rsi: number | null;
  adx: number | null;
  plusDI: number | null;
  minusDI: number | null;
  macd: number | null;
  signal: number | null;
  histogram: number | null;
  cci: number | null;
};

type Stock = {
  symbol: string;
  sector?: string;
};

const fmt = (v: number | null) =>
  v == null || Number.isNaN(v)
    ? ""
    : Number(v).toFixed(2);

const ranges: Record<string, [string, string][]> = {
  RSI: [
    ["40_50", "40–50"],
    ["50_60", "50–60"],
    ["60_70", "60–70"],
    ["70_UP", "ABOVE 70"],
  ],
  ADX: [
    ["20_25", "20–25"],
    ["25_30", "25–30"],
    ["30_35", "30–35"],
    ["35_40", "35–40"],
    ["40_UP", "ABOVE 40"],
  ],
  "+DI": [
    ["20_25", "20–25"],
    ["25_30", "25–30"],
    ["30_35", "30–35"],
    ["35_40", "35–40"],
    ["40_UP", "ABOVE 40"],
  ],
  "-DI": [
    ["20_25", "20–25"],
    ["25_30", "25–30"],
    ["30_35", "30–35"],
    ["35_40", "35–40"],
    ["40_UP", "ABOVE 40"],
  ],
};

function matchRange(v: number | null, r: string) {
  if (v == null || !r) return true;

  const p = r.split("_").map(Number);

  return r.endsWith("_UP")
    ? v >= p[0]
    : v >= p[0] && v < p[1];
}

export default function TechnicalAnalysisPage() {
  const [symbol, setSymbol] = useState("");
  const [sector, setSector] = useState("ALL");
  const [tf, setTf] = useState<TF>("D");

  const [indicator, setIndicator] = useState("ALL");
  const [range, setRange] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [cmp, setCmp] = useState<number | null>(null);

  /* STOCK UNIVERSE */
  useEffect(() => {
    fetch("/api/swing-fib/stocks", {
      cache: "no-store",
    })
      .then(r => r.json())
      .then(j =>
        setStocks(
          Array.isArray(j.stocks)
            ? j.stocks
            : []
        )
      )
      .catch(() => setStocks([]));
  }, []);

  const sectors = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          stocks
            .map(s => s.sector)
            .filter(Boolean) as string[]
        )
      ).sort(),
    ],
    [stocks]
  );

  const sectorStocks = useMemo(
    () =>
      stocks
        .filter(
          s =>
            sector === "ALL" ||
            s.sector === sector
        )
        .map(s => s.symbol)
        .filter(Boolean)
        .sort(),
    [stocks, sector]
  );

  /* LIVE CMP — STOCK MODE ONLY */
  useEffect(() => {
    if (!symbol.trim()) {
      setCmp(null);
      return;
    }

    const s = symbol.trim().toUpperCase();

    async function load() {
      try {
        const r = await fetch(
          `/api/swing-fib/cmp?symbols=${encodeURIComponent(s)}`,
          { cache: "no-store" }
        );

        const j = await r.json();
        const p =
          j?.prices?.[s] ??
          j?.prices?.[`NSE:${s}`];

        setCmp(
          typeof p === "number"
            ? p
            : Number(
                p?.last_price ??
                p?.ltp ??
                0
              )
        );
      } catch {}
    }

    load();

    const id = setInterval(load, 2000);

    return () => clearInterval(id);
  }, [symbol]);

  /* LOAD DATA */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const list = symbol.trim()
          ? [symbol.trim().toUpperCase()]
          : sectorStocks;

        if (!list.length) {
          setRows([]);
          return;
        }

        const result = await Promise.all(
          list.map(async s => {
            try {
              const r = await fetch(
                `/api/technical-analysis?symbol=${encodeURIComponent(s)}&tf=${tf}`,
                { cache: "no-store" }
              );

              const j = await r.json();

              return Array.isArray(j.data)
                ? j.data.map((x: Row) => ({
                    ...x,
                    symbol: s,
                  }))
                : [];
            } catch {
              return [];
            }
          })
        );

        if (!cancelled) {
          setRows(result.flat());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [symbol, sectorStocks, tf]);

  const filtered = useMemo(() => {
    let data = rows.filter(r => {
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;

      if (indicator === "ALL") return true;

      if (indicator === "VALUE_BUY")
        return (
          r.rsi != null && r.rsi >= 40 && r.rsi <= 60 &&
          r.adx != null && r.adx > 25 &&
          r.plusDI != null && r.minusDI != null &&
          r.plusDI > r.minusDI &&
          r.cci != null && r.cci >= -100 && r.cci <= 100 &&
          r.macd != null && r.signal != null &&
          r.macd >= r.signal
        );

      const v =
        indicator === "RSI"
          ? r.rsi
          : indicator === "ADX"
            ? r.adx
            : indicator === "+DI"
              ? r.plusDI
              : r.minusDI;

      return matchRange(v, range);
    });

    /* STOCK MODE = every trading day */
    if (symbol.trim()) {
      return data.sort((a, b) =>
        b.date.localeCompare(a.date)
      );
    }

    /* SECTOR MODE = one row per stock
       for latest date when no range is selected */
    if (!from && !to) {
      const latest: Record<string, Row> = {};

      for (const r of data) {
        if (
          !latest[r.symbol!] ||
          r.date > latest[r.symbol!].date
        ) {
          latest[r.symbol!] = r;
        }
      }

      return Object.values(latest).sort(
        (a, b) =>
          (a.symbol || "").localeCompare(
            b.symbol || ""
          )
      );
    }

    /* SECTOR MODE + DATE RANGE */
    return data.sort(
      (a, b) =>
        (a.symbol || "").localeCompare(
          b.symbol || ""
        ) ||
        b.date.localeCompare(a.date)
    );
  }, [
    rows,
    symbol,
    from,
    to,
    indicator,
    range,
  ]);

  const exportCSV = () => {
    const headers = ["Symbol","Date","High","Low","Close","RSI","ADX","+DI","-DI","MACD","Signal","Histogram","CCI"];
    const lines = filtered.map(r => [
      r.symbol ?? symbol.toUpperCase(), r.date, r.high, r.low, r.close,
      r.rsi, r.adx, r.plusDI, r.minusDI, r.macd, r.signal, r.histogram, r.cci
    ].join(","));

    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${symbol || sector}_${tf}_technical_analysis.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const stockMode = !!symbol.trim();

  return (
    <div className="w-full px-4 pt-3 pb-6">

      {/* FILTER BAR */}
      <div className="mb-3 flex flex-wrap items-center gap-2">

        <input
          list="stocks"
          value={symbol}
          onChange={e =>
            setSymbol(
              e.target.value.toUpperCase()
            )
          }
          placeholder="Search stock..."
          className="h-10 w-48 rounded border-2 border-slate-800 bg-transparent px-3 outline-none"
        />

        <datalist id="stocks">
          {sectorStocks.map(s => (
            <option key={s} value={s} />
          ))}
        </datalist>

        {!stockMode && (
          <select
            value={sector}
            onChange={e =>
              setSector(e.target.value)
            }
            className="h-10 w-40 rounded border-2 border-slate-800 bg-transparent px-3 font-semibold"
          >
            {sectors.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        {stockMode && (
          <div className="font-semibold">
            CMP:
            <span className="ml-2">
              {cmp == null ? "" : fmt(cmp)}
            </span>
          </div>
        )}

        <select
          value={tf}
          onChange={e =>
            setTf(e.target.value as TF)
          }
          className="h-10 w-32 rounded border-2 border-slate-800 bg-transparent px-3 font-semibold"
        >
          <option value="D">DAILY</option>
          <option value="W">WEEKLY</option>
          <option value="M">MONTHLY</option>
        </select>

        <select
          value={indicator}
          onChange={e => {
            setIndicator(e.target.value);
            setRange("");
          }}
          className="h-10 w-36 rounded border-2 border-slate-800 bg-transparent px-3 font-semibold"
        >
          <option value="ALL">INDICATOR</option>
          <option value="RSI">RSI</option>
          <option value="ADX">ADX</option>
          <option value="+DI">+DI</option>
          <option value="-DI">-DI</option>
           <option value="VALUE_BUY">VALUE BUY</option>
        </select>

        {indicator !== "ALL" && (
          <select
            value={range}
            onChange={e =>
              setRange(e.target.value)
            }
            className="h-10 w-36 rounded border-2 border-slate-800 bg-transparent px-3"
          >
            <option value="">RANGE</option>

            {(ranges[indicator] || []).map(
              ([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              )
            )}
          </select>
        )}

        <input
          type="date"
          value={from}
          onChange={e =>
            setFrom(e.target.value)
          }
          className="h-10 w-40 rounded border-2 border-slate-800 bg-transparent px-3"
        />

        <input
          type="date"
          value={to}
          onChange={e =>
            setTo(e.target.value)
          }
          className="h-10 w-40 rounded border-2 border-slate-800 bg-transparent px-3"
        />

        <button
          onClick={exportCSV}
          disabled={!filtered.length}
          className="h-10 rounded border-2 border-slate-800 bg-slate-800 px-4 font-semibold text-white disabled:opacity-40"
        >
          Export CSV
        </button>

        <span className="text-xs text-gray-500">
          {stockMode
            ? `${filtered.length} days`
            : `${filtered.length} stocks`}
        </span>

      </div>

      {/* MODE */}
      <div className="mb-2 text-sm font-semibold">
        {stockMode
          ? `${symbol.toUpperCase()} — DAY WISE`
          : `${sector} — SECTOR WISE`}
      </div>

      <div className="w-full overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-slate-800 text-white">

              {!stockMode && (
                <th className="border px-3 py-2 text-left">
                  Stock
                </th>
              )}

              <th className="border px-3 py-2 text-left">
                Date
              </th>

              {[
                "High",
                "Low",
                "Close",
                "RSI",
                "ADX",
                "+DI",
                "-DI",
                "MACD",
                "Signal",
                "Histogram",
                "CCI",
              ].map(h => (
                <th
                  key={h}
                  className="border px-3 py-2 text-right"
                >
                  {h}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={stockMode ? 12 : 13}
                  className="py-12 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={stockMode ? 12 : 13}
                  className="py-12 text-center"
                >
                  {stockMode
                    ? "No data available"
                    : "Select a sector or stock"}
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr
                  key={`${r.symbol}-${r.date}-${i}`}
                  className="hover:bg-white/20"
                >

                  {!stockMode && (
                    <td className="border px-3 py-2 font-semibold">
                      {r.symbol}
                    </td>
                  )}

                  <td className="border px-3 py-2">
                    {r.date}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.high)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.low)}
                  </td>

                  <td className="border px-3 py-2 text-right font-semibold">
                    {fmt(r.close)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.rsi)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.adx)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.plusDI)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.minusDI)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.macd)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.signal)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.histogram)}
                  </td>

                  <td className="border px-3 py-2 text-right">
                    {fmt(r.cci)}
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}



