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

    <div className="flex gap-[3px] overflow-x-auto pb-[2px]">

      {cards.map((card,index)=>(

        <div
          key={index}
          className="w-[78px] h-[44px] flex-shrink-0 bg-zinc-900 border border-zinc-800 rounded-[3px] px-1 py-[2px]"
        >

          <div className="text-[7px] uppercase text-zinc-500 leading-none">
            {card.title}
          </div>

          <div
            className={`text-[12px] font-semibold leading-none mt-[3px] ${
              card.change>=0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {card.value}
          </div>

          <div
            className={`text-[8px] leading-none mt-[2px] ${
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

