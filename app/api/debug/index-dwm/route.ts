import { NextResponse } from "next/server";

import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  loadInstrumentMap,
  getDailyCandles,
} from "@/src/lib/kiteData";

import {
  buildDailyStructure,
  buildWeeklyStructure,
  buildMonthlyStructure,
} from "@/src/lib/marketStructureEngine";

import {
  getCompletedDailyCandle,
} from "@/src/lib/eodEngine";

import {
  getCachedAccessToken,
} from "@/lib/kite/tokenCache";


export async function GET(){

const token =
 await getCachedAccessToken();


if(!token){

 return NextResponse.json({
  success:false,
  error:"No token"
 });

}


const kite =
 new KiteConnect({
  api_key:process.env.KITE_API_KEY!
 });


kite.setAccessToken(token);


const instrumentMap =
 await loadInstrumentMap();


const snap =
 await getDocs(
  collection(
   db,
   "universe_indices"
  )
 );


const result:any[]=[];


for(const doc of snap.docs){

 const index:any = doc.data();


 const instrumentToken =
  instrumentMap.get(
    index.kiteSymbol
  );


 if(!instrumentToken)
  continue;


 try{


 const candles =
 await getDailyCandles(
   kite,
   Number(instrumentToken)
 );


 const daily =
 buildDailyStructure(
   getCompletedDailyCandle(
    candles
   )
 );


 const weekly =
 buildWeeklyStructure(
   candles,
   new Date()
 );


 const monthly =
 buildMonthlyStructure(
   candles,
   new Date()
 );


 result.push({

  symbol:index.symbol,

  dailyOHLC:
   daily.dailyOHLC,

  dailyPivot:
   daily.dailyPivot,

  dailyCPR:
   daily.dailyCPR,


  weeklyOHLC:
   weekly?.weeklyOHLC,

  weeklyPivot:
   weekly?.weeklyPivot,

  weeklyCPR:
   weekly?.weeklyCPR,


  monthlyOHLC:
   monthly?.monthlyOHLC,

  monthlyPivot:
   monthly?.monthlyPivot,

  monthlyCPR:
   monthly?.monthlyCPR,


 });


 }
 catch(e){

 result.push({

 symbol:index.symbol,

 error:
 e instanceof Error
 ? e.message
 : "error"

 });

 }

}


return NextResponse.json({

 success:true,

 total:result.length,

 data:result

});


}