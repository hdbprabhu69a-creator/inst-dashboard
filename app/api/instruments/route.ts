import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const symbol = req.nextUrl.searchParams
      .get("symbol")
      ?.trim()
      .toUpperCase();

    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing symbol",
        },
        {
          status: 400,
        }
      );
    }

    const csvPath = path.join(
      process.cwd(),
      "data",
      "zerodha-instruments.csv"
    );

    const csv = fs.readFileSync(
      csvPath,
      "utf8"
    );

    const lines = csv
      .split(/\r?\n/)
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Empty instrument file",
        },
        {
          status: 500,
        }
      );
    }

    const headers = lines[0].split(",");

    const tokenIndex =
      headers.indexOf("instrument_token");

    const symbolIndex =
      headers.indexOf("tradingsymbol");

    if (
      tokenIndex === -1 ||
      symbolIndex === -1
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid CSV format",
        },
        {
          status: 500,
        }
      );
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");

      const tradingSymbol =
        (cols[symbolIndex] || "")
          .trim()
          .toUpperCase();

      if (tradingSymbol === symbol) {
        return NextResponse.json({
          success: true,
          token: Number(cols[tokenIndex]),
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: `Symbol '${symbol}' not found`,
      },
      {
        status: 404,
      }
    );

  } catch (err: any) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }
}
