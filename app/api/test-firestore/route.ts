import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("settings")
      .doc("kite")
      .get();

    return NextResponse.json({
      success: true,
      exists: snap.exists,
      data: snap.data() ?? null
    });
  } catch (e:any) {
    return NextResponse.json({
      success: false,
      message: e.message,
      code: e.code,
      status: e.status,
      details: e.details
    }, { status: 500 });
  }
}

