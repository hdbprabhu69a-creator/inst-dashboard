"use client";

import { useMemo, useState } from "react";`r`nimport { useUniverse } from "@/hooks/useUniverse";`r`n`r`ntype Props = {`r`n  onSelect:(symbol:string)=>void;
  open: boolean;
  onClose: () => void;
};

export default function StockSearchPopup({`r`n  onSelect,
  open,
  onClose,
}: Props) {

  const { stocks } = useUniverse();`r`nconst [query,setQuery]=useState("");`r`nconst filtered=useMemo(()=>stocks.filter(s=>s.symbol.toLowerCase().includes(query.toLowerCase())||(s.name??"").toLowerCase().includes(query.toLowerCase())).slice(0,20),[stocks,query]);`r`n`r`nif(!open)return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[420px] bg-[#131722] border border-zinc-700 rounded-lg shadow-2xl z-50">

        <div className="p-3 border-b border-zinc-700">

          <input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search stock..." className="w-full rounded bg-[#0b0e11] border border-zinc-700 px-3 py-2 outline-none text-white" />

        </div>

        <div className="p-6 text-center text-zinc-500">

          {filtered.map(s=>(<div key={s.symbol} className="px-3 py-2 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800" onClick={()=>{onSelect(s.symbol);onClose();}}><div className="font-semibold">{s.symbol}</div><div className="text-xs text-zinc-400">{s.name}</div></div>))}

        </div>

      </div>
    </>
  );

}


