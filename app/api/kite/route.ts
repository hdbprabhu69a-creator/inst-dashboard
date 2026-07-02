import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import { adminDb } from "@/lib/firebase-admin";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const symbol =
      searchParams.get("symbol");

    const cleanSymbol =
      symbol?.trim();
console.log(
      "KITE API ROUTE HIT"
    );
if (
      !cleanSymbol ||
      cleanSymbol === "undefined" ||
      cleanSymbol === "null"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid symbol",
        },
        {
          status: 400,
        }
      );
    }
const tokenDoc =
      await adminDb
        .collection("settings")
        .doc("kite")
        .get();
if (!tokenDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error:
            "settings/kite document not found",
        },
        {
          status: 404,
        }
      );
    }

    const tokenData =
      tokenDoc.data();

    const accessToken =
      tokenData?.accessToken;

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
console.log(
      "API KEY:",
      process.env.KITE_API_KEY
    );
console.log(
      "TOKEN LENGTH:",
      accessToken.length
    );
console.log(
      "================================="
    );

    const kite =
      new KiteConnect({
        api_key:
          process.env.KITE_API_KEY!,
      });

    kite.setAccessToken(
      accessToken
    );

    const exchangeSymbol =
      `NSE:${cleanSymbol}`;
const quote =
      await kite.getQuote([
        exchangeSymbol,
      ]);
return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      quote,
    });
  } catch (error: any) {
    const message =
      error?.message ||
      "Unknown Error";

    console.error(
      "================================="
    );

    console.error(
      "KITE API ERROR:"
    );

    console.error(error);

    console.error(
      "ERROR MESSAGE:",
      message
    );

    console.error(
      "ERROR CODE:",
      error?.code
    );

    console.error(
      "ERROR STATUS:",
      error?.status
    );

    console.error(
      "================================="
    );

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}

