import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    const heatmapSnapshot =
      await getDocs(
        collection(
          db,
          "heatmap_cache"
        )
      );

    let updated = 0;

    for (
      const heatmapDoc
      of heatmapSnapshot.docs
    ) {

      const symbol =
        heatmapDoc.data()
          .symbol;

      const universeQuery =
        query(
          collection(
            db,
            "universe"
          ),
          where(
            "symbol",
            "==",
            symbol
          )
        );

      const universeSnapshot =
        await getDocs(
          universeQuery
        );

      if (
        universeSnapshot.empty
      ) {

        continue;

      }

      const sector =
        universeSnapshot.docs[0]
          .data().sector ||
        "UNKNOWN";

      await updateDoc(

        doc(
          db,
          "heatmap_cache",
          symbol
        ),

        {

          sector,

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
        "SECTOR SYNC COMPLETE",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}
