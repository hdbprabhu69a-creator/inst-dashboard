"use client";

import { useMemo, useState } from "react";
import { useUniverse } from "@/hooks/useUniverse";

export default function StockSearch() {
  const { stocks, loading } = useUniverse();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return stocks.filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      (s.name ?? "").toLowerCase().includes(q)
    ).slice(0,20);
  }, [stocks, query]);

  return (
    <div className="w-full max-w-md">
      <input
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        placeholder="Search symbol or company..."
        className="w-full rounded border px-3 py-2"
      />
      {!loading && (
        <div className="mt-2 max-h-72 overflow-auto rounded border">
          {filtered.map(s=>(
            <div key={s.symbol} className="px-3 py-2 border-b">
              <div className="font-semibold">{s.symbol}</div>
              <div className="text-sm">{s.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
