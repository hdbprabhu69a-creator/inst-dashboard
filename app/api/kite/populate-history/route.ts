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
    await getDoc(
      doc(
        db,
        "settings",
        "kite"
      )
    );

  if (!tokenDoc.exists()) {
    throw new Error(
      "Kite settings not found."
    );
  }

  const accessToken =
    tokenDoc.data()?.accessToken;

  if (!accessToken) {
    throw new Error(
      "Access token missing."
    );
  }

  const kite =
    new KiteConnect({
      api_key:
        process.env.KITE_API_KEY!,
    });

  kite.setAccessToken(
    accessToken
  );

  return kite;

}

function normalize(
  candles: any[]
): Candle[] {

  return candles.map(
    (c) => ({

      date:
        String(c.date)
          .substring(0, 10),

      open:
        Number(c.open),

      high:
        Number(c.high),

      low:
        Number(c.low),

      close:
        Number(c.close),

      volume:
        Number(
          c.volume ?? 0
        ),

    })
  );

}

export async function GET() {

  try {

    const kite =
      await getKite();

    const snapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    let totalStocks = 0;
    let totalCandles = 0;

    for (
      const stockDoc
      of snapshot.docs
    ) {

      const stock =
        stockDoc.data();

      if (
        !stock.instrumentToken
      ) {

        console.log(
          "SKIPPED:",
          stock.symbol
        );

        continue;

      }

      console.log(
        "================================="
      );

      console.log(
        "FETCHING:",
        stock.symbol
      );

      const from =
        new Date();

      from.setFullYear(
        from.getFullYear() - 2
      );

      const to =
        new Date();

      const raw =
        await kite.getHistoricalData(
          Number(
            stock.instrumentToken
          ),
          "day",
          from,
          to,
          false,
          false
        );

      const candles =
        normalize(raw);

      totalStocks++;
      totalCandles +=
        candles.length;

      // PART 4 STARTS HERE

