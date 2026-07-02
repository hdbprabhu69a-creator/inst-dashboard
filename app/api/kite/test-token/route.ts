import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

export async function GET() {
  try {
    const kite = new KiteConnect({
      api_key: process.env.KITE_API_KEY!,
    });

    kite.setAccessToken(await getCachedAccessToken());

    const profile = await kite.getProfile();

    return NextResponse.json({
      success: true,
      profile
    });
  } catch (e:any) {
    return NextResponse.json({
      success: false,
      message: e.message,
      status: e.status,
      code: e.code
    }, { status: 500 });
  }
}
