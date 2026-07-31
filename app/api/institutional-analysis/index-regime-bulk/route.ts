import { NextResponse } from "next/server";

import {
  getDocs,
  collection,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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


const INDEX_SYMBOL_MAP: Record<string,string> = {

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


async function getKite(){

  const tokenDoc =
    await adminDb
      .collection("settings")
      .doc("kite")
      .get();


  if(!tokenDoc.exists)
    return null;


  const accessToken =
    tokenDoc.data()
      ?.accessToken;


  if(!accessToken)
    return null;


  const kite =
    new KiteConnect({

      api_key:
        process.env.KITE_API_KEY!

    });


  kite.setAccessToken(
    accessToken
  );


  return kite;

}



export async function GET(){

try{


const snapshot =
  await getDocs(
    collection(
      db,
      "universe_indices"
    )
  );


const symbols =
  snapshot.docs
  .map(
    d =>
      d.data().symbol
  )
  .filter(Boolean);



const kite =
  await getKite();



let quotes:any = {};


if(kite){

 const instruments =
   symbols.map(
    s =>
     INDEX_SYMBOL_MAP[s]
     ??
     `NSE:${s}`
   );


 const quote =
   await kite.getQuote(
     instruments
   );


 quotes =
   quote;

}



const results:any[]=[];


for(const symbol of symbols){


 const candles =
   await getIndexHistory(
     symbol
   );


 const instrument =
   INDEX_SYMBOL_MAP[symbol]
   ??
   `NSE:${symbol}`;


 const liveCmp =
   Number(
     quotes[instrument]
       ?.last_price
       ??
       0
   );



 const data =
   analyzeIndexRegime(
     candles,
     liveCmp
   );



 results.push({

   symbol,

   candles:
     candles.length,

   data

 });


}



return NextResponse.json({

 success:true,

 total:
   results.length,

 indices:
   results

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
