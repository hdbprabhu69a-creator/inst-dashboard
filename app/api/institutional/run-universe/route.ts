import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import { getHistory } from "@/institutional-analysis/repository/historyRepository";

import { detectSwingHighs } from "@/institutional-analysis/engine/priceStructure/detectSwingHighs";
import { detectSwingLows } from "@/institutional-analysis/engine/priceStructure/detectSwingLows";
import { mergeSwings } from "@/institutional-analysis/engine/priceStructure/mergeSwings";
import { classifyStructure } from "@/institutional-analysis/engine/priceStructure/classifyStructure";
import { structureIntegrity } from "@/institutional-analysis/engine/priceStructure/structureIntegrity";
import { trendPhase } from "@/institutional-analysis/engine/priceStructure/trendPhase";
import { trendStrength } from "@/institutional-analysis/engine/priceStructure/trendStrength";
import { trendConfidence } from "@/institutional-analysis/engine/priceStructure/trendConfidence";

export async function GET(){

  try{

    const universe = await getUniverse();

    const rows:any[]=[];

    for(const stock of universe){

      try{

        const candles = await getHistory(stock.symbol);

        if(candles.length < 30)
          continue;

        const highs = detectSwingHighs(candles);
        const lows  = detectSwingLows(candles);

        const swings = mergeSwings(highs,lows);

        const structure = classifyStructure(swings);

        const integrity = structureIntegrity(
          structure.structure,
          candles.at(-1)!.close,
          structure.lastHigherLow,
          structure.lastLowerHigh
        );

        const phase = trendPhase(
          structure.structure,
          integrity.intact,
          structure.higherHighs,
          structure.higherLows,
          structure.lowerHighs,
          structure.lowerLows
        );

        const strength = trendStrength(
          structure.higherHighs,
          structure.higherLows,
          structure.lowerHighs,
          structure.lowerLows,
          integrity.intact
        );

        const confidence = trendConfidence(
          strength,
          integrity.intact,
          phase
        );

        rows.push({

          symbol: stock.symbol,

          score: strength.score,

          higherHighs: structure.higherHighs,

          higherLows: structure.higherLows,

          lowerHighs: structure.lowerHighs,

          lowerLows: structure.lowerLows,

          structure: structure.structure,

          phase,

          integrity: integrity.intact,

          trendStrength: strength.score,

trendline:"-",

trendlineTouches:0,

buyZone:false,

risk:"-",

          verdict:
            strength.score>=80 ? "BUY" :
            strength.score>=60 ? "ACC" :
            strength.score>=40 ? "WATCH" :
            "AVOID",

          confidence: confidence.score

        });

      }
      catch{

      }

    }

    rows.sort((a,b)=>b.score-a.score);

    rows.forEach((r,i)=>{
      r.rank=i+1;
    });

    return NextResponse.json({

      success:true,

      total:rows.length,

      rows

    });

  }
  catch(e:any){

    return NextResponse.json({

      success:false,

      error:e.message

    },{

      status:500

    });

  }

}


