import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/institutional-analysis/repository/historyRepository";

export async function GET(request: NextRequest) {

  try {

    const symbol =
      request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing symbol"
        },
        {
          status: 400
        }
      );
    }

    const candles =
      await getHistory(symbol);

    return NextResponse.json({

      success: true,

      symbol,

      candlesLoaded: candles.length,

      firstDate: candles.at(0)?.date ?? null,

      lastDate: candles.at(-1)?.date ?? null,

      sample: candles.slice(0,5)

    });

  } catch (e:any) {

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
