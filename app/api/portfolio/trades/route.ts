import { NextResponse } from "next/server";
import { getKiteClient } from "@/lib/kite/client";

export async function GET() {
  try {
    const kite = await getKiteClient();

    const trades = await kite.getTrades();

    return NextResponse.json({
      success: true,
      data: trades,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? "Unable to load trades",
      },
      { status: 500 }
    );
  }
}

