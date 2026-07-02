import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

export async function GET() {
  const kite = new KiteConnect({
    api_key: process.env.KITE_API_KEY!,
  });

  kite.setAccessToken(await getCachedAccessToken());

  // Monkey-patch _request to log every HTTP request
  const original = (kite as any)._request.bind(kite);

  (kite as any)._request = async (...args:any[]) => {
    console.log("REQUEST:", JSON.stringify(args, null, 2));
    return original(...args);
  };

  try {
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
      success:true,
      count:data.length
    });

  } catch(e:any) {

    return NextResponse.json({
      success:false,
      message:e.message,
      full:e
    },{status:500});

  }
}
