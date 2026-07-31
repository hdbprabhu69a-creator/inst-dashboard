import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  getIndexHistory,
} from "@/lib/history/indexHistoryRepository";

import {
  getLivePrice,
} from "@/lib/kite/getLivePrice";

import {
  analyzeIndex,
} from "@/lib/institutional/indexAnalysisEngine";

import {
  buildIndexDecision,
} from "@/lib/institutional/indexDecisionEngine";

export async function GET() {

  try {

    const snapshot = await getDocs(
      collection(
        db,
        "universe_indices"
      )
    );

    const data = [];

    for (const document of snapshot.docs) {

      const index =
        document.data();

      const symbol =
        index.symbol;


      const INDEX_SYMBOLS = new Set([

        "NIFTY",
        "BANKNIFTY",
        "FINNIFTY",
        "MIDCPNIFTY",
        "NIFTYNXT50",

        "AUTO",
        "COMMODITIES",
        "CPSE",
        "ENERGY",
        "FMCG",
        "IT",
        "MEDIA",
        "METAL",
        "MNC",
        "PHARMA",
        "PSUBANK",
        "PVTBANK",
        "REALTY",

      ]);


      const collectionName =
        INDEX_SYMBOLS.has(symbol)
          ? "index_market_structure"
          : "marketStructure";


      const marketDoc =
        await getDoc(
          doc(
            db,
            collectionName,
            symbol
          )
        );


      const marketStructure =
        marketDoc.exists()
          ? marketDoc.data()
          : {};

      const cmp =
        await getLivePrice(
          symbol
        );

      const history =
        await getIndexHistory(
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

          baseTarget:
            analysis.baseTarget

        });

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


















