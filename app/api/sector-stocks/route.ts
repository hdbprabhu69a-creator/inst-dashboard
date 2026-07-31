import { NextRequest, NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET(
  request: NextRequest
) {
  try {

    const sector =
      request.nextUrl.searchParams.get(
        "sector"
      );

    if (!sector) {

      return NextResponse.json({
        success: false,
        error: "Sector required",
      });

    }

    const snapshot =
      await getDocs(
        collection(
          db,
          "heatmap_cache"
        )
      );

    const stocks =
      snapshot.docs
        .map((doc) => doc.data())

        .filter(
          (stock) =>
            stock.sector === sector
        )

        .sort(
          (a, b) =>
            b.heatScore -
            a.heatScore
        );

    return NextResponse.json({

      success: true,

      sector,

      total:
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
