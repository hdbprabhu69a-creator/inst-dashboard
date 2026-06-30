"use client";

import { useMemo, useState } from "react";
import { useUniverse } from "@/hooks/useUniverse";

type Props = {
  value: string;
  onChange: (symbol: string) => void;
};

export default function StockSearch({ value, onChange }: Props) {
  const { stocks, loading } = useUniverse();
  const [query, setQuery] = useState(value);

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
            <button
              type="button"
              key={s.symbol}
              onClick={()=>{
                setQuery(s.symbol);
                onChange(s.symbol);
              }}
              className="block w-full text-left px-3 py-2 border-b hover:bg-zinc-800"
            >
              <div className="font-semibold">{s.symbol}</div>
              <div className="text-sm">{s.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
