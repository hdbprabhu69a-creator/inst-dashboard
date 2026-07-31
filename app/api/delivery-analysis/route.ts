import { NextResponse } from "next/server";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DeliveryEngine } from "@/lib/delivery-analysis/DeliveryEngine";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol");

    if (!symbol) {

      return NextResponse.json(
        {
          success: false,
          error: "symbol is required"
        },
        {
          status: 400
        }
      );

    }

    const snapshot = await adminDb
      .collection("delivery_history")
      .where("symbol", "==", symbol)
      .get();

    const deliveryRecords = snapshot.docs.map(doc => ({
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
    collection(db,"universe"),
    where("symbol","==",symbol)
  )
);

if (stockSnap.empty) {
  throw new Error(`Universe symbol not found: ${symbol}`);
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

const historyMap = new Map(
  historySnap.docs.map(doc => {
    const d:any = doc.data();
    return [String(d.date), d];
  })
);

const records = deliveryRecords
  .map((d: any) => {

    const h = historyMap.get(d.date);

    if (!h) {
  console.log("[MISSING OHLC]", d.date);
  return null;
}

    return {
      symbol: d.symbol,
      date: d.date,
      open: Number(h.open),
      high: Number(h.high),
      low: Number(h.low),
      close: Number(h.close),
      volume: Number(d.volume),
      deliveryQty: Number(d.deliveryQty),
      deliveryPercent: Number(d.deliveryPct)
    };

  })
  .filter((r): r is NonNullable<typeof r> => r !== null);const engine = new DeliveryEngine();

const analysis = engine.analyze(records);

return NextResponse.json({

  success: true,

  symbol,

  total: records.length,

  analysis

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













