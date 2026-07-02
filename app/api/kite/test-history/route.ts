import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

export async function GET() {
  try {
    const kite = new KiteConnect({
      api_key: process.env.KITE_API_KEY!,
    });

    kite.setAccessToken(await getCachedAccessToken());

    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 6);

    const data = await kite.getHistoricalData(
      2713345,
      "day",
      from,
      to,
      false,
      false
    );

    return NextResponse.json({
      success: true,
      count: data.length,
      first: data[0],
      last: data[data.length - 1]
    });

  } catch (e:any) {

    return NextResponse.json({
      success:false,
      message:e.message,
      status:e.status,
      code:e.code,
      errorType:e.error_type,
      data:e.data,
      full:e
    },{status:500});

  }
}
