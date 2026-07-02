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

import { db } from "@/lib/firebase";

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
    await getDoc(doc(db, "settings", "kite"));

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

  const kite = await getKite();

  const snapshot = await getDocs(collection(db, "universe"));

  let totalStocks = 0;
  let totalCandles = 0;

  for (const stockDoc of snapshot.docs) {

    const stock = stockDoc.data();

    if (!stock.instrumentToken) continue;

    console.log("FETCHING:", stock.symbol);

    const from = new Date();
    from.setFullYear(from.getFullYear() - 2);

    const to = new Date();

    const raw = await kite.getHistoricalData(
      Number(stock.instrumentToken),
      "day",
      from,
      to,
      false,
      false
    );

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

    let batch = writeBatch(db);
    let ops = 0;

    for (const c of candles) {

      const ref = doc(
        db,
        "universe",
        stockDoc.id,
        "history",
        c.date
      );

      batch.set(ref, {
        ...c,
        symbol: stock.symbol,
        instrumentToken: stock.instrumentToken,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      ops++;

      // ?? SAFE LIMIT (Firestore batch max ~500)
      if (ops === 400) {
        await batch.commit();
        ops = 0;
      }
    }

    if (ops > 0) {
      await batch.commit();
    }

    totalStocks++;
    totalCandles += candles.length;

    console.log("DONE:", stock.symbol, candles.length);

    // ?? THROTTLE (CRITICAL FIX)
    await delay(250);

  }

  return NextResponse.json({
    success: true,
    totalStocks,
    totalCandles
  });

}



