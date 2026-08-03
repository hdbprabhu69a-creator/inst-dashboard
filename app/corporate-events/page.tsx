"use client";

import {useEffect,useMemo,useState} from "react";
import {Search} from "lucide-react";

interface EventRow{
id:string;
symbol:string;
meetingDate:string;
purpose:string;
remarks:string;
}

export default function CorporateEvents(){

const[rows,setRows]=useState<EventRow[]>([]);
const[search,setSearch]=useState("");
const[filter,setFilter]=useState("All");
const[resultFilter,setResultFilter]=useState("All");

useEffect(()=>{},[]);

async function load(){
const res=await fetch("/api/corporate-events");
const json=await res.json();

if(json.success){
  setRows(
    json.data
      .filter((r:EventRow)=>
        r.symbol &&
        r.symbol.trim()!=="" &&
        r.meetingDate &&
        !isNaN(new Date(r.meetingDate).getTime())
      )
      .sort((a:EventRow,b:EventRow)=>
        new Date(b.meetingDate).getTime()-
        new Date(a.meetingDate).getTime()
      )
  );
}
}

const today=new Date().toISOString().slice(0,10);

const filtered=useMemo(()=>rows.filter(r=>{
if(!r.symbol) return false;

const ok=r.symbol.toLowerCase().includes(search.toLowerCase())||r.purpose.toLowerCase().includes(search.toLowerCase());

if(!ok)return false;

if(filter==="Upcoming")return !!r.meetingDate && r.meetingDate>=today;
if(filter==="Past")return !!r.meetingDate && r.meetingDate<today;
if(filter==="AGM")return r.purpose==="AGM";
if(filter==="Dividend")return r.purpose==="Dividend";
if(filter==="Results"){
if(resultFilter==="All")return r.purpose.includes("Results");
return r.purpose.includes(resultFilter);
}

return true;

}),[rows,search,filter]);

return(
<div className="min-h-screen bg-zinc-950 text-white p-4 space-y-4">





<div className="flex items-center gap-3">
<Search size={18}/>
<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search Symbol / Purpose"
className="w-80 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2"/>
<select
value={filter}
onChange={e=>setFilter(e.target.value)}
className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2"
>
<option>All</option>
<option>Upcoming</option>
<option>Past</option>
<option>AGM</option>
<option>Results</option>
<option>Dividend</option>
</select>

{filter==="Results"&&(
<select
value={resultFilter}
onChange={e=>setResultFilter(e.target.value)}
className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2"
>
<option>All</option>
<option>Q1</option>
<option>Q2</option>
<option>Q3</option>
<option>Q4</option>
</select>
)}

<button
onClick={load}
className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
>
Load Events
</button>

</div>

<div className="overflow-auto rounded-xl border border-zinc-800">

<table className="min-w-full text-sm">

<thead className="bg-zinc-900">
<tr>
<th className="p-3 text-left">Symbol</th>
<th className="p-3 text-left">Meeting Date</th>
<th className="p-3 text-left">Purpose</th>
<th className="p-3 text-left">Remarks</th>
</tr>
</thead>

<tbody>

{filtered.map(r=>

<tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-900">

<td className="p-3 font-semibold">{r.symbol}</td>

<td className="p-3">
{r.meetingDate?new Date(r.meetingDate+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"-"}
</td>

<td className="p-3">
<span className={`rounded-full px-3 py-1 text-xs font-semibold ${
r.purpose==="AGM"
?"bg-blue-600"
:r.purpose.includes("Results")
?"bg-green-600"
:r.purpose==="Board Meeting"
?"bg-orange-600"
:"bg-zinc-700"
}`}>
{r.purpose}
</span>
</td>

<td className="p-3">{r.remarks||"-"}</td>

</tr>

)}

</tbody>

</table>

</div>

</div>

);

}

function Card({title,value}:{title:string,value:number}){
return(
<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
<div className="text-sm text-zinc-500">{title}</div>
<div className="mt-2 text-3xl font-bold">{value}</div>
</div>
);
}


















