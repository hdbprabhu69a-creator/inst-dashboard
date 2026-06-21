import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(
      "BusinessLine Job Triggered"
    );

    return NextResponse.json({
      success: true,
      message:
        "BusinessLine Job Executed",
      timestamp:
        new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Error",
      },
      { status: 500 }
    );
  }
}