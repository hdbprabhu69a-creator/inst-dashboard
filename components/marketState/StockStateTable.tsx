"use client";

import { useUniverseRows } from "./useUniverseRows";



const badge = (state:string)=>{
  switch(state){
    case "Expansion": return "bg-green-600";
    case "Compression": return "bg-yellow-600";
    case "Accumulation": return "bg-cyan-600";
    case "Markup": return "bg-blue-600";
    case "Distribution": return "bg-orange-600";
    case "Markdown": return "bg-red-600";
    default: return "bg-zinc-600";
  }
}

export default function StockStateTable(){

  const rows = useUniverseRows();

  return (

<div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">

<div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">

<h2 className="font-semibold text-lg">
Stock State Table
</h2>

<input
placeholder="Search Symbol..."
className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm w-64 outline-none"
/>

</div>

<div className="overflow-x-auto">

<table className="min-w-full text-sm">

<thead className="sticky top-0 bg-zinc-950 text-zinc-300">

<tr>

<th className="px-4 py-3 text-center w-12">#</th>
<th className="px-4 py-3 text-left">Symbol</th>
<th className="px-4 py-3 text-left">Sector</th>
<th className="px-4 py-3 text-left">State</th>
<th className="px-4 py-3 text-right">Score</th>
<th className="px-4 py-3 text-right">Conf%</th>
<th className="px-4 py-3 text-center">Strength</th>
<th className="px-4 py-3 text-right">Days</th>
<th className="px-4 py-3">Previous</th>
<th className="px-4 py-3">Next</th>
<th className="px-4 py-3">Trend</th>

</tr>

</thead>

<tbody>

{rows.map((r,i)=>( 

<tr
key={r.symbol}
className={`border-t border-zinc-800 cursor-pointer transition-colors ${i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"} hover:bg-amber-950/30`}
>

<td className="px-4 py-3 text-center text-zinc-500">{i+1}</td>
<td className="px-4 py-3 font-semibold">
{r.symbol}
</td>

<td className="px-4 py-3">
{r.sector}
</td>

<td className="px-4 py-3">

<span className={`${badge(r.state)} px-2 py-1 rounded text-xs font-semibold`}>

{r.state}

</span>

</td>

<td className="px-4 py-3 text-right">
{r.score}
</td>

<td className="px-4 py-3 text-right">
{r.confidence}%
</td>

<td className="px-4 py-3 text-center">
{r.strength}
</td>

<td className="px-4 py-3 text-right">
{r.days}
</td>

<td className="px-4 py-3">
{r.previous}
</td>

<td className="px-4 py-3">
{r.next}
</td>

<td className="px-4 py-3">
{r.trend}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}




