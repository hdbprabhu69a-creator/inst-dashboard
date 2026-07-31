import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

export async function GET() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "universe_indices"
        )
      );

    const indices =
      snapshot.docs
        .map(
          (doc) => ({

            symbol:
              doc.data().symbol,

            name:
              doc.data().name ??
              doc.data().symbol,

          })
        )
        .filter(
          (item) =>
            item.symbol
        )
        .sort(
          (a, b) =>
            a.symbol.localeCompare(
              b.symbol
            )
        );

    return NextResponse.json({

      success: true,

      total:
        indices.length,

      indices,

    });

  }

  catch (error: any) {

    return NextResponse.json(

      {

        success: false,

        error:
          error.message,

      },

      {

        status: 500,

      }

    );

  }

}
