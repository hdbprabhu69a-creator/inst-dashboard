import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  getDoc,
  Timestamp,
  doc,
  query,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import { getHistoricalCandles } from "@/lib/kite/historical";


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

  console.log("RAW DATE SAMPLE:", candles[0]?.date);

  return candles.map(c => {

    const utc = new Date(c.date);

    const ist = new Date(
      utc.getTime() + (5.5 * 60 * 60 * 1000)
    );

    const yyyy = ist.getUTCFullYear();

    const mm = String(
      ist.getUTCMonth() + 1
    ).padStart(2, "0");

    const dd = String(
      ist.getUTCDate()
    ).padStart(2, "0");

    return {

      date: `${yyyy}-${mm}-${dd}`,

      open: Number(c.open),

      high: Number(c.high),

      low: Number(c.low),

      close: Number(c.close),

      volume: Number(
        c.volume ?? 0
      ),

    };

  });

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
  const failedStocks:{symbol:string;token:any;error:string}[] = [];

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

const historyRef = collection(
  db,
  "universe",
  stockDoc.id,
  "history"
);

const latestSnap = await getDocs(
  query(
    historyRef,
    orderBy("date","desc"),
    limit(1)
  )
);

let from: Date;

if (latestSnap.empty) {

  from = new Date();
  from.setFullYear(from.getFullYear() - 2);

} else {

  const latest = latestSnap.docs[0].data().date;

  from = new Date(latest);
  from.setDate(from.getDate() + 1);

}

console.log("FROM:", from.toISOString());
    console.log("TO:", to.toISOString());
    let raw: any[] = [];
    try {
      console.log("TOKEN:", Number(stock.instrumentToken));
      console.log("INTERVAL:", "day");
      console.log("FROM:", from.toISOString());
      console.log("TO:", to.toISOString());
      raw = await getHistoricalCandles(
        Number(stock.instrumentToken),
        from,
        to,
        "day"
      );


 } catch(e:any){

console.error("FAILED SYMBOL:", stock.symbol);
console.error("FAILED TOKEN:", stock.instrumentToken);
console.error("FAILED:", e.message);

failedStocks.push({
  symbol: stock.symbol,
  token: stock.instrumentToken,
  error: e.message
});

skippedStocks++;

continue;

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

















































