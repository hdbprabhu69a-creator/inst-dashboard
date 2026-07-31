"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Search } from "lucide-react";

interface MacroRow{
    id:string;
    indicator:string;
    current:string;
    previous:string;
    unit:string;
    nextRelease:string;
    frequency:string;
    source:string;
    updatedAt:string;
    status:"Updated"|"Pending"|"Due"|"Overdue";
}

const initialRows:MacroRow[]=[

{id:"gdp",indicator:"GDP Growth",current:"",previous:"",unit:"%",nextRelease:"",frequency:"Quarterly",source:"MOSPI",updatedAt:"-",status:"Pending"},
{id:"cpi",indicator:"Inflation (CPI)",current:"",previous:"",unit:"%",nextRelease:"",frequency:"Monthly",source:"MOSPI",updatedAt:"-",status:"Pending"},
{id:"core",indicator:"Core Inflation",current:"",previous:"",unit:"%",nextRelease:"",frequency:"Monthly",source:"MOSPI",updatedAt:"-",status:"Pending"},
{id:"wpi",indicator:"WPI Inflation",current:"",previous:"",unit:"%",nextRelease:"",frequency:"Monthly",source:"MOSPI",updatedAt:"-",status:"Pending"},
{id:"iip",indicator:"Industrial Production (IIP)",current:"",previous:"",unit:"%",nextRelease:"",frequency:"Monthly",source:"MOSPI",updatedAt:"-",status:"Pending"},

{id:"coreinfra",indicator:"Core Infrastructure Growth",current:"",previous:"",unit:"%",nextRelease:"",frequency:"Monthly",source:"Ministry of Commerce & Industry",updatedAt:"-",status:"Pending"},
{id:"pmim",indicator:"PMI Manufacturing",current:"",previous:"",unit:"Index",nextRelease:"",frequency:"Monthly",source:"S&P",updatedAt:"-",status:"Pending"},
{id:"pmis",indicator:"PMI Services",current:"",previous:"",unit:"Index",nextRelease:"",frequency:"Monthly",source:"S&P",updatedAt:"-",status:"Pending"},
{id:"fd",indicator:"Fiscal Deficit",current:"",previous:"",unit:"% GDP",nextRelease:"",frequency:"Annual",source:"MoF",updatedAt:"-",status:"Pending"},
{id:"cad",indicator:"Current Account Deficit",current:"",previous:"",unit:"% GDP",nextRelease:"",frequency:"Quarterly",source:"RBI",updatedAt:"-",status:"Pending"},
{id:"fx",indicator:"Forex Reserves",current:"",previous:"",unit:"USD Bn",nextRelease:"",frequency:"Weekly",source:"RBI",updatedAt:"-",status:"Pending"}

];

export default function IndiaMacroPage(){

const[rows,setRows]=useState(initialRows);
const[search,setSearch]=useState("");


useEffect(()=>{

    fetch("/api/macro/india")
        .then(r=>r.json())
        .then(data=>{

            if(Array.isArray(data) && data.length){

                setRows(data);

            }

        });

},[]);


const filtered=useMemo(()=>{

return rows.filter(r=>
r.indicator.toLowerCase().includes(search.toLowerCase())
);

},[rows,search]);

const updateField=(id:string,key:keyof MacroRow,value:string)=>{

setRows(prev=>

prev.map(r=>

r.id===id
?{...r,[key]:value,status:"Pending"}
:r

)

);

};

const calcChange=(current:string,previous:string)=>{

const c=parseFloat(current);
const p=parseFloat(previous);

if(isNaN(c)||isNaN(p)||p===0)return "-";

return (((c-p)/p)*100).toFixed(2)+"%";

};

const saveRow=async(id:string)=>{

    const row=rows.find(r=>r.id===id);

    if(!row)return;

    const updated:MacroRow={

        ...row,

        previous:row.current,

        updatedAt:new Date().toLocaleDateString(),

        status:"Updated" as const

    };

    await fetch("/api/macro/india",{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(updated)

    });

    setRows(prev=>

        prev.map(r=>

            r.id===id

            ?updated

            :r

        )

    );

};

const saveAll=async()=>{

    const updatedRows=rows.map(r=>({

        ...r,

        previous:r.current,

        updatedAt:new Date().toLocaleDateString(),

        status:"Updated" as const

    }));

    await fetch("/api/macro/india/save-all",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(updatedRows)

    });

    setRows(updatedRows);

};

const updatedToday=rows.filter(r=>r.status==="Updated").length;
const pending=rows.filter(r=>r.status==="Pending").length;

return(

<div className="p-6 space-y-6 bg-zinc-950 min-h-screen text-white">

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">
India Macro Admin
</h1>

<p className="text-zinc-400">
Manual Macro Data Management
</p>

</div>

<button
onClick={saveAll}
className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700"
>

<Save size={18}/>

Save All

</button>

</div>

<div className="grid grid-cols-4 gap-4">

<div className="rounded-xl bg-zinc-900 p-5 border border-zinc-800">
<div className="text-zinc-500 text-sm">Indicators</div>
<div className="text-3xl font-bold">{rows.length}</div>
</div>

<div className="rounded-xl bg-zinc-900 p-5 border border-zinc-800">
<div className="text-zinc-500 text-sm">Updated Today</div>
<div className="text-3xl font-bold text-green-400">{updatedToday}</div>
</div>

<div className="rounded-xl bg-zinc-900 p-5 border border-zinc-800">
<div className="text-zinc-500 text-sm">Pending</div>
<div className="text-3xl font-bold text-yellow-400">{pending}</div>
</div>

<div className="rounded-xl bg-zinc-900 p-5 border border-zinc-800">
<div className="text-zinc-500 text-sm">Last Sync</div>
<div className="text-lg">{rows.length ? rows[0].updatedAt || "-" : "-"}</div>
</div>

<div className="col-span-4 flex items-center gap-3">

<Search size={18}/>

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search Indicator..."
className="w-80 rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-2 outline-none"
/>

</div>

</div>

<div className="overflow-auto rounded-xl border border-zinc-800">

<table className="min-w-full text-sm">

<thead className="sticky top-0 bg-zinc-900">

<tr>
<th className="p-3 text-left">Indicator</th>
<th className="p-3">Current</th>
<th className="p-3">Previous</th>
<th className="p-3">Change %</th>
<th className="p-3">Unit</th>
<th className="p-3">Next Release</th>
<th className="p-3">Frequency</th>
<th className="p-3">Source</th>
<th className="p-3">Updated</th>
<th className="p-3">Status</th>
<th className="p-3">Save</th>
</tr>

</thead>

<tbody>

{filtered.map(row=>(

<tr
key={row.id}
className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors"
>

<td className="p-3 font-medium whitespace-nowrap">
{row.indicator}
</td>

<td className="p-3">
<input
value={row.current}
onChange={e=>updateField(row.id,"current",e.target.value)}
className="w-24 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 outline-none focus:border-blue-500"
/>
</td>

<td className="p-3 text-center text-zinc-400">
{row.previous||"-"}
</td>

<td className="p-3 text-center font-semibold">
{calcChange(row.current,row.previous)}
</td>

<td className="p-3 text-center">
{row.unit}
</td>

<td className="p-3">
<input
type="date"
value={row.nextRelease}
onChange={e=>updateField(row.id,"nextRelease",e.target.value)}
className="rounded border border-zinc-700 bg-zinc-950 px-2 py-1 outline-none focus:border-blue-500"
/>
</td>

<td className="p-3 text-center">
{row.frequency}
</td>

<td className="p-3 text-center">
{row.source}
</td>

<td className="p-3 text-center text-zinc-400">
{row.updatedAt}
</td>

<td className="p-3 text-center">

<span
className={
row.status==="Updated"
?"rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400"
:row.status==="Pending"
?"rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400"
:row.status==="Due"
?"rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400"
:"rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400"
}
>
{row.status}
</span>

</td>

<td className="p-3 text-center">

<button
onClick={()=>saveRow(row.id)}
className="rounded-lg bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700 transition-colors"
>
Save
</button>

</td>

</tr>

))}


</tbody>

</table>

</div>

</div>

);

}












