import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    const sectorSnapshot =
      await getDocs(
        collection(
          db,
          "sector_heatmap_cache"
        )
      );

    const stockSnapshot =
      await getDocs(
        collection(
          db,
          "heatmap_cache"
        )
      );

    const sectors =
      sectorSnapshot.docs
        .map((doc) => doc.data())
        .sort(
          (a: any, b: any) =>
            a.rank - b.rank
        );

    const stocks =
      stockSnapshot.docs.map(
        (doc) => doc.data()
      );

    const result =
      sectors.map(
        (sector: any) => ({

          sector:
            sector.sector,

          avgHeat:
            sector.avgHeat,

          rank:
            sector.rank,

          stockCount:
            sector.stockCount,

          stocks:
            stocks.filter(
              (stock: any) =>
                stock.sector ===
                sector.sector
            )

        })
      );

    return NextResponse.json({

      success: true,

      total:
        result.length,

      sectors:
        result,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}