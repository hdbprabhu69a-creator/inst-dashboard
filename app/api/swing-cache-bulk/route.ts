import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

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

        error:
          "No Access Token",

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

    const snapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    const stocks: any[] =
      snapshot.docs.map(
        (doc) => ({

          id: doc.id,

          ...doc.data(),

        })
      );

    const stock =
      stocks.find(
        (s: any) =>
          s.symbol ===
          "SBIN"
      );

    if (!stock) {

      return NextResponse.json({

        success: false,

        error:
          "SBIN NOT FOUND",

      });

    }

    const symbol =
      stock.symbol;

    const instrumentToken =
      stock.instrumentToken;

    if (
      !instrumentToken
    ) {

      return NextResponse.json({

        success: false,

        error:
          "SBIN TOKEN MISSING",

      });

    }

    const to =
      new Date();

    const from =
      new Date();

    from.setDate(
      from.getDate() - 400
    );

    const candles =
      await kite.getHistoricalData(
        Number(
          instrumentToken
        ),
        "day",
        from,
        to
      );

    if (
      !candles ||
      candles.length === 0
    ) {

      return NextResponse.json({

        success: false,

        error:
          "NO CANDLES",

      });

    }

    const oneWeekStart =
      new Date();

    oneWeekStart.setDate(
      oneWeekStart.getDate() - 7
    );

    oneWeekStart.setHours(
      0,
      0,
      0,
      0
    );

    const oneWeekCandles =
      candles.filter(
        (c: any) => {

          const d =
            new Date(
              c.date
            );

          return (
            d >=
            oneWeekStart
          );

        }
      );

    const oneWeekHigh =
      Math.max(
        ...oneWeekCandles.map(
          (c: any) =>
            c.high
        )
      );

    const oneWeekLow =
      Math.min(
        ...oneWeekCandles.map(
          (c: any) =>
            c.low
        )
      );

    const highCandle =
      oneWeekCandles.find(
        (c: any) =>
          c.high ===
          oneWeekHigh
      );

    const lowCandle =
      oneWeekCandles.find(
        (c: any) =>
          c.low ===
          oneWeekLow
      );

    const highDate =
      new Date(
        highCandle!.date
      ).toLocaleDateString(
        "en-GB",
        {
          timeZone:
            "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "2-digit",
        }
      );

    const lowDate =
      new Date(
        lowCandle!.date
      ).toLocaleDateString(
        "en-GB",
        {
          timeZone:
            "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "2-digit",
        }
      );

    return NextResponse.json({

      success: true,

      symbol,

      oneWeekCandles:
        oneWeekCandles.length,

      oneWeekHigh,

      oneWeekLow,

      highDate,

      lowDate,

      message:
        "ONE WEEK SWING READY",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}

