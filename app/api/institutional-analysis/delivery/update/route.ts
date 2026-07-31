import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import {
  updateEngine
} from "@/institutional-analysis/repository/marketStructureRepository";
import {
  getDeliveryAnalysis
} from "@/institutional-analysis/repository/deliveryAnalysisRepository";

export async function GET(){

  try{

    const universe=await getUniverse();

    let updated=0;
    let skipped=0;

    const rows:any[]=[];

    for(const stock of universe){

      if(!stock.symbol){
        skipped++;
        continue;
      }

      const analysis=await getDeliveryAnalysis(stock.symbol);

      if(!analysis){
        skipped++;
        continue;
      }

      await updateEngine(
        stock.symbol,
        "delivery",
        analysis
      );

      rows.push({

        symbol:stock.symbol,

        composite:analysis.scores.composite.value,

        institutional:analysis.scores.institutional.value,

        trend:analysis.trend.classification,

        signal:analysis.signals.signal,

        confidence:analysis.scores.confidence.value

      });

      updated++;

    }

    rows.sort(
      (a,b)=>a.symbol.localeCompare(b.symbol)
    );

    return NextResponse.json({

      success:true,

      updated,

      skipped,

      total:universe.length,

      data:rows

    });

  }catch(e:any){

    return NextResponse.json({

      success:false,

      error:e.message

    },{
      status:500
    });

  }

}

