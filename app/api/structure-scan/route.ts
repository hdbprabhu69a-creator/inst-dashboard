import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const token =
      searchParams.get("token");

    if (!token) {

      return NextResponse.json({
        success: false,
        error: "No Token",
      });

    }

    const tokenDoc =
      await getDoc(
        doc(
          db,
          "settings",
          "kite"
        )
      );

    const accessToken = await getCachedAccessToken();

    if (!accessToken) {

      return NextResponse.json({
        success: false,
        error: "No Access Token",
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
        Number(token),
        "day",
        from,
        to
      );

    const lastCandle =
      candles[
        candles.length - 1
      ];

    const high =
      lastCandle.high;

    const low =
      lastCandle.low;

    const close =
      lastCandle.close;

    const pivot =
      (high + low + close) / 3;

    const r1 =
      (2 * pivot) - low;

    const s1 =
      (2 * pivot) - high;

    const r2 =
      pivot + (high - low);

    const s2 =
      pivot - (high - low);

    return NextResponse.json({

      success: true,

      totalCandles:
        candles.length,

      lastCandle,

      pivot: Number(
        pivot.toFixed(2)
      ),

      r1: Number(
        r1.toFixed(2)
      ),

      s1: Number(
        s1.toFixed(2)
      ),

      r2: Number(
        r2.toFixed(2)
      ),

      s2: Number(
        s2.toFixed(2)
      ),

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



