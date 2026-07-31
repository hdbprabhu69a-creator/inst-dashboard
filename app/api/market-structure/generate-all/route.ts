import { NextResponse } from "next/server";

export async function GET() {

  try {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/market-structure/save`
      );

    const result =
      await response.json();

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: error.message,
    });

  }

}
