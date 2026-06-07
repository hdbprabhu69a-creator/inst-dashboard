import { NextResponse } from "next/server";

export async function GET() {

  try {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/heatmap`
      );

    const result =
      await response.json();

    return NextResponse.json(result);

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}