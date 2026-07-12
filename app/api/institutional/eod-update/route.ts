import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import { updateEngine,getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";
import { analyzeCPR } from "@/institutional-analysis/engine/cpr/cprAnalysisEngine";
import { getPivotPosition } from "@/institutional-analysis/engine/pivot/positionEngine";
import { getPivotBias } from "@/institutional-analysis/engine/pivot/biasEngine";
import { getPivotAlignment } from "@/institutional-analysis/engine/pivot/alignmentEngine";
import { getPivotScore } from "@/institutional-analysis/engine/pivot/scoreEngine";
import { getPivotVerdict } from "@/institutional-analysis/engine/pivot/verdictEngine";
import { trendStrength } from "@/institutional-analysis/engine/priceStructure/trendStrength";
import { trendPhase } from "@/institutional-analysis/engine/priceStructure/trendPhase";
import { trendConfidence } from "@/institutional-analysis/engine/priceStructure/trendConfidence";

export async function GET(){

  const results:any[]=[];

  try{

    const universe=await getUniverse();

    for(const stock of universe){

      const symbol=stock.symbol;

      try{

        const data=await getMarketStructure(symbol);

if(data){

  const cpr=analyzeCPR(data);

  await updateEngine(
    symbol,
    "cpr",
    cpr
  );


  const dailyPosition=getPivotPosition(
    data.cmp,
    data.dailyPivot
  );

  const weeklyPosition=getPivotPosition(
    data.cmp,
    data.weeklyPivot
  );

  const monthlyPosition=getPivotPosition(
    data.cmp,
    data.monthlyPivot
  );

  const pivotBias=getPivotBias(
    data.cmp,
    data.dailyPivot
  );

  const pivotAlignment=getPivotAlignment(
    dailyPosition,
    weeklyPosition,
    monthlyPosition
  );

  const pivotScore=getPivotScore(
    dailyPosition,
    weeklyPosition,
    monthlyPosition,
    pivotAlignment
  );

  const pivot={
    dailyPosition,
    weeklyPosition,
    monthlyPosition,
    bias:pivotBias,
    alignment:pivotAlignment,
    score:pivotScore,
    verdict:getPivotVerdict(pivotScore),
    updatedAt:new Date().toISOString()
  };

  await updateEngine(
    symbol,
    "pivot",
    pivot
  );


  const strength=trendStrength(
    data.higherHighs ?? 0,
    data.higherLows ?? 0,
    data.lowerHighs ?? 0,
    data.lowerLows ?? 0,
    data.integrity ?? false
  );

  const phase=trendPhase(
    data.structure ?? "SIDEWAYS",
    data.integrity ?? false,
    data.higherHighs ?? 0,
    data.higherLows ?? 0,
    data.lowerHighs ?? 0,
    data.lowerLows ?? 0
  );

  const confidence=trendConfidence(
    strength,
    data.integrity ?? false,
    phase
  );

  const trend={
    strength,
    phase,
    confidence,
    updatedAt:new Date().toISOString()
  };

  await updateEngine(
    symbol,
    "trend",
    trend
  );

}

        results.push({
          symbol,
          status:"updated"
        });

      }catch(e){

        results.push({
          symbol,
          status:"failed",
          error:String(e)
        });

      }

    }

    return NextResponse.json({
      success:true,
      count:results.length,
      results
    });

  }catch(e){

    return NextResponse.json(
      {
        success:false,
        error:String(e)
      },
      {
        status:500
      }
    );

  }

}




