import { NextResponse } from "next/server";

export async function GET() {

  try {

    const response =
      await fetch(
        "https://www.thehindubusinessline.com/feeder/default.rss",
        {
          cache: "no-store",
        }
      );

    const xml =
      await response.text();

    return NextResponse.json({

      success: true,

      xml,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error: error.message,

    });

  }

}