import { NextRequest, NextResponse } from "next/server";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET(
  request: NextRequest
) {

  try {

    const symbol =
      request.nextUrl.searchParams.get("symbol");

    if (!symbol) {

      return NextResponse.json(
        {
          error: "Missing symbol",
        },
        {
          status: 400,
        }
      );

    }

    const q =
      query(
        collection(
          db,
          "marketHistory",
          symbol.toUpperCase(),
          "daily"
        ),
        orderBy("date")
      );

    const snap =
      await getDocs(q);

    const data =
      snap.docs.map(doc => {

        const d =
          doc.data();

        return {

          time: d.date,

          open:
            Number(d.open),

          high:
            Number(d.high),

          low:
            Number(d.low),

          close:
            Number(d.close),

          volume:
            Number(
              d.volume ?? 0
            ),

        };

      });

    return NextResponse.json(
      data
    );

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error:
          "Unable to load history",
      },
      {
        status: 500,
      }
    );

  }

}