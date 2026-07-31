import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    await adminDb
      .collection("businessline_news")
      .doc("test")
      .set({
        title: "BusinessLine Init",
        createdAt: Date.now(),
      });

    return NextResponse.json({
      success: true,
      message: "businessline_news created",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
