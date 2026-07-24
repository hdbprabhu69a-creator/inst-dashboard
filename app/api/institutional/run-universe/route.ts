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
import { analyzeTrend } from "@/institutional-analysis/engine/priceStructure/analyzeTrend";

export async function GET(){

  try{

    const universe = await getUniverse();

    const rows:any[]=[];

    for(const stock of universe){

      try{

        const candles = await getHistory(stock.symbol);

        if(candles.length < 30)
          continue;

        const trend=analyzeTrend(candles);

rows.push({

    symbol:stock.symbol,

    ...trend

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



