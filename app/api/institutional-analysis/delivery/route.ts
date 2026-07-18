import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import { getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";
import { getDeliveryAnalysis } from "@/institutional-analysis/repository/deliveryAnalysisRepository";

export async function GET(){

  try{

    const universe=await getUniverse();

    const rows:any[]=[];

    let universeCount=0;
    let marketCount=0;
    let deliveryCount=0;

    for(const stock of universe){

      universeCount++;

      if(!stock.symbol) continue;

      const ms=await getMarketStructure(stock.symbol);

      if(!ms) continue;

      marketCount++;

      const delivery=await getDeliveryAnalysis(stock.symbol);

      if(!delivery) continue;

      deliveryCount++;

      rows.push({

        symbol:stock.symbol,

        cmp:ms.cmp ?? ms.dailyOHLC?.close ?? null,

        deliveryPercent:delivery.latestMetrics?.dailyDeliveryPercent ?? null,

        deliveryQty:delivery.latestMetrics?.deliveryQuantity ?? null,

        composite:delivery.scores.composite.value,

        institutional:delivery.scores.institutional.value,

        trendScore:delivery.scores.trend.value,

        confidence:delivery.scores.confidence.value,

        trend:delivery.trend.classification,

        signal:delivery.signals.signal,

        deliveryGrowth:delivery.latestMetrics?.deliveryGrowth,

        deliveryMomentum:delivery.latestMetrics?.deliveryMomentum,

        deliveryAcceleration:delivery.latestMetrics?.deliveryAcceleration,

        historicalPercentile:delivery.latestMetrics?.historicalPercentile,

        accumulation:delivery.detectorResults.find((d:any)=>d.detector==="ACCUMULATION")?.detected,

        distribution:delivery.detectorResults.find((d:any)=>d.detector==="DISTRIBUTION")?.detected,

        absorption:delivery.detectorResults.find((d:any)=>d.detector==="ABSORPTION")?.detected,

        smartMoneyEntry:delivery.detectorResults.find((d:any)=>d.detector==="SMART_MONEY_ENTRY")?.detected,

        smartMoneyExit:delivery.detectorResults.find((d:any)=>d.detector==="SMART_MONEY_EXIT")?.detected

      });

    }

    rows.sort((a,b)=>a.symbol.localeCompare(b.symbol));

    return NextResponse.json({

      success:true,

      debug:{
        universe:universeCount,
        market:marketCount,
        delivery:deliveryCount
      },

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

