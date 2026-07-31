import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";

export async function GET() {

    const snapshot =
        await adminDb
            .collection("corporate_announcements")
            .orderBy("importedAt", "desc")
            .limit(1000)
            .get();

    const rows =
        snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    return NextResponse.json(rows);

}
