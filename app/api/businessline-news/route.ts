import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://YOUR-VERCEL-URL.vercel.app";

    const response = await fetch(
      `${baseUrl}/api/businessline`,
      {
        cache: "no-store",
      }
    );

    const data =
      await response.json();

    return NextResponse.json({
      success: true,
      count: data.count || 0,
      timestamp:
        new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}