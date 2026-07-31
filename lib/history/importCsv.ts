import {
  collection,
  doc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type CsvRow = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
};

export async function importHistory(
  symbol: string,
  rows: CsvRow[]
) {
  const batch = writeBatch(db);

  for (const row of rows) {

    const ref = doc(
      collection(
        db,
        "marketHistory",
        symbol,
        "candles"
      ),
      row.date
    );

    batch.set(ref, {

      symbol,

      date: row.date,

      open: row.open,

      high: row.high,

      low: row.low,

      close: row.close,

      volume: row.volume,

      vwap: row.vwap ?? 0,

      createdAt:
        Timestamp.now(),

    });

  }

  await batch.commit();

  return {

    imported:
      rows.length,

  };

}
