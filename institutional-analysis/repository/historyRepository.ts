import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { resolveAsset } from "@/lib/index/indexResolver";
import { getIndexHistory } from "@/lib/index/getIndexHistory";

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getHistory(
  symbol: string,
  lookback: number = 126
): Promise<Candle[]> {

  const universeSnap = await getDocs(
    query(
      collection(db, "universe"),
      where("symbol", "==", symbol),
      limit(1)
    )
  );

  if (universeSnap.empty) {
    throw new Error("Symbol not found: " + symbol);
  }

  const universeDoc = universeSnap.docs[0];

  const historySnap = await getDocs(
    query(
      collection(
        db,
        "universe",
        universeDoc.id,
        "history"
      ),
      orderBy("date", "asc")
    )
  );

  const candles = historySnap.docs.map(doc => {
    const d = doc.data();

    return {
      date: String(d.date),
      open: Number(d.open),
      high: Number(d.high),
      low: Number(d.low),
      close: Number(d.close),
      volume: Number(d.volume ?? 0)
    };
  });

  return candles.slice(-lookback);
}



