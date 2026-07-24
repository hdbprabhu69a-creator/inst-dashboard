import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  doc,
  query,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
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


  const snapshot = await getDocs(collection(db, "universe_indices"));

  let totalIndices = 0;
  let skippedIndices = 0;
  let downloadedIndices = 0;
  let totalCandles = 0;
  const failedIndices:{symbol:string;token:any;error:string}[] = [];

  let counter = 0;
for (const indexDoc of snapshot.docs) {
counter++;
console.log(`[${counter}/${snapshot.docs.length}] ${indexDoc.data().symbol}`);

    const indexData = indexDoc.data();
    console.log("DOC:", indexDoc.id);

    if (!indexData.instrumentToken) {
      skippedIndices++;
      continue;
    }
    const to = new Date();

const historyRef = collection(
  db,
  "universe_indices",
  indexDoc.id,
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
  from.setFullYear(from.getFullYear()-1);

} else {

  const latest = latestSnap.docs[0].data().date;

  from = new Date(latest);

  from.setDate(
    from.getDate()+1
  );

}

console.log("FROM:", from.toISOString());
    console.log("TO:", to.toISOString());
    let raw: any[] = [];
    try {
      console.log("TOKEN:", Number(indexData.instrumentToken));
      console.log("INTERVAL:", "day");
      console.log("FROM:", from.toISOString());
      console.log("TO:", to.toISOString());
      raw = await getHistoricalCandles(
        Number(indexData.instrumentToken),
        from,
        to,
        "day"
      );


 } catch(e:any){

console.error("FAILED SYMBOL:", indexData.symbol);
console.error("FAILED TOKEN:", indexData.instrumentToken);
console.error("FAILED:", e.message);

failedIndices.push({
  symbol: indexData.symbol,
  token: indexData.instrumentToken,
  error: e.message
});

skippedIndices++;

continue;

}
    downloadedIndices++;
    const candles = normalize(raw);
let inserted = 0;
let batch = writeBatch(db);
    let ops = 0;

    for (const c of candles) {

      const ref = doc(
        db,
        "universe_indices",
        indexDoc.id,
        "history",
        c.date
      );
inserted++;

      batch.set(ref, {
        ...c,
        symbol: indexData.symbol,
        instrumentToken: indexData.instrumentToken,
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

    totalIndices++;
    totalCandles += inserted;
// ?? THROTTLE (CRITICAL FIX)
    await delay(250);

  }

  console.log("================================");
console.log(`IMPORT FINISHED IN ${((Date.now()-startedAt)/1000).toFixed(2)}s`);
console.log(`Downloaded: ${downloadedIndices}`);
console.log(`Skipped: ${skippedIndices}`);
console.log(`Candles Written: ${totalCandles}`);
console.log("================================");
  return NextResponse.json({
    success: true,
    totalIndices,
    totalCandles,
    skippedIndices,
    failedIndices
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






























































