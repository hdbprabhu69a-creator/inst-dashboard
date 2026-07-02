import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

type Candle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

async function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function getKite() {

  const tokenDoc =
    await adminDb.collection("settings").doc("kite").get();

  const accessToken =
    tokenDoc.data()?.accessToken;

  const kite =
    new KiteConnect({
      api_key: process.env.KITE_API_KEY!,
    });

  kite.setAccessToken(accessToken);

  return kite;
}

function normalize(candles: any[]): Candle[] {
  return candles.map(c => ({
    date: String(c.date).substring(0, 10),
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
    volume: Number(c.volume ?? 0),
  }));
}

export async function GET() {
  try {

  const kite = await getKite();

  const snapshot = await getDocs(collection(db, "universe"));

  let totalStocks = 0;
  let totalCandles = 0;

  for (const stockDoc of snapshot.docs) {

    const stock = stockDoc.data();
    console.log("DOC:", stockDoc.id);

    if (!stock.instrumentToken) continue;
const from = new Date();
    from.setFullYear(from.getFullYear() - 2);

    const to = new Date();

    let raw: any[] = [];
    try {
      raw = await kite.getHistoricalData(
        Number(stock.instrumentToken),
        "day",
        from,
        to,
        false,
        false
      );


 } catch(e:any){
console.error("FAILED SYMBOL:", stock.symbol);
console.error("FAILED TOKEN:", stock.instrumentToken);
throw e;
}
    const candles = normalize(raw);

    const historySnapshot = await getDocs(
      query(
        collection(
          db,
          "universe",
          stockDoc.id,
          "history"
        ),
        orderBy("date")
      )
    );

    const existingDates = new Set(
      historySnapshot.docs.map(d => d.id)
    );

    let inserted = 0;
let skipped = 0;
let missingSequence = 0;

const sortedCandles = [...candles].sort(
  (a, b) => a.date.localeCompare(b.date)
);



    let batch = writeBatch(db);
    let ops = 0;

    for (const c of candles) {

      if (existingDates.has(c.date)) {
        skipped++;
        continue;
      }

      const ref = doc(
        db,
        "universe",
        stockDoc.id,
        "history",
        c.date
      );

      inserted++;

      batch.set(ref, {
        ...c,
        symbol: stock.symbol,
        instrumentToken: stock.instrumentToken,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      ops++;

      // ?? SAFE LIMIT (Firestore batch max ~500)
      if (ops >= 400) {

        await batch.commit();

        batch = writeBatch(db);

        ops = 0;
      }
    }

    if (ops > 0) {
      await batch.commit();
    }

    totalStocks++;
    totalCandles += inserted;
// ?? THROTTLE (CRITICAL FIX)
    await delay(250);

  }

  return NextResponse.json({
    success: true,
    totalStocks,
    totalCandles
  });









  } catch (error: any) {
    console.error("POPULATE HISTORY ERROR");
    console.error("MESSAGE:", error?.message);
    console.error("STATUS:", error?.status);
    console.error("CODE:", error?.code);
    console.error("STACK:", error?.stack);
    return NextResponse.json({ success:false, error:String(error?.message ?? error), stack:error?.stack }, { status:500 });
  }
}









