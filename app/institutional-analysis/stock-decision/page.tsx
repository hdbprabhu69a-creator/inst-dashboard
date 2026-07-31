"use client";

import { useEffect, useState } from "react";
function formatDate(value: any) {

  if (!value)
    return "-";

  if (value.seconds) {

    return new Date(
      value.seconds * 1000
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "2-digit"
      }
    );

  }

  return String(value);

}

type Decision = {

  symbol: string;

  cmp: number;

  trend: string;

  marketState: string;

  phase: string;

  structure: string;

  confidence: {
    score: number;
    confidence: string;
  };

  strength: {
    score: number;
    strength: string;
  };

  trendline?: {
    status: string;
    price: number | null;
  };

  channel?: {
    status: string;
    upper: number | null;
    lower: number | null;
  };

  reasons?: string[];

  volumeFlow?:{
    avg30:string;
    avgWeek:string;
    today:string;
    verdict:string;
  };

  deliveryFlow?:{
    avg20:string;
    avg10:string;
    avg5:string;
    verdict:string;
  };


  baseTarget?: {

    previousBase?: {
      price: number;
      date: any;
    };

    expansionHigh?: {
      price: number;
      date: any;
    };

    markdownLow?: {
      price: number;
      date: any;
    };

    height?: number;

    breakoutLevel?: number;

    status?: string;

    nextTarget?: number;

  };

};

export default function DecisionPage() {

 

  const [rows, setRows] =
    useState<Decision[]>([]);const [search, setSearch] =
  useState("");
  const [loading, setLoading] =
    useState(true);

  const [mouse, setMouse] =
    useState({
      x: 0,
      y: 0
    });

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const response =
        await fetch(
          "/api/institutional-analysis/stock-decision"
        );

      const json =
        await response.json();

      setRows(
        json.data ?? []
      );

    }
    finally {

      setLoading(false);

    }

  }
  if (loading) {

  return (

    <div className="min-h-screen bg-[#05070b] flex items-center justify-center text-cyan-300 text-xl">

      Loading Institutional Dashboard...

    </div>

  );

}

return (

<div
className="
min-h-screen
bg-[#05070b]
p-6
space-y-6
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
fixed
pointer-events-none
w-[500px]
h-[500px]
rounded-full
bg-cyan-500/10
blur-3xl
-z-10
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
opacity-10
pointer-events-none
"
style={{
backgroundImage:
"linear-gradient(#1f2937 1px,transparent 1px),linear-gradient(90deg,#1f2937 1px,transparent 1px)",
backgroundSize:"32px 32px"
}}
/>

<div className="relative z-10 space-y-6">

<div className="mb-4">
  <input
    type="text"
    placeholder="Search Stock..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      rounded-lg
      border
      border-zinc-700
      bg-[#02080d]
      px-4
      py-3
      text-white
      placeholder:text-slate-500
      focus:outline-none
      focus:border-cyan-400
    "
  />
</div>

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

<table className="min-w-full text-sm text-slate-100">

<thead
className="
sticky
top-0
bg-[#06131a]
text-cyan-300
"
>

<tr>

<th className="p-3 text-left">
Symbol
</th>

<th className="p-3 text-right">
CMP
</th>

<th className="p-3">
Trend
</th>

<th className="p-3">
State
</th>

<th className="p-3">
Channel
</th>

<th className="p-3">
Volume Flow
</th>

<th className="p-3">
Delivery Flow
</th>

<th className="p-3">
Previous Base
</th>

<th className="p-3">
Base Status
</th>

<th className="p-3 text-right">
Target
</th>

</tr>

</thead>

<tbody className="text-slate-100">

{rows
.filter((row)=>
row.symbol.toLowerCase().includes(search.toLowerCase())
)
.map((row)=>(

<tr

key={row.symbol}



className="
border-t
border-zinc-800
hover:bg-cyan-500/10
cursor-pointer
transition
"

>

<td className="p-3 font-bold text-white">

{row.symbol}

</td>

<td className="p-3 text-right font-semibold text-white">

{row.cmp.toFixed(2)}

</td>

<td className="p-3 text-slate-100">

<div className="font-semibold text-cyan-300">

{row.trend}

</div>

<div className="text-xs text-slate-300">

{row.structure}

</div>

</td>

<td className="p-3 text-slate-100">

<div>

{row.marketState}

</div>

<div className="text-xs text-slate-300">

{row.phase}

</div>

</td>



<td className="p-3 text-slate-100">
  <div>{row.channel?.status ?? "-"}</div>
  <div className="text-xs text-slate-300">
    Upper : {row.channel?.upper ?? "-"}
  </div>
  <div className="text-xs text-slate-300">
    Lower : {row.channel?.lower ?? "-"}
  </div>
</td>

<td className="p-3 text-xs">
  <div>30D : {row.volumeFlow?.avg30 ?? "-"}</div>
  <div>1W : {row.volumeFlow?.avgWeek ?? "-"}</div>
  <div>T : {row.volumeFlow?.today ?? "-"}</div>
  <div className="font-semibold text-cyan-300">
    {row.volumeFlow?.verdict ?? "-"}
  </div>
</td>

<td className="p-3 text-xs">
  <div>20D : {row.deliveryFlow?.avg20 ?? "-"}</div>
  <div>10D : {row.deliveryFlow?.avg10 ?? "-"}</div>
  <div>5D : {row.deliveryFlow?.avg5 ?? "-"}</div>
  <div className="font-semibold text-yellow-300">
    {row.deliveryFlow?.verdict ?? "-"}
  </div>
</td>
<td className="p-3 text-center">

<div className="font-bold text-cyan-300">

{row.baseTarget?.previousBase?.price ?? "-"}

</div>

<div className="text-xs text-slate-300">

{formatDate(row.baseTarget?.previousBase?.date)}

</div>

</td>





<td className="p-3 text-center">

<span className="font-bold text-yellow-400">

{row.baseTarget?.status ?? "-"}

</span>

</td>

<td className="p-3 text-right font-bold text-green-500">

{row.baseTarget?.nextTarget ?? "-"}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

<footer
className="
border-t
border-zinc-800
pt-6
text-center
text-xs
text-slate-500
"
>

Institutional Decision Engine • Volume • Delivery • Base • Target Projection

</footer>

</div>

);
}















