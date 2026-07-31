import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";

export async function getLivePrices(
  symbols: string[]
): Promise<Record<string, number>> {

  const tokenDoc = await adminDb
    .collection("settings")
    .doc("kite")
    .get();

  if (!tokenDoc.exists) {

    console.log("❌ Kite token document not found");

    return {};

  }

  const accessToken =
    tokenDoc.data()?.accessToken;

  if (!accessToken) {

    console.log("❌ Access token missing");

    return {};

  }

  const kite =
    new KiteConnect({

      api_key:
        process.env.KITE_API_KEY!,

    });

  kite.setAccessToken(
    accessToken
  );

  const universeSnap =
    await adminDb
      .collection("universe")
      .get();

  const instrumentMap =
    new Map<string, string>();

  universeSnap.docs.forEach(doc => {

    const d: any =
      doc.data();

    instrumentMap.set(

      d.symbol.toUpperCase(),

      `${d.exchange ?? "NSE"}:${d.symbol}`

    );

  });

  const instruments =
    symbols

      .map(s =>
        instrumentMap.get(
          s.toUpperCase()
        )
      )

      .filter(Boolean) as string[];

  console.log("==================================");
  console.log("LIVE PRICE ENGINE");
  console.log("Symbols Requested :", symbols.length);
  console.log("Universe Stocks   :", universeSnap.size);
  console.log("Instruments Found :", instruments.length);

  if (!instruments.length) {

    console.log("❌ No instruments found");

    return {};

  }

  try {

    const quotes =
      await kite.getQuote(
        instruments
      );

    console.log(
      "Quotes Returned  :",
      Object.keys(quotes).length
    );

    const prices:
      Record<string, number> = {};

    Object.entries(quotes)
      .forEach(
        ([instrument, quote]: any) => {

          const symbol =
            instrument.split(":")[1];

          prices[symbol] =
            Number(
              quote.last_price ?? 0
            );

        }
      );

    console.log(
      "Prices Built     :",
      Object.keys(prices).length
    );

    console.log("==================================");

    return prices;

  }
  catch (error) {

    console.error(
      "❌ KITE getQuote ERROR",
      error
    );

    return {};

  }

}