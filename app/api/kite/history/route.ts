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

    const period =
      searchParams.get("period") ||
      "1M";

    if (!instrumentToken) {

      return NextResponse.json({
        success: false,
        error: "No token provided",
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

    const accessToken =
      tokenDoc.data()?.accessToken;

    if (!accessToken) {

      return NextResponse.json({
        success: false,
        error:
          "No Access Token Found",
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

    switch (period) {

      case "D":
        from.setDate(
          from.getDate() - 2
        );
        break;

      case "W":
        from.setDate(
          from.getDate() - 14
        );
        break;

      case "M":
        from.setDate(
          from.getDate() - 60
        );
        break;

      case "1W":
        from.setDate(
          from.getDate() - 7
        );
        break;

      case "2W":
        from.setDate(
          from.getDate() - 14
        );
        break;

      case "1M":
        from.setDate(
          from.getDate() - 30
        );
        break;

      case "3M":
        from.setDate(
          from.getDate() - 90
        );
        break;

      case "6M":
        from.setDate(
          from.getDate() - 180
        );
        break;

      case "1Y":
        from.setDate(
          from.getDate() - 365
        );
        break;

      default:
        from.setDate(
          from.getDate() - 30
        );

    }

    const candles =
      await kite.getHistoricalData(
        Number(
          instrumentToken
        ),
        "day",
        from,
        to
      );

    return NextResponse.json({

      success: true,

      period,

      candles,

    });

  } catch (error: any) {

    console.error(
      error
    );

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}