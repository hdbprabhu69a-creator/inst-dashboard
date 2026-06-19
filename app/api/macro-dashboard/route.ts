import { NextResponse } from "next/server";

import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

export async function GET() {

  try {

    const snapshot =
      await getDoc(

        doc(
          db,
          "macro_dashboard",
          "live"
        )

      );

    if (
      !snapshot.exists()
    ) {

      return NextResponse.json(
        null
      );

    }

    return NextResponse.json(

      snapshot.data()

    );

  } catch (
    error: any
  ) {

    return NextResponse.json({

      error:
        error.message,

    });

  }

}