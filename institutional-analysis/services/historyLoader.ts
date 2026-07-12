import { adminDb } from "@/lib/firebase-admin";

export interface HistoryCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function loadHistory(
  symbol: string
): Promise<HistoryCandle[]> {

  const universe = await adminDb
    .collection("universe")
    .where("symbol","==",symbol)
    .limit(1)
    .get();

  if (universe.empty) {
    throw new Error(
      `Symbol not found: ${symbol}`
    );
  }

  const docId = universe.docs[0].id;

  const history = await adminDb
    .collection("universe")
    .doc(docId)
    .collection("history")
    .orderBy("date","asc")
    .get();

  return history.docs.map(d => {

    const c = d.data();

    return {
      date: c.date,
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume ?? 0)
    };

  });

}
