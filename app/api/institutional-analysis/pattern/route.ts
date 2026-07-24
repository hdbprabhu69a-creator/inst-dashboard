import { NextRequest, NextResponse } from "next/server";

import {
  analyzePattern,
} from "@/lib/pattern/patternEngine";

import {
  getHistory,
} from "@/lib/history/historyRepository";


export async function GET(
  req: NextRequest
){

  try {

    const symbol =
      req.nextUrl.searchParams.get(
        "symbol"
      );


    if(!symbol){

      return NextResponse.json({

        success:false,

        error:"Symbol required"

      });

    }


    const candles =
      await getHistory(
        symbol
      );


    if(
      !candles ||
      candles.length < 20
    ){

      return NextResponse.json({

        success:false,

        error:"Insufficient candle history"

      });

    }


    const pattern =
      analyzePattern(
        candles
      );


    return NextResponse.json({

      success:true,

      symbol,

      data:pattern

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
