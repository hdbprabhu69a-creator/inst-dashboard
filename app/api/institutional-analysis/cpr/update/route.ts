import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import {
  getMarketStructure,
  updateEngine
} from "@/institutional-analysis/repository/marketStructureRepository";

import { analyzeCPR } from "@/institutional-analysis/engine/cpr/cprAnalysisEngine";

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

      const ms=await getMarketStructure(stock.symbol);

      if(!ms){
        skipped++;
        continue;
      }

      const cpr=analyzeCPR(ms);

      await updateEngine(
        stock.symbol,
        "cpr",
        cpr
      );

      rows.push({

        symbol:stock.symbol,

        score:cpr.score,

        verdict:cpr.verdict,

        bias:cpr.bias.bias,

        alignment:cpr.alignment.alignment,

        width:cpr.width.width,

        widthPct:cpr.width.widthPct,

        relationship:cpr.relationship

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

