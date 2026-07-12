import { NextRequest, NextResponse } from "next/server";

import { getHistory } from "@/institutional-analysis/repository/historyRepository";

import { detectSwingHighs } from "@/institutional-analysis/engine/priceStructure/detectSwingHighs";
import { detectSwingLows } from "@/institutional-analysis/engine/priceStructure/detectSwingLows";
import { mergeSwings } from "@/institutional-analysis/engine/priceStructure/mergeSwings";
import { classifyStructure } from "@/institutional-analysis/engine/priceStructure/classifyStructure";
import { structureIntegrity } from "@/institutional-analysis/engine/priceStructure/structureIntegrity";
import { trendPhase } from "@/institutional-analysis/engine/priceStructure/trendPhase";
import { trendStrength } from "@/institutional-analysis/engine/priceStructure/trendStrength";
import { trendConfidence } from "@/institutional-analysis/engine/priceStructure/trendConfidence";

export async function GET(request: NextRequest) {

  try {

    const symbol =
      request.nextUrl.searchParams.get("symbol");

    if (!symbol) {

      return NextResponse.json(
        {
          success:false,
          error:"Missing symbol"
        },
        {
          status:400
        }
      );

    }

    const candles =
      await getHistory(
        symbol.toUpperCase()
      );

    if(candles.length===0){

      return NextResponse.json(
        {
          success:false,
          error:"No history found"
        },
        {
          status:404
        }
      );

    }

    const swingHighs =
      detectSwingHighs(candles);

    const swingLows =
      detectSwingLows(candles);

    const swings =
      mergeSwings(
        swingHighs,
        swingLows
      );

    const structure =
      classifyStructure(swings);

    const lastClose =
      candles[candles.length-1].close;

    const integrity =
      structureIntegrity(
        structure.structure,
        lastClose,
        structure.lastHigherLow,
        structure.lastLowerHigh
      );

    const phase =
      trendPhase(
        structure.structure,
        integrity.intact,
        structure.higherHighs,
        structure.higherLows,
        structure.lowerHighs,
        structure.lowerLows
      );

    const strength =
      trendStrength(
        structure.higherHighs,
        structure.higherLows,
        structure.lowerHighs,
        structure.lowerLows,
        integrity.intact
      );

    const confidence =
      trendConfidence(
        strength,
        integrity.intact,
        phase
      );

    return NextResponse.json({

      success:true,

      symbol,

      candlesLoaded:candles.length,

      swingHighs:swingHighs.length,

      swingLows:swingLows.length,

      structure,

      integrity,

      phase,

      strength,

      confidence

    });

  }
  catch(e:any){

    console.error(e);

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
