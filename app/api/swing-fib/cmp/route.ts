import { NextRequest, NextResponse } from "next/server";

import { getLivePrices } from "@/lib/kite/getLivePrices";

export async function GET(
  request: NextRequest
) {
  try {
    const raw =
      request.nextUrl.searchParams.get(
        "symbols"
      );

    if (!raw) {
      return NextResponse.json({
        success: true,
        prices: {},
      });
    }

    const symbols =
      raw
        .split(",")
        .map(
          symbol =>
            symbol.trim()
        )
        .filter(Boolean);

    if (
      symbols.length === 0
    ) {
      return NextResponse.json({
        success: true,
        prices: {},
      });
    }

    const prices =
      await getLivePrices(
        symbols
      );

    return NextResponse.json({
      success: true,
      prices,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "CMP request failed",
      },
      {
        status: 500,
      }
    );
  }
}
