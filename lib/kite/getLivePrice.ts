import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";

export async function getLivePrice(symbol: string) {

  const tokenDoc = await adminDb
    .collection("settings")
    .doc("kite")
    .get();

  if (!tokenDoc.exists) return 0;

  const accessToken = tokenDoc.data()?.accessToken;

  if (!accessToken) return 0;

  const kite = new KiteConnect({
    api_key: process.env.KITE_API_KEY!,
  });

  kite.setAccessToken(accessToken);

  let instrument = "";

  // Find stock by symbol field (same idea as historyRepository)
  const stockSnap = await adminDb
    .collection("universe")
    .where("symbol", "==", symbol.toUpperCase())
    .limit(1)
    .get();

  if (!stockSnap.empty) {

    const stock: any = stockSnap.docs[0].data();

    instrument = `${stock.exchange ?? "NSE"}:${stock.symbol}`;

  } else {

    const indexSnap = await adminDb
      .collection("universe_indices")
      .where("symbol", "==", symbol)
      .limit(1)
      .get();

    if (indexSnap.empty) return 0;

    const index: any = indexSnap.docs[0].data();

    instrument = `${index.exchange}:${index.kiteSymbol}`;

  }

  const quote = await kite.getQuote([instrument]);

  return Number(
    quote[instrument]?.last_price ?? 0
  );

}
