import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const symbolsParam =
      searchParams.get("symbols");

    if (!symbolsParam) {
      return NextResponse.json(
        {
          success: false,
          error: "No symbols provided",
        },
        {
          status: 400,
        }
      );
    }

    const symbols =
      [...new Set(
        symbolsParam
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      )];

    const tokenDoc =
      await adminDb
        .collection("settings")
        .doc("kite")
        .get();

    if (!tokenDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: "settings/kite document not found",
        },
        {
          status: 404,
        }
      );
    }

    const accessToken =
      tokenDoc.data()?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "No Access Token Found",
        },
        {
          status: 400,
        }
      );
    }

    const kite =
      new KiteConnect({
        api_key:
          process.env.KITE_API_KEY!,
      });

    kite.setAccessToken(
      accessToken
    );

    const instruments =
      symbols.map(
        s => `NSE:${s}`
      );

    const quotes =
      await kite.getQuote(
        instruments
      );

    const prices:
      Record<string, number> = {};

    for (const symbol of symbols) {

      const quote =
        quotes[`NSE:${symbol}`];

      prices[symbol] =
        quote?.last_price ??
        0;

    }

    return NextResponse.json(
      prices
    );

  } catch (error: any) {

    console.error(
      "KITE BATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Unknown Error",
      },
      {
        status: 500,
      }
    );

  }
}
