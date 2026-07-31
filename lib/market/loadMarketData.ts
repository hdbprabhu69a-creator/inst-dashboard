import { KiteConnect } from "kiteconnect";

import {
  getDailyCandles,
} from "@/src/lib/kiteData";

import {
  getCompletedDailyCandle,
} from "@/src/lib/eodEngine";

export async function loadMarketData(

  kite:KiteConnect,

  instrumentToken:number,

){

  const candles=
    await getDailyCandles(
      kite,
      instrumentToken
    );

  if(
    !candles ||
    candles.length<50
  ){
    return null;
  }

  const lastCandle=
    getCompletedDailyCandle(
      candles
    );

  if(!lastCandle){
    return null;
  }

  return{

    candles,

    lastCandle,

  };

}

