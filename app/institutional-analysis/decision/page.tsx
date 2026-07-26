"use client";

import { useEffect,useState } from "react";

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

  strength:any;

  phase:string;

  structure:string;

  confidence:any;

  regime?:string;

  confirmation?:any;

  indicators?:any;

  baseTarget?:any;

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
"/api/institutional-analysis/index-decision"
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

}

if(loading){

return (

<div
className="p-6 text-slate-300 bg-[#05070b] min-h-screen">

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
bg-[#05070b]
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
opacity-10
z-0
"
style={{
backgroundImage:
"linear-gradient(#1f2937 1px, transparent 1px),linear-gradient(90deg,#1f2937 1px,transparent 1px)",
backgroundSize:"32px 32px"
}}
/>

<div className="relative z-10 text-slate-300">




<h1 className="text-3xl font-bold text-cyan-300 text-cyan-300">

Institutional Decision Dashboard

</h1>

<div
className="
overflow-auto
rounded-xl
border
border-zinc-800
bg-[#02080d]/90
backdrop-blur-xl
shadow-2xl
">

<table className="min-w-full text-sm">

<thead
className="
bg-[#06131a]
text-cyan-300
sticky
top-0
">

<tr>

<th className="p-2 text-left">
Index
</th>

<th className="p-2 text-right">
CMP
</th>

<th className="p-2 text-left">
Institutional Structure
</th>

<th className="p-2 text-left">
Previous Base
</th>

<th className="p-2 text-left">
Expansion High
</th>

<th className="p-2 text-left">
Markdown Low
</th>

<th className="p-2 text-right">
Height
</th>

<th className="p-2 text-right">
Next Target
</th>

</tr>

</thead>

<tbody>

{rows.map(row=>(

<tr

key={row.symbol}

className="
border-t
border-zinc-800
hover:bg-cyan-400/10
cursor-pointer
transition
"

onClick={()=>setSelected(row)}

>

<td className="p-2 font-bold text-center">
{row.symbol}
</td>


<td className="p-2 text-right font-semibold">
{row.cmp.toFixed(2)}
</td>


<td
className="
p-2
whitespace-normal
leading-tight
min-w-[220px]
"
>

<div className="font-bold text-cyan-300">
{row.trend}
</div>

<div className="text-xs">
State:
{" "}
{row.marketState}
</div>

<div className="text-xs">
Strength:
{" "}
{row.strength?.strength ?? "-"}
</div>

<div className="text-xs">
Phase:
{" "}
{row.phase}
</div>

<div className="text-xs">
Structure:
{" "}
{row.structure}
</div>

</td>


<td className="p-2 text-center">

<div className="font-bold text-cyan-300">
{row.baseTarget?.previousBase?.price ?? "-"}
</div>

<div className="text-xs text-slate-500">
{formatDate(row.baseTarget?.previousBase?.date)}
</div>

</td>


<td className="p-2 text-center">

<div className="font-bold text-green-600">
{row.baseTarget?.expansionHigh?.price ?? "-"}
</div>

<div className="text-xs text-slate-500">
{formatDate(row.baseTarget?.expansionHigh?.date)}
</div>

</td>


<td className="p-2 text-center">

<div className="font-bold text-red-500">
{row.baseTarget?.markdownLow?.price ?? "-"}
</div>

<div className="text-xs text-slate-500">
{formatDate(row.baseTarget?.markdownLow?.date)}
</div>

</td>


<td className="p-2 text-right font-bold">

{row.baseTarget?.height ?? "-"}

</td>


<td className="
p-2
text-right
font-bold
text-green-600
">

{row.baseTarget?.nextTarget ?? "-"}

</td>


</tr>

))}

</tbody>

</table>

</div>

{selected && (

<div className="rounded border p-6">

<h2 className="text-2xl font-bold mb-6">

{selected.symbol}

</h2>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

<div>

<div className="text-gray-500">

CMP

</div>

<div className="font-bold text-cyan-300">

{selected.cmp.toFixed(2)}

</div>

</div>

<div>

<div className="text-gray-500">

Trend

</div>

<div className="font-bold text-cyan-300">

{selected.trend}

</div>

</div>

<div>

<div className="text-gray-500">

Strength

</div>

<div className="font-bold text-cyan-300">

{selected.strength?.strength}

</div>

</div>

<div>

<div className="text-gray-500">

Phase

</div>

<div className="font-bold text-cyan-300">

{selected.phase}

</div>

</div>

<div>

<div className="text-gray-500">

Structure

</div>

<div className="font-bold text-cyan-300">

{selected.structure}

</div>

</div>

<div>

<div className="text-gray-500">

Market State

</div>

<div className="font-bold text-cyan-300">

{selected.marketState}

</div>

</div>

<div>

<div className="text-gray-500">

Confidence

</div>

<div className="font-bold text-cyan-300">

{
  typeof selected.confidence === "object"
    ? `${selected.confidence.score} (${selected.confidence.confidence})`
    : selected.confidence
}

</div>

</div>

<div>

<div className="text-gray-500">

Regime

</div>

<div className="font-bold text-cyan-300">

{selected.regime}

</div>

</div>


<div>

<div className="text-gray-500">
Previous Base
</div>

<div className="font-bold text-cyan-300">
{selected.baseTarget?.previousBase?.price ?? "-"}
</div>

</div>


<div>

<div className="text-gray-500">
Target
</div>

<div className="font-bold text-cyan-300">
{selected.baseTarget?.target?.price ?? "-"}
</div>

</div>


<div>

<div className="text-gray-500">
Target Status
</div>

<div className="font-bold text-cyan-300">
{selected.baseTarget?.target?.status ?? "-"}
</div>

</div>


<div>

<div className="text-gray-500">
New Base
</div>

<div className="font-bold text-cyan-300">
{selected.baseTarget?.newBase?.price ?? "-"}
</div>

</div>


<div>

<div className="text-gray-500">
Next Target
</div>

<div className="font-bold text-cyan-300">
{selected.baseTarget?.nextTarget?.price ?? "-"}
</div>

</div>

</div>



</div>

)}

</div>
</div>
);

}








