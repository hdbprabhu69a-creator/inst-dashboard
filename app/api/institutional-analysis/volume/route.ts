import { NextResponse } from "next/server";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminDb } from "@/lib/firebase-admin";
import { volumeEngine } from "@/institutional-analysis/engine/volume";

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: "symbol is required" },
        { status: 400 }
      );
    }

    const deliverySnap = await adminDb
      .collection("delivery_history")
      .where("symbol", "==", symbol)
      .get();

    const deliveryRecords = deliverySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    deliveryRecords.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    const stockSnap = await getDocs(
      query(
        collection(db, "universe"),
        where("symbol", "==", symbol)
      )
    );

    if (stockSnap.empty) {
      throw new Error("Universe symbol not found.");
    }

    const stockId = stockSnap.docs[0].id;

    const historySnap = await getDocs(
      query(
        collection(
          db,
          "universe",
          stockId,
          "history"
        ),
        orderBy("date")
      )
    );

    const deliveryMap = new Map(
      deliveryRecords.map((d:any)=>[
        String(d.date),
        d
      ])
    );

    const records = historySnap.docs.map(doc=>{

      const h:any=doc.data();

      const d:any=deliveryMap.get(String(h.date));

      return{

        symbol,

        date:h.date,

        open:Number(h.open),

        high:Number(h.high),

        low:Number(h.low),

        close:Number(h.close),

        volume:Number(h.volume),

        deliveryQty:Number(d?.deliveryQty ?? 0),

        deliveryPercent:Number(d?.deliveryPct ?? 0)

      };

    });

    const analysis = volumeEngine(records);

    return NextResponse.json({
      success: true,
      symbol,
      total: records.length,
      deliveryRecords: deliveryRecords.length,
      data: analysis
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      {
        status: 500
      }
    );

  }

}


