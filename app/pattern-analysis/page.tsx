"use client";

import { useEffect, useState } from "react";
import SymbolSearch from "@/components/institutional/SymbolSearch";

export default function PatternAnalysisPage() {

  const [search, setSearch] = useState("SBIN");
  const [structure, setStructure] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const symbol = search.trim();

    if (!symbol) {

      setStructure(null);

      return;

    }

    const timer = setTimeout(async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `/api/institutional-analysis/structure?symbol=${encodeURIComponent(symbol)}`
        );

        const data = await res.json();

        setStructure(data);

      } catch {

        setStructure({
          success: false,
          error: "Unable to fetch API."
        });

      } finally {

        setLoading(false);

      }

    }, 300);

    return () => clearTimeout(timer);

  }, [search]);

  return (

    <main className="min-h-screen bg-black p-6 text-white">

      <SymbolSearch
  value={search}
  setValue={setSearch}
  onSelect={setSearch}
/>

      <div className="mt-6 rounded border border-zinc-800 bg-zinc-950 p-5">

        {loading ? (

          <div className="text-zinc-400">
            Loading...
          </div>

        ) : (

          <div className="space-y-6">

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-5 text-2xl font-bold">
{structure?.symbol ?? '--'}
</div>

<div className="grid grid-cols-4 gap-5">

<div>
<div className="text-xs text-zinc-500">CMP</div>
<div className="mt-1 text-xl font-semibold">
{structure?.cmp ?? '--'}
</div>
</div>

<div>
<div className="text-xs text-zinc-500">STATUS</div>
<div className="mt-1">
{structure?.liveContext?.status ?? '--'}
</div>
</div>

<div>
<div className="text-xs text-zinc-500">RESISTANCE</div>
<div className="mt-1">
{structure?.liveContext?.distanceAboveResistance ?? '--'}
</div>
</div>

<div>
<div className="text-xs text-zinc-500">SUPPORT</div>
<div className="mt-1">
{structure?.liveContext?.distanceAboveSupport ?? '--'}
</div>
</div>

</div>

</div>

<div className="grid gap-5 lg:grid-cols-3">

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-4 font-bold">
Major Structure
</div>

<div className="space-y-2">

<div>Trend : {structure?.majorStructure?.classification?.trend}</div>
<div>State : {structure?.majorStructure?.classification?.state}</div>
<div>Bias : {structure?.majorStructure?.classification?.bias}</div>
<div>Confidence : {structure?.majorStructure?.classification?.confidence}</div>

</div>

</div>

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-4 font-bold">
Intermediate Structure
</div>

<div className="space-y-2">

<div>Trend : {structure?.intermediateStructure?.classification?.trend}</div>
<div>State : {structure?.intermediateStructure?.classification?.state}</div>
<div>Bias : {structure?.intermediateStructure?.classification?.bias}</div>
<div>Confidence : {structure?.intermediateStructure?.classification?.confidence}</div>

</div>

</div>

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-4 font-bold">
Trading Structure
</div>

<div className="space-y-2">

<div>Trend : {structure?.tradingStructure?.classification?.trend}</div>
<div>State : {structure?.tradingStructure?.classification?.state}</div>
<div>Bias : {structure?.tradingStructure?.classification?.bias}</div>
<div>Confidence : {structure?.tradingStructure?.classification?.confidence}</div>

<div>Latest High : {structure?.tradingStructure?.latestHigh?.price}</div>

<div>Latest Low : {structure?.tradingStructure?.latestLow?.price}</div>

</div>

</div>

</div>

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-4 text-lg font-bold">
Channel
</div>

<div className="grid grid-cols-2 gap-4">

<div>
<div className="text-xs text-zinc-500">TYPE</div>
<div className="mt-1 font-semibold">
{structure?.channel?.channel ?? "--"}
</div>
</div>

<div>
<div className="text-xs text-zinc-500">RESISTANCE</div>
<div className="mt-1 font-semibold">
{structure?.channel?.resistance ?? "--"}
</div>
</div>

<div>
<div className="text-xs text-zinc-500">SUPPORT</div>
<div className="mt-1 font-semibold">
{structure?.channel?.support ?? "--"}
</div>
</div>

<div>
<div className="text-xs text-zinc-500">WIDTH</div>
<div className="mt-1 font-semibold">
{
structure?.channel
?Number(
structure.channel.resistance-
structure.channel.support
).toFixed(2)
:"--"
}
</div>
</div>

</div>

</div>

<div className="grid gap-5 lg:grid-cols-2">

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-4 font-bold">
Swing Highs
</div>

<div className="space-y-1">

{structure?.latestSwings?.highs?.slice(0,10).map((x:any,i:number)=>(

<div key={i}>
{x.price}
</div>

))}

</div>

</div>

<div className="rounded border border-zinc-800 bg-zinc-900 p-5">

<div className="mb-4 font-bold">
Swing Lows
</div>

<div className="space-y-1">

{structure?.latestSwings?.lows?.slice(0,10).map((x:any,i:number)=>(

<div key={i}>
{x.price}
</div>

))}

</div>

</div>

</div>

</div>

        )}

      </div>

    </main>

  );

}





