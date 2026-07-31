import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import { getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";
import { getPivotPosition } from "@/institutional-analysis/engine/pivot/positionEngine";
import { getPivotAlignment } from "@/institutional-analysis/engine/pivot/alignmentEngine";
import { getPivotBias } from "@/institutional-analysis/engine/pivot/biasEngine";
import { getPivotScore } from "@/institutional-analysis/engine/pivot/scoreEngine";
import { getPivotVerdict } from "@/institutional-analysis/engine/pivot/verdictEngine";

export async function GET(){

  try{

    const universe=await getUniverse();
    const rows:any[]=[];

    for(const stock of universe){

      if(!stock.symbol) continue;

      const ms=await getMarketStructure(stock.symbol);
      if(!ms) continue;

      const cmp=ms.cmp ?? ms.dailyOHLC?.close ?? null;

      const dailyPosition=getPivotPosition(cmp,ms.dailyPivot);
      const weeklyPosition=getPivotPosition(cmp,ms.weeklyPivot);
      const monthlyPosition=getPivotPosition(cmp,ms.monthlyPivot);

      const alignment=getPivotAlignment(
        dailyPosition,
        weeklyPosition,
        monthlyPosition
      );

      const bias=getPivotBias(cmp,ms.dailyPivot);

      const score=getPivotScore(
        dailyPosition,
        weeklyPosition,
        monthlyPosition,
        alignment
      );

      const verdict=getPivotVerdict(score);

      const row={

        symbol:stock.symbol,

        cmp,

        dailyValue:ms.dailyPivot?.pivot ?? null,
        dailyR1:ms.dailyPivot?.r1 ?? null,
        dailyR2:ms.dailyPivot?.r2 ?? null,
        dailyS1:ms.dailyPivot?.s1 ?? null,
        dailyS2:ms.dailyPivot?.s2 ?? null,

        weeklyValue:ms.weeklyPivot?.pivot ?? null,
        weeklyR1:ms.weeklyPivot?.r1 ?? null,
        weeklyR2:ms.weeklyPivot?.r2 ?? null,
        weeklyS1:ms.weeklyPivot?.s1 ?? null,
        weeklyS2:ms.weeklyPivot?.s2 ?? null,

        monthlyValue:ms.monthlyPivot?.pivot ?? null,
        monthlyR1:ms.monthlyPivot?.r1 ?? null,
        monthlyR2:ms.monthlyPivot?.r2 ?? null,
        monthlyS1:ms.monthlyPivot?.s1 ?? null,
        monthlyS2:ms.monthlyPivot?.s2 ?? null,

        alignment,
        bias,
        score,
        verdict

      };

      rows.push(row);


    }

    rows.sort((a,b)=>a.symbol.localeCompare(b.symbol));

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


