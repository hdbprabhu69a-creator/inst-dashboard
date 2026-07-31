import { NextRequest, NextResponse } from "next/server";

import { getHistory } from "@/institutional-analysis/repository/historyRepository";
import { detectSwingHighs } from "@/institutional-analysis/engine/priceStructure/detectSwingHighs";

export async function GET(request: NextRequest) {

  try {

    const symbol =
      request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { success:false, error:"Missing symbol" },
        { status:400 }
      );
    }

    const candles =
      await getHistory(symbol);

    const swings =
      detectSwingHighs(candles);

    return NextResponse.json({

      success:true,

      symbol,

      candlesLoaded:candles.length,

      swingHighCount:swings.length,

      swingHighs:swings.slice(-10)

    });

  } catch(e:any) {

    return NextResponse.json(
      {
        success:false,
        error:e.message
      },
      {
        status:500
      }
    );

  }

}

