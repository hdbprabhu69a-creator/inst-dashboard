"use client";

import { useEffect,useState } from "react";


type Row={
 symbol:string;
 data:any;
};



export default function IndexRegimeTable(){

const [rows,setRows]=useState<Row[]>([]);


useEffect(()=>{

fetch("/api/institutional-analysis/index-regime-bulk")
.then(r=>r.json())
.then(j=>{

if(j.success)
 setRows(j.indices);

});

},[]);



function badge(v:string){

if(
 v==="BULLISH" ||
 v==="RISK_ON" ||
 v==="POSITIVE"
)
return "bg-green-700 text-green-100";


if(
 v==="BEARISH" ||
 v==="RISK_OFF" ||
 v==="NEGATIVE"
)
return "bg-red-700 text-red-100";


return "bg-yellow-700 text-yellow-100";

}



function confidence(c:number){

return (

<div className="flex items-center gap-2">

<span>
{c}
</span>

<div className="w-20 h-2 bg-gray-800 rounded">

<div
className={
"h-2 rounded "+
(
c>=80
?"bg-green-500"
:
c>=60
?"bg-yellow-500"
:
"bg-red-500"
)
}
style={{
width:`${c}%`
}}
/>

</div>

</div>

)

}



return (

<div className="bg-black min-h-screen text-gray-200 p-6">


<h1 className="text-2xl font-bold mb-5">
Institutional Index Regime Matrix
</h1>



<div className="grid grid-cols-3 gap-4 mb-6">


<div className="border border-gray-700 p-4 rounded">

<div className="text-gray-400">
MARKET MODE
</div>

<div className="text-xl">
SELECTIVE
</div>

</div>



<div className="border border-gray-700 p-4 rounded">

<div className="text-gray-400">
LEADERS
</div>

<div className="text-green-400 text-sm space-y-1">

{
rows
.filter(
r=>r.data.confidence>=80
)
.map(
r=>
<div key={r.symbol}>
{r.symbol}
<span className="text-gray-400 ml-2">
{r.data.confidence}
</span>
</div>
)
}

</div>

</div>



<div className="border border-gray-700 p-4 rounded">

<div className="text-gray-400">
RISK MODE
</div>

<div>
NEUTRAL
</div>

</div>


<div className="border border-gray-700 p-4 rounded">

<div className="text-gray-400">
MARKET BREADTH
</div>

<div className="text-green-400">
BULLISH :
{
rows.filter(
r=>r.data.regime==="BULLISH"
).length
}
</div>

<div className="text-yellow-400">
NEUTRAL :
{
rows.filter(
r=>r.data.regime==="NEUTRAL"
).length
}
</div>

<div className="text-red-400">
BEARISH :
{
rows.filter(
r=>r.data.regime==="BEARISH"
).length
}
</div>

</div>


</div>




<div className="overflow-x-auto border border-gray-700 rounded">


<table className="min-w-[1350px] text-[11px] w-full">


<thead className="sticky top-0 z-30 bg-gray-950 shadow-lg">


<tr>

{
[
"INDEX",
"REGIME",
"PHASE",
"STRUCTURE",
"CONF",
"BIAS",
"ADX",
"TREND",
"MACD",
"RSI",
"CYCLE",
"CLOSE",
"21 DMA",
"30 DMA"
]
.map(h=>

<th
key={h}
className="px-2 py-2 border border-gray-700 text-left"
>
{h}
</th>

)
}


</tr>

</thead>



<tbody>


{
rows
.sort(
(a,b)=>
b.data.confidence-a.data.confidence
)
.map(r=>{


const d=r.data;


return (

<tr
key={r.symbol}
className="hover:bg-gray-900 border-b border-gray-800"
>


<td className="px-2 py-1 font-bold sticky left-0 bg-black">
{r.symbol}
</td>


<td className="px-2 py-1">

<span className={`px-2 py-1 rounded ${badge(d.regime)}`}>

{d.regime}

</span>

</td>


<td>{d.phase}</td>

<td>{d.structure}</td>


<td>
{confidence(d.confidence)}
</td>


<td>

<span className={`px-2 py-1 rounded ${badge(d.institutionalBias)}`}>
{d.institutionalBias}
</span>

</td>


<td>{d.confirmation?.adx}</td>

<td>{d.confirmation?.trendStrength}</td>


<td>

<span className={`px-2 py-1 rounded ${badge(d.confirmation?.macd)}`}>
{d.confirmation?.macd}
</span>

</td>


<td>{d.confirmation?.rsi}</td>


<td>{d.confirmation?.cycle45}</td>


<td>{Number(d.indicators?.close).toFixed(2)}</td>


<td>{Number(d.indicators?.dma21).toFixed(2)}</td>


<td>{Number(d.indicators?.dma30).toFixed(2)}</td>



</tr>

)


})

}



</tbody>


</table>


</div>


</div>

)

}

