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
          "sector_heatmap_cache"
        )
      );

    const sectors =
      snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        .sort(
          (a: any, b: any) =>
            a.rank - b.rank
        );

    return NextResponse.json({

      success: true,

      total:
        sectors.length,

      sectors,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}
