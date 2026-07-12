"use client";

interface ToolbarProps{
  symbol:string;
  setSymbol:(value:string)=>void;
  onRefresh:()=>void;
  loading:boolean;
}

export default function Toolbar({
  symbol,
  setSymbol,
  onRefresh,
  loading
}:ToolbarProps){

  return(

    <div className="h-14 shrink-0 border-b border-[#2a313b] bg-[#161b22] flex items-center gap-3 px-5">

      <input
        value={symbol}
        onChange={e=>setSymbol(e.target.value.toUpperCase())}
        placeholder="Search Symbol..."
        className="w-72 rounded border border-[#2a313b] bg-[#0a0d12] px-3 py-2 outline-none focus:border-cyan-500"
      />

      <button className="rounded bg-zinc-800 px-4 py-2">Sector</button>
      <button className="rounded bg-zinc-800 px-4 py-2">Industry</button>
      <button className="rounded bg-zinc-800 px-4 py-2">Verdict</button>
      <button className="rounded bg-zinc-800 px-4 py-2">Score</button>

      <div className="flex-1"/>

      <button
        onClick={onRefresh}
        className="rounded bg-blue-600 hover:bg-blue-700 px-4 py-2"
      >
        {loading ? "Loading..." : "Refresh"}
      </button>

    </div>

  );

}


