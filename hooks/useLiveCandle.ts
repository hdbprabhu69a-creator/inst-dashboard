"use client";

import { useEffect,useState } from "react";
import { getLiveCandle } from "@/lib/liveChart/liveCandleStore";

export function useLiveCandle(){
  const [candle,setCandle]=useState(getLiveCandle());

  useEffect(()=>{
    const id=setInterval(()=>setCandle(getLiveCandle()),500);
    return ()=>clearInterval(id);
  },[]);

  return candle;
}
