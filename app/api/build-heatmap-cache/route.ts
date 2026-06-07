import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  doc,
  setDoc,
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

    let created = 0;

    for (
      const stockDoc
      of snapshot.docs
    ) {

      const stock =
        stockDoc.data();

      await setDoc(

        doc(
          db,
          "heatmap_cache",
          stock.symbol
        ),

        {

          symbol:
            stock.symbol,

          heatScore: 0,

          rsScore: 0,

          volumeScore: 0,

          deliveryScore: 0,

          sectorScore: 0,

          trendScore: 0,

          rank: 0,

          color:
            "YELLOW",

          updatedAt:
            new Date()
              .toISOString(),

        },

        {
          merge: true,
        }

      );

      created++;

    }

    return NextResponse.json({

      success: true,

      created,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}