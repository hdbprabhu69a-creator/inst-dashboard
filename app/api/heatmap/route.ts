import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "heatmap_cache"
        )
      );

    const stocks =
      snapshot.docs.map(
        (doc) => {

          const data =
            doc.data();

          return {

            symbol:
              data.symbol,

            sector:
              data.sector ||
              "UNKNOWN",

            heatScore:
              data.heatScore || 0,

            rsScore:
              data.rsScore || 0,

            volumeScore:
              data.volumeScore || 0,

            deliveryScore:
              data.deliveryScore || 0,

            sectorScore:
              data.sectorScore || 0,

            trendScore:
              data.trendScore || 0,

            rank:
              data.rank || 0,

            color:
              data.color ||
              "YELLOW",

            updatedAt:
              data.updatedAt,

          };

        }
      )

      .sort(
        (a, b) =>
          b.heatScore -
          a.heatScore
      );

    return NextResponse.json({

      success: true,

      totalStocks:
        stocks.length,

      stocks,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}