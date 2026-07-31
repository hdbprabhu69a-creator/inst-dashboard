"use client";

import { useEffect, useState } from "react";

interface MacroData {
  nifty:number;
  niftyChange:number;
  bankNifty:number;
  bankNiftyChange:number;
  indiaVix:number;
  indiaVixChange:number;
  nasdaqFut:number;
  nasdaqFutChange:number;
  spFut:number;
  spFutChange:number;
  crude:number;
  crudeChange:number;
  dxy:number;
  dxyChange:number;
  usdinr:number;
  usdinrChange:number;
  gold:number;
  goldChange:number;
  silver:number;
  silverChange:number;
}

export default function MacroStrip(){

  const [data,setData]=useState<MacroData|null>(null);

  async function loadData(){

    try{

      await fetch("/api/macro-refresh?t="+Date.now());

      const r=await fetch("/api/macro-dashboard?t="+Date.now());

      setData(await r.json());

    }catch(e){

      console.error(e);

    }

  }

  useEffect(()=>{

    loadData();

    const timer=setInterval(loadData,5000);

    return ()=>clearInterval(timer);

  },[]);

  if(!data) return null;

  const cards=[
    {title:"NIFTY",value:data.nifty.toFixed(0),change:data.niftyChange},
    {title:"BANK",value:data.bankNifty.toFixed(0),change:data.bankNiftyChange},
    {title:"VIX",value:data.indiaVix.toFixed(2),change:data.indiaVixChange},
    {title:"NQ FUT",value:data.nasdaqFut.toFixed(0),change:data.nasdaqFutChange},
    {title:"S&P FUT",value:data.spFut.toFixed(0),change:data.spFutChange},
    {title:"CRUDE",value:data.crude.toFixed(2),change:data.crudeChange},
    {title:"DXY",value:data.dxy.toFixed(2),change:data.dxyChange},
    {title:"USDINR",value:data.usdinr.toFixed(2),change:data.usdinrChange},
    {title:"GOLD",value:data.gold.toFixed(0),change:data.goldChange},
    {title:"SILVER",value:data.silver.toFixed(2),change:data.silverChange},
  ];

  return(

    <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

      {cards.map((card,index)=>(

        <div
          key={index}
          className="rounded-lg border border-[#26313c] bg-[#10161d] hover:bg-[#18222d] transition-colors px-2 py-2 min-h-[66px] flex flex-col justify-evenly gap-1"
        >

          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
            {card.title}
          </div>

          <div
            className={`text-[22px] font-bold leading-none ${
              card.change>=0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {card.value}
          </div>

          <div
            className={`text-[11px] font-semibold tracking-wide ${
              card.change>=0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {card.change>0?"+":""}
            {card.change.toFixed(2)}%
          </div>

        </div>

      ))}

    </div>

  );
}
























