import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {
  try {

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    let deleted = 0;

    for (
      const stockDoc
      of universeSnapshot.docs
    ) {

      const historySnapshot =
        await getDocs(
          collection(
            db,
            "universe",
            stockDoc.id,
            "history"
          )
        );

      const batch =
        writeBatch(db);

      historySnapshot.docs.forEach(
        (historyDoc) => {

          batch.delete(
            doc(
              db,
              "universe",
              stockDoc.id,
              "history",
              historyDoc.id
            )
          );

          deleted++;

        }
      );

      await batch.commit();
}

    return NextResponse.json({
      success: true,
      deleted,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json({
      success: false,
      error:
        error.message,
    });

  }
}
