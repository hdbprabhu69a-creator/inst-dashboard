import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  getHistory,
} from "@/lib/history/historyRepository";

import {
  getLivePrice,
} from "@/lib/kite/getLivePrice";

import {
  analyzeIndex,
} from "@/lib/institutional/indexAnalysisEngine";

import {
  buildIndexDecision,
} from "@/lib/institutional/indexDecisionEngine";

import {
  volumeAnalysis,
} from "@/institutional-analysis/engine/volume/volumeAnalysis";

import {
  getDeliveryAnalysis,
} from "@/institutional-analysis/repository/deliveryAnalysisRepository";

export async function GET() {

  try {

    const snapshot = await getDocs(
      collection(
        db,
        "marketStructure"
      )
    );

    const data = [];

    for (const document of snapshot.docs) {

      const index =
        document.data();

      const symbol =
        index.symbol;


      const marketStructure = document.data();

      const cmp =
        await getLivePrice(
          symbol
        );

      const history =
        await getHistory(
          symbol
        );

      if (
        history.length === 0
      )
        continue;

            const analysis =
        analyzeIndex(
          history,
          cmp,
          marketStructure
        );

      const volume =
        volumeAnalysis(
          history
        );

      const delivery =
        await getDeliveryAnalysis(
          symbol
        );

      const decision =
        buildIndexDecision({

          symbol,

          cmp:
            analysis.cmp,

          trend:
            analysis.trend,

          regime:
            analysis.trend.regime,

          marketState:
            analysis.marketState,

          pivot:
            index.pivot,

          cpr:
            index.cpr,

          swing:
            index.swing,

          fib:
            index.fib,

         trendline:
  analysis.trendline ?? undefined,

channel:
  analysis.channel ?? undefined,
          baseTarget:
            analysis.baseTarget,

          volumeFlow:
            volume.volumeFlow,

          deliveryFlow:
            delivery
              ? {

                  current:
                    delivery.latestMetrics?.dailyDeliveryPercent ?? 0,

                  quantity:
                    delivery.latestMetrics?.deliveryQuantity ?? 0,

                  trend:
                    delivery.trend?.classification ?? "Unknown",

                  signal:
                    delivery.signals?.signal ?? "Neutral",

                  composite:
                    delivery.scores?.composite?.value ?? 0,

                  institutional:
                    delivery.scores?.institutional?.value ?? 0,

                  confidence:
                    delivery.scores?.confidence?.value ?? 0,

                  momentum:
                    delivery.latestMetrics?.deliveryMomentum ?? 0,

                  growth:
                    delivery.latestMetrics?.deliveryGrowth ?? 0,

                  acceleration:
                    delivery.latestMetrics?.deliveryAcceleration ?? 0

                }
              : undefined});

      data.push(
        decision
      );

    }

    return NextResponse.json({

      success:true,

      count:data.length,

      data

    });

  }

  catch(error){

    console.error(error);

    return NextResponse.json({

      success:false,

      error:
        error instanceof Error
          ? error.message
          : "Unknown Error"

    },{
      status:500
    });

  }

}





























