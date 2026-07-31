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

    const symbol =
      searchParams.get("symbol");

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
      from.getDate() - 120
    );

    const candles =
      await kite.getHistoricalData(
        Number(token),
        "day",
        from,
        to
      );

    const last =
      candles[
        candles.length - 1
      ];

    const cmp =
      last.close;

    // WEEKLY RANGE

    const weeklyCandles =
      candles.slice(-5);

    const weeklyHigh =
      Math.max(
        ...weeklyCandles.map(
          (c: any) => c.high
        )
      );

    const weeklyLow =
      Math.min(
        ...weeklyCandles.map(
          (c: any) => c.low
        )
      );

    const weeklyRange =
      weeklyHigh -
      weeklyLow;

    const wf23 =
      weeklyHigh -
      (weeklyRange * 0.236);

    const wf38 =
      weeklyHigh -
      (weeklyRange * 0.382);

    const wf50 =
      weeklyHigh -
      (weeklyRange * 0.500);

    const wf61 =
      weeklyHigh -
      (weeklyRange * 0.618);

    const wf76 =
      weeklyHigh -
      (weeklyRange * 0.786);

    // MONTHLY RANGE

    const monthlyCandles =
      candles.slice(-20);

    const monthlyHigh =
      Math.max(
        ...monthlyCandles.map(
          (c: any) => c.high
        )
      );

    const monthlyLow =
      Math.min(
        ...monthlyCandles.map(
          (c: any) => c.low
        )
      );

    const monthlyRange =
      monthlyHigh -
      monthlyLow;

    const mf23 =
      monthlyHigh -
      (monthlyRange * 0.236);

    const mf38 =
      monthlyHigh -
      (monthlyRange * 0.382);

    const mf50 =
      monthlyHigh -
      (monthlyRange * 0.500);

    const mf61 =
      monthlyHigh -
      (monthlyRange * 0.618);

    const mf76 =
      monthlyHigh -
      (monthlyRange * 0.786);

    // STRUCTURE SCORE

    let score = 0;

    if (cmp > wf23)
      score += 5;
    else if (cmp > wf38)
      score += 4;
    else if (cmp > wf50)
      score += 3;
    else if (cmp > wf61)
      score += 2;
    else if (cmp > wf76)
      score += 1;

    if (cmp > mf23)
      score += 5;
    else if (cmp > mf38)
      score += 4;
    else if (cmp > mf50)
      score += 3;
    else if (cmp > mf61)
      score += 2;
    else if (cmp > mf76)
      score += 1;

    let color = "RED";

    if (score >= 8)
      color = "DARKGREEN";
    else if (score >= 5)
      color = "GREEN";
    else if (score >= 3)
      color = "YELLOW";

    return NextResponse.json({

      success: true,

      symbol,

      token,

      cmp,

      score,

      color,

      weeklyHigh,

      weeklyLow,

      monthlyHigh,

      monthlyLow,

      weeklyFib: {

        f23: Number(
          wf23.toFixed(2)
        ),

        f38: Number(
          wf38.toFixed(2)
        ),

        f50: Number(
          wf50.toFixed(2)
        ),

        f61: Number(
          wf61.toFixed(2)
        ),

        f76: Number(
          wf76.toFixed(2)
        ),

      },

      monthlyFib: {

        f23: Number(
          mf23.toFixed(2)
        ),

        f38: Number(
          mf38.toFixed(2)
        ),

        f50: Number(
          mf50.toFixed(2)
        ),

        f61: Number(
          mf61.toFixed(2)
        ),

        f76: Number(
          mf76.toFixed(2)
        ),

      },

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



