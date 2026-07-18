import { NextResponse } from "next/server";
import { getPortfolioSnapshot } from "@/lib/portfolio/portfolioService";

export async function GET() {
  const snapshot = await getPortfolioSnapshot();

  return NextResponse.json({
    success: true,
    data: {
      open: snapshot.openOrders,
      completed: snapshot.completedOrders,
    },
  });
}
