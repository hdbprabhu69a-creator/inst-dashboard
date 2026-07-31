"use client";

import { useEffect, useState } from "react";

function formatDate(value:any){

  if(!value)
    return "-";

  if(value.seconds){

    return new Date(
      value.seconds * 1000
    ).toLocaleDateString(
      "en-GB",
      {
        day:"2-digit",
        month:"short",
        year:"2-digit"
      }
    );

  }

  return String(value);

}

type Decision={

  symbol:string;

  cmp:number;

  trend:string;

  marketState:string;

  phase:string;

  structure:string;

  confidence:{
    score:number;
    confidence:string;
  };

  strength:{
    score:number;
    strength:string;
  };

  trendline?:{
    status:string;
    price:number|null;
  };

  channel?:{
    status:string;
    upper:number|null;
    lower:number|null;
  };

  reasons?:string[];

  baseTarget?:{

    previousBase?:{
      price:number;
      date:any;
    };

    expansionHigh?:{
      price:number;
      date:any;
    };

    markdownLow?:{
      price:number;
      date:any;
    };

    height?:number;

    breakoutLevel?:number;

    status?:string;

    nextTarget?:number;

  };

};

export default function DecisionPage(){

const [rows,setRows]=
useState<Decision[]>([]);

const [selected,setSelected]=
useState<Decision|null>(null);

const [loading,setLoading]=
useState(true);

const [mouse,setMouse]=
useState({
x:0,
y:0
});

useEffect(()=>{

load();

},[]);

async function load(){

try{

const response=
await fetch(
"/api/institutional-analysis/stock-decision"
);

const json=
await response.json();

setRows(
json.data ?? []
);

}
finally{

setLoading(false);

}

}if(loading){

return (

<div
className="p-6 text-slate-300 bg-[#0B1220] min-h-screen">

Loading...

</div>

);

}

return (

<div
className="
min-h-screen
p-6
space-y-6
bg-[#0B1220]
relative
overflow-hidden
"
onMouseMove={(e)=>{

setMouse({
x:e.clientX,
y:e.clientY
});

}}
>

<div
className="
pointer-events-none
fixed
w-[500px]
h-[500px]
rounded-full
bg-cyan-500/10
blur-3xl
z-[-1]
"
style={{
left:mouse.x-250,
top:mouse.y-250
}}
/>

<div
className="
absolute
inset-0
pointer-events-none
opacity-5
z-0
"
style={{
backgroundImage:
"linear-gradient(#1f2937 1px, transparent 1px),linear-gradient(90deg,#1f2937 1px,transparent 1px)",
backgroundSize:"32px 32px"
}}
/>

<div className="relative z-10 text-slate-300">




<h1 className="text-3xl font-bold text-cyan-200 text-cyan-200">

Institutional Decision Dashboard

</h1>

<div
className="
overflow-auto
rounded-xl
border
border-slate-700
bg-slate-900
backdrop-blur-xl
shadow-2xl
">

<table className="min-w-full text-sm">

<thead
className="
bg-cyan-950
text-cyan-200
sticky
top-0
">

<tr>

<th className="p-2">Symbol</th>

<th className="p-2 text-right">
CMP
</th>

<th className="p-2">
Trend
</th>

<th className="p-2">
Market
</th>

<th className="p-2">
Trendline
</th>

<th className="p-2">
Channel
</th>

<th className="p-2">
Previous Base
</th>

<th className="p-2">
Expansion
</th>

<th className="p-2">
Markdown
</th>

<th className="p-2">
Status
</th>

<th className="p-2 text-right">
Target
</th>

</tr>

</thead>

<tbody>

{rows.map(row=>(

<tr

key={row.symbol}

className="
border-t
border-slate-700
hover:bg-cyan-900/40
cursor-pointer
transition
"

onClick={()=>setSelected(row)}

>

<td className="p-2 font-bold text-white">
{row.symbol}
</td>

<td className="p-2 text-right font-semibold text-slate-100">
{row.cmp.toFixed(2)}
</td>

<td className="p-2">

<div className="font-semibold text-cyan-200">
{row.trend}
</div>

<div className="text-xs text-slate-300">
{row.structure}
</div>

</td>

<td className="p-2">

<div>
{row.marketState}
</div>

<div className="text-xs text-slate-300">
{row.phase}
</div>

</td>

<td className="p-2">

<div className="font-semibold text-slate-100">
{row.trendline?.status ?? "-"}
</div>

<div className="text-xs text-slate-300">
{row.trendline?.price ?? "-"}
</div>

</td>

<td className="p-2">

<div className="font-semibold text-slate-100">
{row.channel?.status ?? "-"}
</div>

<div className="text-xs text-slate-300">
U: {row.channel?.upper ?? "-"}
</div>

<div className="text-xs text-slate-300">
L: {row.channel?.lower ?? "-"}
</div>

</td>

<td className="p-2 text-center">

<div className="font-semibold text-cyan-200">
{row.baseTarget?.previousBase?.price ?? "-"}
</div>

<div className="text-xs text-slate-300">
{formatDate(row.baseTarget?.previousBase?.date)}
</div>

</td>

<td className="p-2 text-center">

<div className="font-semibold text-emerald-400">
{row.baseTarget?.expansionHigh?.price ?? "-"}
</div>

</td>

<td className="p-2 text-center">

<div className="font-semibold text-rose-400">
{row.baseTarget?.markdownLow?.price ?? "-"}
</div>

</td>

<td className="p-2 text-center">

<span className="font-semibold text-amber-300">
{row.baseTarget?.status ?? "-"}
</span>

</td>

<td className="p-2 text-right font-bold text-emerald-400">

{row.baseTarget?.nextTarget ?? "-"}

</td>

</tr>

))}

</tbody>

</table>

</div>

{selected && (

<div className="rounded-xl border border-slate-700 bg-[#02080d] p-6 mt-6">

<h2 className="text-2xl font-bold text-cyan-200 mb-6">
{selected.symbol} Institutional Decision
</h2>

<div className="grid lg:grid-cols-2 gap-6">

<div className="rounded border border-slate-700 p-4">

<h3 className="font-bold text-cyan-200 mb-4">
Trend Analysis
</h3>

<table className="w-full text-sm">

<tbody>

<tr><td>CMP</td><td className="text-right">{selected.cmp.toFixed(2)}</td></tr>

<tr><td>Trend</td><td className="text-right">{selected.trend}</td></tr>

<tr><td>Market State</td><td className="text-right">{selected.marketState}</td></tr>

<tr><td>Phase</td><td className="text-right">{selected.phase}</td></tr>

<tr><td>Structure</td><td className="text-right">{selected.structure}</td></tr>

<tr><td>Strength</td><td className="text-right">{selected.strength?.score} ({selected.strength?.strength})</td></tr>

<tr><td>Confidence</td><td className="text-right">{selected.confidence?.score} ({selected.confidence?.confidence})</td></tr>

</tbody>

</table>

</div>

<div className="rounded border border-slate-700 p-4">

<h3 className="font-bold text-cyan-200 mb-4">
Trendline & Channel
</h3>

<table className="w-full text-sm">

<tbody>

<tr><td>Status</td><td className="text-right">{selected.trendline?.status}</td></tr>

<tr><td>Trendline</td><td className="text-right">{selected.trendline?.price}</td></tr>

<tr><td>Channel</td><td className="text-right">{selected.channel?.status}</td></tr>

<tr><td>Upper</td><td className="text-right">{selected.channel?.upper}</td></tr>

<tr><td>Lower</td><td className="text-right">{selected.channel?.lower}</td></tr>

</tbody>

</table>

</div>

<div className="rounded border border-slate-700 p-4">

<h3 className="font-bold text-cyan-200 mb-4">
Base Analysis
</h3>

<table className="w-full text-sm">

<tbody>

<tr><td>Previous Base</td><td className="text-right">{selected.baseTarget?.previousBase?.price}</td></tr>

<tr><td>Expansion High</td><td className="text-right">{selected.baseTarget?.expansionHigh?.price}</td></tr>

<tr><td>Markdown Low</td><td className="text-right">{selected.baseTarget?.markdownLow?.price}</td></tr>

<tr><td>Height</td><td className="text-right">{selected.baseTarget?.height}</td></tr>

<tr><td>Status</td><td className="text-right">{selected.baseTarget?.status}</td></tr>

<tr><td>Target</td><td className="text-right font-bold text-emerald-300">{selected.baseTarget?.nextTarget}</td></tr>

</tbody>

</table>

</div>

<div className="rounded border border-slate-700 p-4">

<h3 className="font-bold text-cyan-200 mb-4">
Decision Reasons
</h3>

<ul>

{selected.reasons?.map((r,i)=>(

<li key={i}>{i+1}. {r}</li>

))}

</ul>

</div>

</div>

</div>

)}

</div>

</div>

);

}
























