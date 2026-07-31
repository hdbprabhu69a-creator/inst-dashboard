"use client";

import { useMemo, useState } from "react";
import { useUniverse } from "@/hooks/useUniverse";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (symbol: string) => void;
};

export default function StockSearchPopup({
  open,
  onClose,
  onSelect,
}: Props) {
  const { stocks } = useUniverse();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return stocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          (s.name ?? "").toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [stocks, query]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="absolute top-7 left-0 w-[190px] bg-[#131722] border border-zinc-700 rounded shadow-lg z-50">
        <div className="p-1.5 border-b border-zinc-700">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded bg-[#0b0e11] border border-zinc-700 px-1.5 py-1 text-sm outline-none text-white"
          />
        </div>

        <div className="max-h-[220px] overflow-y-auto overflow-x-hidden">
          {filtered.map((s) => (
            <div
              key={s.symbol}
              onClick={() => {
                onSelect(s.symbol);
                onClose();
              }}
              className="cursor-pointer border-b border-zinc-800 px-1.5 py-0.5 hover:bg-zinc-800"
            >
              <div className="font-medium text-[11px]">{s.symbol}</div>
              <div className="hidden">{s.name}</div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}







