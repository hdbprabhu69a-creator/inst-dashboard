import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface UniverseStock {

  documentId: string;

  symbol: string;

  instrumentToken: number;

  sector: string;

}

export async function getUniverse(): Promise<UniverseStock[]> {

  const snapshot = await getDocs(
    collection(db,"universe")
  );

  const stocks: UniverseStock[] = [];

  snapshot.forEach(doc => {

    const d = doc.data();

    stocks.push({

      documentId: doc.id,

      symbol: String(d.symbol ?? ""),

      instrumentToken: Number(d.instrumentToken ?? 0),

      sector: String(d.sector ?? "")

    });

  });

  stocks.sort(
    (a,b)=>a.symbol.localeCompare(b.symbol)
  );

  return stocks;

}

