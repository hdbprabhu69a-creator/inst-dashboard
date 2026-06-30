import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const symbol = req.nextUrl.searchParams.get("symbol")?.toUpperCase();

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: "Missing symbol" },
        { status: 400 }
      );
    }

    const csv = fs.readFileSync(
      path.join(process.cwd(), "data", "instruments.csv"),
      "utf8"
    );

    const lines = csv.split(/\r?\n/);

    const headers = lines[0].split(",");

    const tokenIndex = headers.indexOf("instrument_token");
    const symbolIndex = headers.indexOf("tradingsymbol");

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");

      if (cols[symbolIndex]?.toUpperCase() === symbol) {
        return NextResponse.json({
          success: true,
          token: Number(cols[tokenIndex]),
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Symbol not found" },
      { status: 404 }
    );

  } catch (err: any) {

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );

  }
}
