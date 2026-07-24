import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {

    const snap = await adminDb
        .collection("universe_indices")
        .get();

    const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return NextResponse.json({
        success: true,
        total: data.length,
        data
    });
}