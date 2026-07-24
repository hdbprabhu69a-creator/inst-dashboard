"use client";

import { useEffect,useMemo,useState } from "react";

type Row={
  changePct:number;
  verdict:string;
};

export default function MarketBreadth(){

  const [rows,setRows]=useState<Row[]>([]);

  useEffect(()=>{

    async function load(){

      const r=await fetch("/api/watchlist?t="+Date.now());
      const j=await r.json();

      setRows(j.rows ?? []);

    }

    load();

  },[]);

  const data=useMemo(()=>{

    const advances=
      rows.filter(r=>r.changePct>0).length;

    const declines=
      rows.filter(r=>r.changePct<0).length;

    const unchanged=
      rows.length-advances-declines;

    const strongBuy=
      rows.filter(r=>r.verdict==="STRONG BUY").length;

    const buyOnDip=
      rows.filter(r=>r.verdict==="BUY ON DIP").length;

    const ratio=
      declines===0
        ? advances
        : advances/declines;

    return{
      advances,
      declines,
      unchanged,
      strongBuy,
      buyOnDip,
      ratio
    };

  },[rows]);

  const total=Math.max(
    data.advances+data.declines+data.unchanged,
    1
  );

  const a=(data.advances/total)*100;
  const d=(data.declines/total)*100;
  const u=(data.unchanged/total)*100;

  return(

<div className="rounded-xl border border-[#1f2937] bg-[#080d14] p-4">

<div className="mb-4 text-xl font-semibold">
MARKET BREADTH
</div>

<div className="grid grid-cols-3 gap-4 mb-5">

<div>
<div className="text-xs text-gray-400">ADVANCES</div>
<div className="text-3xl font-bold text-green-400">
{data.advances}
</div>
</div>

<div>
<div className="text-xs text-gray-400">DECLINES</div>
<div className="text-3xl font-bold text-red-400">
{data.declines}
</div>
</div>

<div>
<div className="text-xs text-gray-400">UNCHANGED</div>
<div className="text-3xl font-bold text-yellow-400">
{data.unchanged}
</div>
</div>

</div>

<div className="grid grid-cols-[180px_1fr] gap-6">

<div className="flex items-center justify-center">

<div
className="h-40 w-40 rounded-full"
style={{
background:
`conic-gradient(
#22c55e 0 ${a}%,
#ef4444 ${a}% ${a+d}%,
#facc15 ${a+d}% 100%
)`
}}
>

<div className="m-6 h-28 w-28 rounded-full bg-[#080d14]" />

</div>

</div>

<div className="space-y-6">

<div>
<div className="text-xs text-gray-400">
A/D RATIO
</div>
<div className="text-4xl text-cyan-400 font-bold">
{data.ratio.toFixed(2)}
</div>
</div>

<div>
<div className="text-xs text-gray-400">
STRONG BUY
</div>
<div className="text-3xl text-green-400 font-bold">
{data.strongBuy}
</div>
</div>

<div>
<div className="text-xs text-gray-400">
BUY ON DIP
</div>
<div className="text-3xl text-cyan-400 font-bold">
{data.buyOnDip}
</div>
</div>

</div>

</div>

<div className="mt-6 border-t border-[#1f2937] pt-3 text-sm text-gray-400">
TOTAL STOCKS : {rows.length}
</div>

</div>

);

}
