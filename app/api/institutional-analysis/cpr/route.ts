import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import { getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";
import { analyzeCPR } from "@/institutional-analysis/engine/cpr/cprAnalysisEngine";

export async function GET(){

  try{

    const universe=await getUniverse();

    const rows:any[]=[];

    for(const stock of universe){

      if(!stock.symbol) continue;

      const ms=await getMarketStructure(stock.symbol);

      if(!ms) continue;

      const cmp=ms.cmp ?? ms.dailyOHLC?.close ?? null;

      const cpr=analyzeCPR(ms);

      rows.push({

        symbol:stock.symbol,

        cmp,

        dailyBC:ms.dailyCPR?.bc ?? null,
        dailyPivot:ms.dailyCPR?.pivot ?? null,
        dailyTC:ms.dailyCPR?.tc ?? null,

        weeklyBC:ms.weeklyCPR?.bc ?? null,
        weeklyPivot:ms.weeklyCPR?.pivot ?? null,
        weeklyTC:ms.weeklyCPR?.tc ?? null,

        monthlyBC:ms.monthlyCPR?.bc ?? null,
        monthlyPivot:ms.monthlyCPR?.pivot ?? null,
        monthlyTC:ms.monthlyCPR?.tc ?? null,

        width:cpr.width.width,
        widthPct:cpr.width.widthPct,
        widthClass:cpr.width.widthClass,

        relationship:cpr.relationship,

        virgin:cpr.virgin,

        opening:cpr.opening,

        position:cpr.position,

        breakout:cpr.breakout.state,

        compression:cpr.compression.state,

        acceptance:cpr.acceptance.state,

        rejection:cpr.rejection.state,

        gap:cpr.gap.state,

        probability:cpr.probability.verdict,

        bias:cpr.bias.bias,

        alignment:cpr.alignment.alignment,

        score:cpr.score,

        verdict:cpr.verdict

      });

    }

    rows.sort(
      (a,b)=>a.symbol.localeCompare(b.symbol)
    );

    return NextResponse.json({

      success:true,

      count:rows.length,

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
