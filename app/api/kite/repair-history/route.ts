import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  getDoc,
  doc,
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

async function getKite() {

  const tokenDoc =
    await getDoc(doc(db, "settings", "kite"));

  const accessToken = await getCachedAccessToken();

  const kite =
    new KiteConnect({
      api_key: process.env.KITE_API_KEY!,
    });

  kite.setAccessToken(accessToken);

  return kite;

}

function normalize(data: any[]): Candle[] {

  return data.map(c => ({
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

    const universeSnap =
      await getDocs(collection(db, "universe"));

    let repaired = 0;
    let skipped = 0;

    for (const stockDoc of universeSnap.docs) {

      const stock = stockDoc.data();

      if (!stock.instrumentToken) continue;

      const historySnap =
        await getDocs(
          collection(
            db,
            "universe",
            stockDoc.id,
            "history"
          )
        );

      const count = historySnap.size;

      // EXPECTED RANGE ~496
      if (count > 450) {
skipped++;
        continue;
      }
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

      const batch = writeBatch(db);
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

        if (ops === 400) {
          await batch.commit();
          ops = 0;
        }

      }

      if (ops > 0) {
        await batch.commit();
      }

      repaired++;

      await new Promise(res => setTimeout(res, 250));

    }

    return NextResponse.json({
      success: true,
      repaired,
      skipped,
    });

  } catch (err: any) {

    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });

  }

}



