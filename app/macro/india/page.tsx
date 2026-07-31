"use client";

import {useEffect,useMemo,useState} from "react";

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

export default function IndiaMacroDashboard(){

    const [rows,setRows]=useState<MacroRow[]>([]);
    const [search,setSearch]=useState("");

    useEffect(()=>{

        fetch("/api/macro/india")
            .then(r=>r.json())
            .then(setRows);

    },[]);

    const filtered=useMemo(()=>{

        return rows.filter(r=>

            r.indicator.toLowerCase().includes(search.toLowerCase())

        );

    },[rows,search]);

    function calc(current:string,previous:string){

        const c=parseFloat(current);
        const p=parseFloat(previous);

        if(isNaN(c)||isNaN(p)||p===0) return "-";

        const pct=((c-p)/p)*100;

        return (pct>0?"+":"")+pct.toFixed(2)+"%";

    }

    return(

    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-8">

        

        <input

            value={search}

            onChange={e=>setSearch(e.target.value)}

            placeholder="Search Indicator..."

            className="mb-6 w-96 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder:text-zinc-600 text-zinc-400 uppercase text-xs tracking-widest px-4 py-2 outline-none"

        />

        <div className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-950">

            <table className="min-w-full text-sm">

                <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-widest">

                    <tr>

                        <th className="p-3 text-left">Indicator</th>
                        <th className="p-3 text-center">Current</th>
                        <th className="p-3 text-center">Previous</th>
                        <th className="p-3 text-center">Change %</th>
                        <th className="p-3 text-center">Unit</th>
                        <th className="p-3 text-center">Next Release</th>
                        
                        
                        <th className="p-3 text-center">Updated</th>

                    </tr>

                </thead>

                <tbody>

                {filtered.map(row=>(

                    <tr
                        key={row.id}
                        className="border-t border-zinc-800 odd:bg-zinc-950 even:bg-zinc-900/40 hover:bg-sky-950/20 transition-all duration-200"
                    >

                        <td className="p-3 font-medium text-sky-300 tracking-wide">

                            {row.indicator}

                        </td>

                        <td className="p-3 text-center font-semibold text-lg">

                            {row.current||"-"}

                        </td>

                        <td className="p-3 text-center font-semibold text-lg">

                            {row.previous||"-"}

                        </td>

                        <td className={
                            "p-3 text-center font-semibold "+
                            (
                                calc(row.current,row.previous).startsWith("+")
                                ?"text-green-400"
                                :calc(row.current,row.previous).startsWith("-")
                                ?"text-red-400"
                                :"text-zinc-400"
                            )
                        }>

                            {calc(row.current,row.previous)}

                        </td>

                        <td className="p-3 text-center font-semibold text-lg">

                            {row.unit}

                        </td>

                        <td className="p-3 text-center font-semibold text-lg">

                            {row.nextRelease||"-"}

                        </td>

                        

                        

                        <td className="p-3 text-center font-semibold text-lg">

                            {row.updatedAt}

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

    </div>

    );

}















