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

    const symbol =
      searchParams.get("symbol");

    if (!symbol) {

      return NextResponse.json(
        {
          success: false,
          error: "No symbol provided",
        },
        {
          status: 400,
        }
      );

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

      return NextResponse.json(
        {
          success: false,
          error:
            "No Access Token Found",
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

    const exchangeSymbol =
      `NSE:${symbol}`;

    console.log(
      "FETCHING:",
      exchangeSymbol
    );

    const quote =
      await kite.getQuote([
        exchangeSymbol,
      ]);

    console.log(
      "QUOTE:",
      JSON.stringify(
        quote,
        null,
        2
      )
    );

    return NextResponse.json({
      success: true,
      symbol,
      quote,
    });

  } catch (error: any) {

    console.error(
      "KITE API ERROR:"
    );

    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unknown Error",
      },
      {
        status: 500,
      }
    );

  }

}