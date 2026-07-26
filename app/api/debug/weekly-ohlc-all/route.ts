import { NextResponse } from "next/server";

import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { getCachedAccessToken } from "@/lib/kite/tokenCache";

import {
  loadInstrumentMap,
  getDailyCandles,
} from "@/src/lib/kiteData";

import {
  buildWeeklyStructure,
} from "@/src/lib/marketStructureEngine";


export async function GET(){

try{

  const accessToken =
    await getCachedAccessToken();

  if(!accessToken){

    return NextResponse.json({
      success:false,
      error:"No Access Token"
    });

  }


  const kite =
    new KiteConnect({

      api_key:
        process.env.KITE_API_KEY!

    });


  kite.setAccessToken(accessToken);


  const instrumentMap =
    await loadInstrumentMap();


  const snapshot =
    await getDocs(
      collection(
        db,
        "universe"
      )
    );


  const output:any[]=[];


  for(const docSnap of snapshot.docs){

    const stock =
      docSnap.data();


    const token =
      instrumentMap.get(
        stock.kiteSymbol
      );


    if(!token)
      continue;


    try{

      const candles =
        await getDailyCandles(
          kite,
          Number(token)
        );


      const weekly =
        buildWeeklyStructure(
          candles,
          new Date()
        );


      output.push({

        symbol:
          stock.symbol,

        weeklyOHLC:
          weekly?.weeklyOHLC,

        weeklyPivot:
          weekly?.weeklyPivot,

        candleCount:
          weekly?.weeklyCandles?.length

      });


    }catch(error:any){

      output.push({

        symbol:
          stock.symbol,

        error:
          error.message

      });

    }

  }


  return NextResponse.json({

    success:true,

    total:
      output.length,

    data:
      output

  });


}catch(error:any){

  console.error(
    "WEEKLY DEBUG ERROR",
    error
  );


  return NextResponse.json({

    success:false,

    error:
      error.message

  },
  {
    status:500
  });

}


}