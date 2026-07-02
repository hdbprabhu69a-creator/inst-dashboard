import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
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
  const accessToken = await getCachedAccessToken();

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
  const startedAt = Date.now();
  try {

  const kite = await getKite();

  const snapshot = await getDocs(collection(db, "universe"));

  let totalStocks = 0;
  let skippedStocks = 0;
  let downloadedStocks = 0;
  let totalCandles = 0;

  let index = 0;
for (const stockDoc of snapshot.docs) {
index++;
console.log(`[${index}/${snapshot.docs.length}] ${stockDoc.data().symbol}`);

    const stock = stockDoc.data();
    console.log("DOC:", stockDoc.id);

    if (!stock.instrumentToken) {
      skippedStocks++;
      continue;
    }
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 6);    console.log("FROM:", from.toISOString());
    console.log("TO:", to.toISOString());
    let raw: any[] = [];
    try {
      console.log("TOKEN:", Number(stock.instrumentToken));
      console.log("INTERVAL:", "day");
      console.log("FROM:", from.toISOString());
      console.log("TO:", to.toISOString());
      raw = await kite.getHistoricalData(Number(stock.instrumentToken), from, to, "day");


 } catch(e:any){
console.error("FAILED SYMBOL:", stock.symbol);
console.error("FAILED TOKEN:", stock.instrumentToken);
console.error("ERROR OBJECT:", JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
console.error("ERROR MESSAGE:", e?.message);
console.error("ERROR STATUS:", e?.status);
console.error("ERROR CODE:", e?.code);
console.error("ERROR DATA:", e?.data);
throw e;
}
    downloadedStocks++;
    const candles = normalize(raw);
let inserted = 0;
let skipped = 0;
let missingSequence = 0;

const sortedCandles = [...candles].sort(
  (a, b) => a.date.localeCompare(b.date)
);



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

  console.log("================================");
console.log(`IMPORT FINISHED IN ${((Date.now()-startedAt)/1000).toFixed(2)}s`);
console.log(`Downloaded: ${downloadedStocks}`);
console.log(`Skipped: ${skippedStocks}`);
console.log(`Candles Written: ${totalCandles}`);
console.log("================================");
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

























