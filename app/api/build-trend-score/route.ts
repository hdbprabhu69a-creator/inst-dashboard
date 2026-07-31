import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    let updated = 0;

    for (
      const stockDoc
      of snapshot.docs
    ) {

      const stock =
        stockDoc.data();

      let trendScore = 0;

      const cmp =
        stock.cmp || 0;

      if (
        cmp >
        (stock.dailyPivot?.pivot || 0)
      ) {

        trendScore += 20;

      }

      if (
        cmp >
        (stock.weeklyPivot?.pivot || 0)
      ) {

        trendScore += 20;

      }

      if (
        cmp >
        (stock.monthlyPivot?.pivot || 0)
      ) {

        trendScore += 20;

      }

      if (
        cmp >
        (stock.weeklyFib?.fib50 || 0)
      ) {

        trendScore += 20;

      }

      if (
        cmp >
        (stock.monthlyFib?.fib50 || 0)
      ) {

        trendScore += 20;

      }

      await updateDoc(

        doc(
          db,
          "heatmap_cache",
          stock.symbol
        ),

        {

          trendScore,

          heatScore:
            trendScore,

          color:

            trendScore >= 80
              ? "DARKGREEN"

            : trendScore >= 60
              ? "GREEN"

            : trendScore >= 40
              ? "YELLOW"

            : "RED",

          updatedAt:
            new Date()
              .toISOString(),

        }

      );

      updated++;

    }

    return NextResponse.json({

      success: true,

      updated,

      message:
        "TREND + HEAT SCORE UPDATED",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}
