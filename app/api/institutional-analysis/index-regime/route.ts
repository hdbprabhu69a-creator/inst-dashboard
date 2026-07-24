import { NextRequest, NextResponse } from "next/server";

import {
  getIndexHistory,
} from "@/lib/history/indexHistoryRepository";

import {
  analyzeIndexRegime,
} from "@/lib/institutional/indexRegimeEngine";


function calculateTrend(
  candles:any[]
){

  if(candles.length < 50)
    return {
      trend:"INSUFFICIENT_DATA",
      strength:0,
      phase:"UNKNOWN"
    };


  const recent =
    candles.slice(-50);


  const first =
    recent[0].close;

  const last =
    recent[recent.length-1].close;


  const change =
    ((last-first)/first)*100;


  let trend =
    "SIDEWAYS";


  if(change > 3)
    trend="UPTREND";


  if(change < -3)
    trend="DOWNTREND";


  const strength =
    Math.min(
      Math.abs(change)*20,
      100
    );


  let phase =
    "CONSOLIDATION";


  if(trend==="UPTREND")
    phase="ACCUMULATION";


  if(trend==="DOWNTREND")
    phase="DISTRIBUTION";


  return {

    trend,

    strength:
      Number(
        strength.toFixed(2)
      ),

    phase,

    change:
      Number(
        change.toFixed(2)
      )

  };

}



export async function GET(
  req:NextRequest
){

 try{

   const symbol =
     req.nextUrl.searchParams.get(
       "symbol"
     );


   if(!symbol){

     return NextResponse.json({

       success:false,

       error:"symbol required"

     });

   }


   const candles =
     await getIndexHistory(
       symbol
     );


   const regime =
     analyzeIndexRegime(
       candles
     );


   return NextResponse.json({

     success:true,

     symbol,

     candles:
       candles.length,

     data:regime

   });


 }
 catch(error:any){

   return NextResponse.json({

     success:false,

     error:error.message

   },{
     status:500
   });

 }

}


