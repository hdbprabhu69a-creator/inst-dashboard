import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  const snap = await getDocs(
    query(
      collection(db,"universe"),
      where("symbol","==","GUJGASLTD")
    )
  );

  return NextResponse.json(
    snap.docs.map(d=>({
      id:d.id,
      ...d.data()
    }))
  );
}

