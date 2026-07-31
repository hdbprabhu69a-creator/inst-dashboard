import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {

  try {

    const snap = await adminDb
      .collection("delivery_history")
      .orderBy("date", "desc")
      .get();

    const data = snap.docs.map(doc => {
      const raw = doc.data();

      const { deliveryPct, ...rest } = raw;

      return {
        id: doc.id,
        ...rest,
        deliveryPercent: Number(deliveryPct ?? 0),
      };
    });

    return NextResponse.json({
      success: true,
      total: data.length,
      data
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: error.message
    });

  }

}


