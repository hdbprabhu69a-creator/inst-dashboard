"use client";

import { useEffect, useState } from "react";

interface SectorRow{
  sector:string;
  token:string;
  lastPrice:number;
  previousClose:number;
  change:number;
  changePercent:number;
  direction:"UP"|"DOWN";
  strength:"STRONG"|"POSITIVE"|"WEAK"|"VERY_WEAK"|"UNKNOWN";
  rank:number;
}

export default function SectorPerformance(){

  const [rows,setRows]=useState<SectorRow[]>([]);
  const [loading,setLoading]=useState(true);

  async function load(){

    try{

      const res=await fetch("/api/kite/sector-indices",{
        cache:"no-store"
      });

      const json=await res.json();

      setRows(json.data??[]);

    }

    catch(e){

      console.error(e);

    }

    finally{

      setLoading(false);

    }

  }

  useEffect(()=>{

    load();

    const id=setInterval(load,30000);

    return()=>clearInterval(id);

  },[]);

  if(loading){

    return(

      <div className="flex h-full items-center justify-center text-zinc-500">

        Loading sectors...

      </div>

    );

  }

  return(

    <div>

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-amber-200">
            SECTOR PERFORMANCE
          </h2>

          <p className="text-xs text-zinc-500">
            Live Institutional Rotation
          </p>

        </div>

        <div className="rounded bg-emerald-900/40 px-2 py-1 text-xs font-semibold text-emerald-400">
          LIVE
        </div>

      </div>

      <div className="space-y-3">

        {rows.map(row=>{

          const width=Math.min(
            Math.abs(row.changePercent)*35,
            100
          );

          return(

            <div
              key={row.token}
              className="grid grid-cols-[36px_120px_90px_110px_1fr] items-center gap-3"
            >

              <div className="text-center text-xs font-bold text-zinc-500">

                #{row.rank}

              </div>

              <div className="font-semibold text-zinc-200">

                {row.sector}

              </div>

              <div className={row.direction==="UP"
                ?"font-bold text-emerald-400"
                :"font-bold text-red-400"}>

                {row.changePercent>0?"+":""}
                {row.changePercent.toFixed(2)}%

              </div>

              <div>

                <span className={
                  row.strength==="STRONG"
                  ?"rounded bg-emerald-700/30 px-2 py-1 text-xs text-emerald-300":
                  row.strength==="POSITIVE"
                  ?"rounded bg-green-700/30 px-2 py-1 text-xs text-green-300":
                  row.strength==="WEAK"
                  ?"rounded bg-yellow-700/30 px-2 py-1 text-xs text-yellow-300":
                  "rounded bg-red-700/30 px-2 py-1 text-xs text-red-300"
                }>

                  {row.strength.replace("_"," ")}

                </span>

              </div>

              <div className="h-4 overflow-hidden rounded bg-[#111827]">

                <div
                  className={
                    row.direction==="UP"
                    ?"h-full rounded bg-gradient-to-r from-green-700 to-green-400"
                    :"h-full rounded bg-gradient-to-r from-red-700 to-red-400"
                  }
                  style={{
                    width:`${width}%`
                  }}
                />

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}
