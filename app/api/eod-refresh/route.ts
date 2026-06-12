import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const response =
      await fetch(
        `${baseUrl}/api/market-structure-bulk-v2`
      );

    const result =
      await response.json();

    return NextResponse.json({
      success: true,

      timestamp:
        new Date().toISOString(),

      updated:
        result.updated,

      ignored:
        result.ignored,

      failed:
        result.failed,

      message:
        "EOD REFRESH COMPLETE",
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,

      error:
        error.message,
    });

  }
}