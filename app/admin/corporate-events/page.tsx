"use client";

import {Fragment,useEffect,useMemo,useState} from "react";
import {ChevronDown,ChevronUp} from "lucide-react";
import {STOCK_UNIVERSE} from "@/lib/universe";

interface EventRow{
  id:string;
  symbol:string;
  meetingDate:string;
  purpose:string;
  remarks:string;
  expanded:boolean;
  edited:boolean;
  isNew:boolean;
}

const purposes=[
  "AGM","EGM","Q1 Results","Q2 Results","Q3 Results","Q4 Results",
  "Board Meeting","Dividend","Bonus","Split","Buyback","Rights Issue","Other"
];

const emptyRow=(symbol=""):EventRow=>({
  id:crypto.randomUUID(),
  symbol,
  meetingDate:"",
  purpose:"AGM",
  remarks:"",
  expanded:true,
  edited:false,
  isNew:true
});

export default function CorporateEventsPage(){

const [rows,setRows]=useState<EventRow[]>([]);
const [recent,setRecent]=useState<EventRow[]>([]);


useEffect(()=>{
  setRows([emptyRow()]);
},[]);



const update=(id:string,key:keyof EventRow,val:any)=>{
setRows(prev=>prev.map(r=>r.id===id?{...r,[key]:val,edited:true}:r));
};



async function saveRow(id:string){
const row=rows.find(r=>r.id===id);
if(!row)return;

const body={...row};
delete (body as any).expanded;
delete (body as any).edited;
delete (body as any).isNew;

await fetch("/api/corporate-events",{
method:row.isNew?"POST":"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(body)
});

setRecent(prev=>[row,...prev]);
setRows([emptyRow()]);
}


async function saveNext(id:string){
const row=rows.find(r=>r.id===id);
if(!row)return;

const body={...row};
delete (body as any).expanded;
delete (body as any).edited;
delete (body as any).isNew;

await fetch("/api/corporate-events",{
method:row.isNew?"POST":"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(body)
});

setRecent(prev=>[row,...prev]);
setRows([emptyRow(row.symbol)]);
}
async function deleteRow(id:string){
if(!confirm("Delete Event?"))return;

await fetch("/api/corporate-events?id="+id,{
method:"DELETE"
});

setRows([emptyRow()]);
}

return(
<div className="min-h-screen bg-zinc-950 text-white p-6 space-y-6">

<div className="flex justify-between items-center">
<div>
<h1 className="text-3xl font-bold">Corporate Events</h1>
<p className="text-zinc-400">AGM â€¢ Results â€¢ Board Meetings</p>
</div>

<div className="flex gap-3">


</div>
</div>





<div className="overflow-auto rounded-xl border border-zinc-800">

<table className="min-w-full text-sm">

<thead className="bg-zinc-900">
<tr>
<th></th>
<th>Symbol</th>

<th>Date</th>
<th>Purpose</th>
<th></th>
</tr>
</thead>

<tbody>

{recent.map(r=>

<tr key={r.id} className="border-b border-zinc-800 bg-zinc-900">
<td></td>
<td>{r.symbol}</td>
<td>{r.meetingDate||"-"}</td>
<td>{r.purpose}</td>
<td className="text-green-400 font-semibold">Saved</td>
</tr>

)}


{rows.map(row=>

<Fragment key={row.id}>

<tr className="border-t border-zinc-800">

<td className="p-3">
<button onClick={()=>update(row.id,"expanded",!row.expanded)}>
{row.expanded?<ChevronUp size={18}/>:<ChevronDown size={18}/>}
</button>
</td>

<td>{row.symbol||"-"}</td>

<td>{row.meetingDate||"-"}</td>
<td>{row.purpose}</td>

<td>
<button onClick={()=>saveRow(row.id)} className="bg-blue-600 px-3 py-1 rounded">Save</button>
</td>

</tr>

{row.expanded&&

<tr>

<td colSpan={5} className="bg-zinc-950 p-6">

<div className="grid grid-cols-2 gap-4">

<select value={row.symbol} onChange={e=>update(row.id,"symbol",e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 p-2">
<option value="">Select Symbol</option>
{STOCK_UNIVERSE.map((symbol:string)=><option key={symbol} value={symbol}>{symbol}</option>)}
</select>



<input type="date" value={row.meetingDate} onChange={e=>update(row.id,"meetingDate",e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 p-2"/>

<select value={row.purpose} onChange={e=>update(row.id,"purpose",e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 p-2">
{purposes.map(p=><option key={p}>{p}</option>)}
</select>

<textarea rows={3} value={row.remarks} onChange={e=>update(row.id,"remarks",e.target.value)} placeholder="Remarks" className="col-span-2 rounded border border-zinc-700 bg-zinc-900 p-2"/>

</div>

<div className="mt-5 flex justify-end gap-3">

<button onClick={()=>saveNext(row.id)} className="bg-green-600 px-4 py-2 rounded">Save & Next</button>

<button onClick={()=>deleteRow(row.id)} className="bg-red-600 px-4 py-2 rounded">Delete</button>

<button onClick={()=>update(row.id,"expanded",false)} className="bg-zinc-700 px-4 py-2 rounded">Collapse</button>

</div>

</td>

</tr>

}

</Fragment>

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






































