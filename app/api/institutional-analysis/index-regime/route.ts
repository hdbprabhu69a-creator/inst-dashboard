import { NextRequest, NextResponse } from "next/server";

import {
  getIndexHistory,
} from "@/lib/history/indexHistoryRepository";

import {
  analyzeIndexRegime,
} from "@/lib/institutional/indexRegimeEngine";

import {
  KiteConnect,
} from "kiteconnect";

import {
  adminDb,
} from "@/lib/firebase-admin";


const INDEX_SYMBOL_MAP:Record<string,string> = {

  NIFTY:
    "NSE:NIFTY 50",

  BANKNIFTY:
    "NSE:NIFTY BANK",

  FINNIFTY:
    "NSE:NIFTY FIN SERVICE",

  MIDCPNIFTY:
    "NSE:NIFTY MID SELECT",

  NIFTYNXT50:
    "NSE:NIFTY NEXT 50",

};



async function getLivePrice(
  symbol:string
){

  const tokenDoc =
    await adminDb
      .collection("settings")
      .doc("kite")
      .get();


  if(!tokenDoc.exists)
    return 0;


  const tokenData =
    tokenDoc.data();


  const accessToken =
    tokenData?.accessToken;


  if(!accessToken)
    return 0;


  const kite =
    new KiteConnect({

      api_key:
        process.env.KITE_API_KEY!

    });


  kite.setAccessToken(
    accessToken
  );


  const instrument =
    INDEX_SYMBOL_MAP[symbol]
    ??
    `NSE:${symbol}`;


  const quote =
    await kite.getQuote([
      instrument
    ]);


  return Number(
    quote[instrument]
      ?.last_price
      ??
      0
  );

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


   const cleanSymbol =
     symbol.toUpperCase();



   const candles =
     await getIndexHistory(
       cleanSymbol
     );



   const liveCmp =
     await getLivePrice(
       cleanSymbol
     );



   const data =
     analyzeIndexRegime(
       candles,
       liveCmp
     );



   return NextResponse.json({

     success:true,

     symbol:
       cleanSymbol,

     liveCmp,

     candles:
       candles.length,

     data

   });


 }
 catch(error:any){

   return NextResponse.json({

     success:false,

     error:
       error.message

   },{
     status:500
   });

 }

}