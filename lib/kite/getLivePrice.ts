import {
  KiteConnect,
} from "kiteconnect";

import {
  adminDb,
} from "@/lib/firebase-admin";

const INDEX_SYMBOL_MAP:Record<string,string>={

  NIFTY:"NSE:NIFTY 50",

  BANKNIFTY:"NSE:NIFTY BANK",

  FINNIFTY:"NSE:NIFTY FIN SERVICE",

  MIDCPNIFTY:"NSE:NIFTY MID SELECT",

  NIFTYNXT50:"NSE:NIFTY NEXT 50",

};

export async function getLivePrice(
  symbol:string
){

  const tokenDoc=
    await adminDb
      .collection("settings")
      .doc("kite")
      .get();

  if(!tokenDoc.exists)
    return 0;

  const accessToken=
    tokenDoc.data()?.accessToken;

  if(!accessToken)
    return 0;

  const kite=
    new KiteConnect({

      api_key:
        process.env.KITE_API_KEY!

    });

  kite.setAccessToken(
    accessToken
  );

  const indexDoc=
    await adminDb
      .collection("universe_indices")
      .doc(symbol)
      .get();

  if(!indexDoc.exists)
    return 0;

  const index=
    indexDoc.data()!;

  const instrument=
    `${index.exchange}:${index.kiteSymbol}`;

  const quote=
    await kite.getQuote([
      instrument
    ]);

  console.log({
    symbol,
    instrument,
    quote:
      quote[instrument]
  });

  return Number(
    quote[instrument]
      ?.last_price
      ??
      0
  );

}

