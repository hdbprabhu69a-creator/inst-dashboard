"use client";

import {useEffect,useMemo,useState} from "react";
import {Search} from "lucide-react";
import {collection,onSnapshot,orderBy,query} from "firebase/firestore";
import {db} from "@/lib/firebase";
import NewsTable from "@/components/news/NewsTable";

const COMMODITY_LIST=[
"All",
"Agri",
"Gold",
"Silver",
"Crude",
"Copper",
"Zinc",
"Tin"
];

const TABS=[
"All",
"Macro",
"RBI",
"Policy",
"Commodity",
"Global",
"Corporate",
"Economy"
];

export default function NewsPage(){

    const [rows,setRows]=useState<any[]>([]);
    const [tab,setTab]=useState("All");
const [commodity,setCommodity]=useState("All");
    const [search,setSearch]=useState("");

    useEffect(()=>{

        const q=query(

            collection(db,"news"),

            orderBy("createdAt","desc")

        );

        const unsubscribe=onSnapshot(q,(snapshot)=>{

            setRows(

                snapshot.docs.map(doc=>({

                    id:doc.id,

                    ...doc.data()

                }))

            );

        });

        return()=>unsubscribe();

    },[]);

    const filtered=useMemo(()=>{

        return rows.filter(r=>{

            const matchTab=

                tab==="All"

                ||

                (r.category||"").toLowerCase()===tab.toLowerCase();

            const matchSearch=

                (r.title||"")

                .toLowerCase()

                .includes(search.toLowerCase());

            const matchCommodity=

tab!=="Commodity"

||

commodity==="All"

||

(r.subCategory||"").toLowerCase()===commodity.toLowerCase();

return matchTab && matchCommodity && matchSearch;

        });

    },[rows,tab,search]);

    return(

        <main className="min-h-screen bg-zinc-950 p-6 space-y-5">

            <div className="flex items-center flex-wrap gap-2 border-b border-zinc-800 pb-3">

                <button className="rounded-lg bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-sky-400 transition"><Search size={18}/></button>
{TABS.map(item=>{

    if(item==="Commodity"){

        return(

            <select
                key="Commodity"
                value={commodity}
                onChange={e=>{
                    setCommodity(e.target.value);
                    setTab("Commodity");
                }}
                className={
                    "rounded-lg px-4 py-2 text-sm border-0 outline-none cursor-pointer transition "+
                    (
                        tab==="Commodity"
                        ?"bg-sky-600 text-zinc-100"
                        :"bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                    )
                }
            >

                {COMMODITY_LIST.map(c=>(

                    <option
                        key={c}
                        value={c}
                    >
                        {c==="All"?"Commodity":c}
                    </option>

                ))}

            </select>

        );

    }

    return(

        <button
            key={item}
            onClick={()=>setTab(item)}
            className={
                "rounded-lg px-4 py-2 text-sm transition "+
                (
                    tab===item
                    ?"bg-sky-600 text-zinc-100"
                    :"bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                )
            }
        >

            {item}

        </button>

    );

})}
            </div>

            <NewsTable rows={filtered}/>

        </main>

    );

}













