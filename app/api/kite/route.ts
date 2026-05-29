import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

const kite = new KiteConnect({
  api_key: process.env.KITE_API_KEY!,
});

kite.setAccessToken(
  process.env.KITE_ACCESS_TOKEN!
);

export async function GET() {

  try {

    const quote = await kite.getQuote([
      "NSE:KARURVYSYA",
      "NSE:RELIANCE",
      "NSE:SBIN",
    ]);

    return NextResponse.json(quote);

  } catch (error: any) {

    return NextResponse.json({
      error: error.message,
    });

  }

}