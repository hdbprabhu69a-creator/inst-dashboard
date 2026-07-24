"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Save, Search } from "lucide-react";

interface Metric{
    id:string;
    metric:string;
    value:string;
    unit:string;
}

interface Stock{
    id:string;
    symbol:string;
    remarks:string;
}

interface NewsRow{

    id:string;
    headline:string;
    category:string;
    date:string;
    summary:string;
    verdict:"Bullish"|"Neutral"|"Bearish";

    metrics:Metric[];

    sectors:string[];

    stocks:Stock[];

    watchItems:string[];

    expanded:boolean;

    edited:boolean;

isNew:boolean;

}

const sectorList=[

"Banking",
"Financial Services",
"NBFC",
"IT",
"Pharma",
"Auto",
"Capital Goods",
"Metal",
"Energy",
"Realty",
"FMCG",
"Infrastructure",
"Telecom",
"PSU"

];

const categoryList=[

"RBI",
"Economy",
"Banking",
"Corporate",
"Results",
"Policy",
"Budget",
"Global",
"Commodity",
"Currency",
"Market",
"Sector",
"Others"

];

const initialRows:NewsRow[]=[

{

id:crypto.randomUUID(),

headline:"",

category:"RBI",

date:"",

summary:"",

verdict:"Neutral",

metrics:[],

sectors:[],

stocks:[],

watchItems:["","",""],

expanded:true,

edited:false,

isNew:true

}

];

export default function InstitutionalNewsPage(){

const[rows,setRows]=useState(initialRows);

const[search,setSearch]=useState("");

useEffect(()=>{

loadNews();

},[]);

async function loadNews(){

const res=await fetch("/api/admin/news");

const json=await res.json();

if(json.success){

setRows(

json.data.map((r:any)=>({

expanded:false,

edited:false,

isNew:false,

...r

}))

);

}

}

const filtered=useMemo(()=>{

return rows.filter(r=>

r.headline.toLowerCase().includes(search.toLowerCase())

);

},[rows,search]);

const updateRow=(

id:string,

key:keyof NewsRow,

value:any

)=>{

setRows(prev=>

prev.map(r=>

r.id===id

?{

...r,

[key]:value,

edited:true

}

:r

)

);

};


async function deleteRow(id:string){

if(!confirm("Delete this news?")) return;

await fetch("/api/admin/news?id="+id,{

method:"DELETE"

});

await loadNews();

}

const addNews=()=>{

setRows(prev=>[

...prev,

{

id:crypto.randomUUID(),

headline:"",

category:"RBI",

date:"",

summary:"",

verdict:"Neutral",

metrics:[],

sectors:[],

stocks:[],

watchItems:["","",""],

expanded:true,

edited:false,

isNew:true

}

]);

};

const saveRow=async(id:string)=>{

const row=rows.find(r=>r.id===id);

if(!row)return;

const body={...row};

delete (body as any).expanded;

delete (body as any).edited;

delete (body as any).isNew;

if(!row.isNew){

await fetch("/api/admin/news",{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

});

}else{

const res=await fetch("/api/admin/news",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

});

const json=await res.json();

if(json.success){

body.id=json.id;

}

}

await loadNews();

};

const saveAll=()=>{

setRows(prev=>

prev.map(r=>({

...r,

edited:false,

isNew:true

}))

);

};

return(

<div className="min-h-screen bg-zinc-950 text-white p-6 space-y-6">

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">

Institutional News Entry

</h1>

<p className="text-zinc-400">

Manual News Intelligence Management

</p>

</div>

<div className="flex gap-3">

<button

onClick={addNews}

className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700"

>

<Plus size={18}/>

Add News

</button>

<button

onClick={saveAll}

className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"

>

<Save size={18}/>

Save All

</button>

</div>

</div>

<div className="grid grid-cols-4 gap-4">

<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

<div className="text-sm text-zinc-500">

Total News

</div>

<div className="mt-2 text-3xl font-bold">

{rows.length}

</div>

</div>

<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

<div className="text-sm text-zinc-500">

RBI News

</div>

<div className="mt-2 text-3xl font-bold">

{rows.filter(r=>r.category==="RBI").length}

</div>

</div>

<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

<div className="text-sm text-zinc-500">

Corporate News

</div>

<div className="mt-2 text-3xl font-bold">

{rows.filter(r=>r.category==="Corporate").length}

</div>

</div>

<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

<div className="text-sm text-zinc-500">

Global News

</div>

<div className="mt-2 text-3xl font-bold">

{rows.filter(r=>r.category==="Global").length}

</div>

</div>

</div>

<div className="flex items-center gap-3">

<Search size={18}/>

<input

value={search}

onChange={e=>setSearch(e.target.value)}

placeholder="Search Headline..."

className="w-96 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 outline-none"

/>

</div>

<div className="overflow-auto rounded-xl border border-zinc-800">

<table className="min-w-full text-sm">

<thead className="sticky top-0 bg-zinc-900">

<tr>

<th className="p-3 text-left"></th>

<th className="p-3 text-left">

Headline

</th>

<th className="p-3">

Category

</th>

<th className="p-3">

Date

</th>

<th className="p-3">

Verdict

</th>

<th className="p-3">

Save

</th>

</tr>

</thead>

<tbody>


{filtered.map(row=>(

<Fragment key={row.id}>

<tr

className={row.edited?"border-t border-yellow-700 bg-yellow-500/5":"border-t border-zinc-800"}
>

<td className="p-3">

<button
onClick={()=>updateRow(row.id,"expanded",!row.expanded)}
>

{row.expanded?<ChevronUp size={18}/>:<ChevronDown size={18}/>}

</button>

</td>

<td className="p-3">

{row.headline||<span className="text-zinc-500">New News Entry</span>}

</td>

<td className="text-center">

{row.category}

</td>

<td className="text-center">

{row.date||"-"}

</td>

<td className="text-center">

{row.verdict}

</td>

<td className="text-center">

<button
onClick={()=>saveRow(row.id)}
className="rounded bg-blue-600 px-3 py-1 hover:bg-blue-700"
>

Save

</button>

</td>

</tr>

{row.expanded&&(

<tr>

<td colSpan={6} className="bg-zinc-950 p-6">

<div className="grid gap-6">

<div className="grid grid-cols-2 gap-6">

<div>

<label className="mb-2 block text-sm text-zinc-400">

Headline

</label>

<input

value={row.headline}

onChange={e=>updateRow(row.id,"headline",e.target.value)}

className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none"

/>

</div>

<div>

<label className="mb-2 block text-sm text-zinc-400">

Category

</label>

<select

value={row.category}

onChange={e=>updateRow(row.id,"category",e.target.value)}

className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"

>

{categoryList.map(c=>(

<option key={c}>

{c}

</option>

))}

</select>

</div>

<div>

<label className="mb-2 block text-sm text-zinc-400">

Date

</label>

<input

type="date"

value={row.date}

onChange={e=>updateRow(row.id,"date",e.target.value)}

className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"

/>

</div>

<div>

<label className="mb-2 block text-sm text-zinc-400">

Verdict

</label>

<select

value={row.verdict}

onChange={e=>updateRow(row.id,"verdict",e.target.value)}

className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"

>

<option>Bullish</option>

<option>Neutral</option>

<option>Bearish</option>

</select>

</div>

</div>

<div>

<label className="mb-2 block text-sm text-zinc-400">

Summary

</label>

<textarea

rows={5}

value={row.summary}

onChange={e=>updateRow(row.id,"summary",e.target.value)}

className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none"

/>

</div>

<div className="border border-zinc-800 rounded-xl p-5">

<h3 className="mb-4 text-lg font-semibold">

Key Metrics

</h3>


<table className="min-w-full text-sm">

<thead>

<tr className="border-b border-zinc-800">

<th className="p-2 text-left">Metric</th>

<th className="p-2 text-left">Value</th>

<th className="p-2 text-left">Unit</th>

<th className="p-2 text-center"></th>

</tr>

</thead>

<tbody>

{row.metrics.map(metric=>(

<tr key={metric.id} className="border-b border-zinc-800">

<td className="p-2">

<input

value={metric.metric}

onChange={e=>

updateRow(

row.id,

"metrics",

row.metrics.map(m=>

m.id===metric.id

?{

...m,

metric:e.target.value

}

:m

)

)

}

className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"

/>

</td>

<td className="p-2">

<input

value={metric.value}

onChange={e=>

updateRow(

row.id,

"metrics",

row.metrics.map(m=>

m.id===metric.id

?{

...m,

value:e.target.value

}

:m

)

)

}

className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"

/>

</td>

<td className="p-2">

<input

value={metric.unit}

onChange={e=>

updateRow(

row.id,

"metrics",

row.metrics.map(m=>

m.id===metric.id

?{

...m,

unit:e.target.value

}

:m

)

)

}

className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"

/>

</td>

<td className="p-2 text-center">

<button

onClick={()=>updateRow(

row.id,

"metrics",

row.metrics.filter(m=>m.id!==metric.id)

)}

className="rounded bg-red-600 px-3 py-1 hover:bg-red-700"

>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

<div className="mt-4">

<button

onClick={()=>updateRow(

row.id,

"metrics",

[

...row.metrics,

{

id:crypto.randomUUID(),

metric:"",

value:"",

unit:""

}

]

)}

className="rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700"

>

+ Add Metric

</button>

</div>

</div>

<div className="grid grid-cols-2 gap-6">

<div className="rounded-xl border border-zinc-800 p-5">

<h3 className="mb-4 text-lg font-semibold">

Affected Sectors

</h3>


<div className="grid grid-cols-2 gap-2">

{sectorList.map(sector=>(

<label
key={sector}
className="flex items-center gap-2 rounded border border-zinc-800 p-2 hover:bg-zinc-900 cursor-pointer"
>

<input
type="checkbox"
checked={row.sectors.includes(sector)}
onChange={e=>{

if(e.target.checked){

updateRow(
row.id,
"sectors",
[...row.sectors,sector]
);

}else{

updateRow(
row.id,
"sectors",
row.sectors.filter(s=>s!==sector)
);

}

}}
/>

<span>{sector}</span>

</label>

))}

</div>

</div>

<div className="rounded-xl border border-zinc-800 p-5">

<h3 className="mb-4 text-lg font-semibold">

Affected Stocks

</h3>

<table className="min-w-full text-sm">

<thead>

<tr className="border-b border-zinc-800">

<th className="p-2 text-left">

Symbol

</th>

<th className="p-2 text-left">

Remarks

</th>

<th className="p-2 text-center">

</th>

</tr>

</thead>

<tbody>

{row.stocks.map(stock=>(

<tr
key={stock.id}
className="border-b border-zinc-800"
>

<td className="p-2">

<input

value={stock.symbol}

onChange={e=>

updateRow(

row.id,

"stocks",

row.stocks.map(s=>

s.id===stock.id

?{

...s,

symbol:e.target.value

}

:s

)

)

}

className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"

/>

</td>

<td className="p-2">

<input

value={stock.remarks}

onChange={e=>

updateRow(

row.id,

"stocks",

row.stocks.map(s=>

s.id===stock.id

?{

...s,

remarks:e.target.value

}

:s

)

)

}

className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"

/>

</td>

<td className="p-2 text-center">

<button

onClick={()=>updateRow(

row.id,

"stocks",

row.stocks.filter(s=>s.id!==stock.id)

)}

className="rounded bg-red-600 px-3 py-1 hover:bg-red-700"

>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

<div className="mt-4">

<button

onClick={()=>updateRow(

row.id,

"stocks",

[

...row.stocks,

{

id:crypto.randomUUID(),

symbol:"",

remarks:""

}

]

)}

className="rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700"

>

+ Add Stock

</button>

</div>

</div>

</div>

</div>

<div className="rounded-xl border border-zinc-800 p-5">

<h3 className="mb-4 text-lg font-semibold">

Watch Items

</h3>


<div className="grid grid-cols-3 gap-4">

<input

value={row.watchItems[0]}

onChange={e=>{

const items=[...row.watchItems];

items[0]=e.target.value;

updateRow(row.id,"watchItems",items);

}}

placeholder="Watch Item 1"

className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none"

/>

<input

value={row.watchItems[1]}

onChange={e=>{

const items=[...row.watchItems];

items[1]=e.target.value;

updateRow(row.id,"watchItems",items);

}}

placeholder="Watch Item 2"

className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none"

/>

<input

value={row.watchItems[2]}

onChange={e=>{

const items=[...row.watchItems];

items[2]=e.target.value;

updateRow(row.id,"watchItems",items);

}}

placeholder="Watch Item 3"

className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none"

/>

</div>

<div className="mt-6 flex justify-end gap-3">

<button

onClick={()=>saveRow(row.id)}

className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700"

>

Save Row

</button>

<button

onClick={()=>deleteRow(row.id)}

className="rounded-lg bg-red-600 px-5 py-2 hover:bg-red-700"

>

Delete

</button>

<button

onClick={()=>updateRow(row.id,"expanded",false)}

className="rounded-lg bg-zinc-700 px-5 py-2 hover:bg-zinc-600"

>

Collapse

</button>

</div>

</div>

</td>

</tr>

)}

</Fragment>

))}

</tbody>

</table>

</div>

</div>

);

}


















