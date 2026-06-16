import { NextResponse } from "next/server";
import { sendEmail } from "@/src/services/email";
export async function GET() {
  try {
    await sendEmail(
      "BUYZONE TEST",
      "Gmail integration is working!"
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}