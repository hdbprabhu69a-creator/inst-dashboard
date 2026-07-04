import { NextRequest, NextResponse } from "next/server";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET(
  request: NextRequest
) {
  try {

    const symbol =
      request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json([]);
    }

    const stockSnap =
      await getDocs(
        query(
          collection(db,"universe"),
          where(
            "symbol",
            "==",
            symbol.toUpperCase()
          )
        )
      );

    if (stockSnap.empty) {
      return NextResponse.json([]);
    }

    const stockId =
      stockSnap.docs[0].id;

    const historySnap =
      await getDocs(
        query(
          collection(
            db,
            "universe",
            stockId,
            "history"
          ),
          orderBy("date")
        )
      );

    const data =
      historySnap.docs.map(doc => {

        const d:any =
          doc.data();

        return {

          time:d.date,

          open:Number(d.open),

          high:Number(d.high),

          low:Number(d.low),

          close:Number(d.close),

          volume:Number(
            d.volume ?? 0
          ),

        };

      });

    return NextResponse.json(data);

  } catch(err) {

    console.error(err);

    return NextResponse.json(
      [],
      {
        status:500
      }
    );

  }
}
