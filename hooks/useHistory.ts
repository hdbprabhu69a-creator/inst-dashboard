"use client";

import { useEffect, useState } from "react";
import { getHistory } from "@/lib/history/historyService";

export function useHistory(symbol:string){
  const [candles,setCandles]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    if(!symbol) return;

    setLoading(true);

    getHistory(symbol)
      .then(setCandles)
      .finally(()=>setLoading(false));

  },[symbol]);

  return {candles,loading};
}
