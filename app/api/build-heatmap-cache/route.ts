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

    let skipped = 0;

    const skippedSymbols: string[] = [];

    for (
      const stockDoc
      of snapshot.docs
    ) {

      const stock =
        stockDoc.data();
console.log(
        "DOC ID:",
        stockDoc.id
      );
if (
        !stock.symbol ||
        typeof stock.symbol !==
          "string" ||
        stock.symbol.trim() === ""
      ) {
skipped++;

        skippedSymbols.push(
          stockDoc.id
        );

        continue;

      }

      const dataToSave = {

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

      };
await setDoc(

        doc(
          db,
          "heatmap_cache",
          stock.symbol
        ),

        dataToSave,

        {
          merge: true,
        }

      );

      created++;

    }

    return NextResponse.json({

      success: true,

      total:
        snapshot.size,

      created,

      skipped,

      skippedSymbols,

      message:
        "HEATMAP CACHE CREATED",

    });

  } catch (error: any) {

    console.error(
      "HEATMAP CACHE ERROR"
    );

    console.error(
      error
    );

    return NextResponse.json({

      success: false,

      error:
        error.message,

      stack:
        error.stack,

    });

  }

}

