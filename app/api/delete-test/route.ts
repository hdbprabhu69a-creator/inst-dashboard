import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    let universeDeleted = false;
    let marketStructureDeleted = false;

    const universeQuery =
      query(
        collection(
          db,
          "universe"
        ),
        where(
          "symbol",
          "==",
          "TEST"
        )
      );

    const universeSnapshot =
      await getDocs(
        universeQuery
      );

    for (const item of universeSnapshot.docs) {

      await deleteDoc(
        doc(
          db,
          "universe",
          item.id
        )
      );

      universeDeleted = true;

    }

    await deleteDoc(
      doc(
        db,
        "marketStructure",
        "TEST"
      )
    );

    marketStructureDeleted = true;

    return NextResponse.json({

      success: true,

      universeDeleted,

      marketStructureDeleted,

      message:
        "TEST removed from both collections",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}
