import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(
      "Corporate Refresh Started"
    );

    const { ingestNSE } = await import(
      "@/lib/corporate/ingest-nse"
    );

    const { ingestBSE } = await import(
      "@/lib/corporate/ingest-bse"
    );

    await ingestNSE();
    await ingestBSE();

    return NextResponse.json({
      success: true,
      message:
        "Corporate ingestion completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Corporate Refresh Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}