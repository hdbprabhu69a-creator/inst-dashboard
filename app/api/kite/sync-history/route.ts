import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {
  try {

    const tokenDoc = await getDoc(
      doc(db, "settings", "kite")
    );

    const accessToken =
      tokenDoc.data()?.accessToken;

    if (!accessToken) {
      throw new Error(
        "No Access Token Found"
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

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    let updated = 0;

    for (const stockDoc of universeSnapshot.docs) {

      const stock =
        stockDoc.data();

      const instrumentToken =
        stock.instrumentToken;

      if (!instrumentToken) {
        continue;
      }

      const today =
        new Date();

      const fromDate =
        new Date();

      fromDate.setDate(
        today.getDate() - 365
      );

      const history =
        await kite.getHistoricalData(
          instrumentToken,
          "day",
          fromDate,
          today,
          false
        );

      for (const candle of history) {

        const d =
          new Date(
            candle.date
          );

        const date =
          d.toLocaleDateString(
            "en-CA",
            {
              timeZone:
                "Asia/Kolkata",
            }
          );

        await setDoc(

          doc(
            db,
            "universe",
            stockDoc.id,
            "history",
            date
          ),

          {
            date,

            open:
              candle.open,

            high:
              candle.high,

            low:
              candle.low,

            close:
              candle.close,

            volume:
              candle.volume,

            updatedAt:
              new Date()
                .toISOString(),
          }

        );

      }

      updated++;

    }

    return NextResponse.json({
      success: true,
      updated,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error:
        error.message,
    });

  }
}
console.log(
  "RAW DATE:",
  candle.date
);

console.log(
  "ISO DATE:",
  candle.date.toISOString()
);