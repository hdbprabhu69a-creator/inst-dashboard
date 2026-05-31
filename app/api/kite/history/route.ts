import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const instrumentToken =
      searchParams.get("token");

    if (!instrumentToken) {

      return NextResponse.json({
        error: "No token provided",
      });

    }

    const tokenDoc =
      await getDoc(
        doc(db, "settings", "kite")
      );

    const accessToken =
      tokenDoc.data()?.accessToken;

    if (!accessToken) {

      return NextResponse.json({
        error: "No Access Token Found",
      });

    }

    const kite =
      new KiteConnect({
        api_key:
          process.env.KITE_API_KEY!,
      });

    kite.setAccessToken(
      accessToken
    );

    const to =
      new Date();

    const from =
      new Date();

    from.setDate(
      from.getDate() - 30
    );

    const candles =
      await kite.getHistoricalData(
        Number(instrumentToken),
        "day",
        from,
        to
      );

    return NextResponse.json(
      candles
    );

  } catch (error: any) {

    return NextResponse.json({
      error: error.message,
    });

  }
}