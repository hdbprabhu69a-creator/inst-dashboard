import { NextResponse } from "next/server";
import { getHoldings } from "@/lib/portfolio/holdingsRepository";

export async function GET() {
  const holdings = await getHoldings();

  return NextResponse.json({
    success: true,
    data: holdings,
  });
}
