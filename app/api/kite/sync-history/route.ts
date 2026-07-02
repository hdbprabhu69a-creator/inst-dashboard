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

    const tokenDoc =
      await getDoc(
        doc(
          db,
          "settings",
          "kite"
        )
      );

    const accessToken = await getCachedAccessToken();

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

    let updatedStocks = 0;

    for (
      const stockDoc
      of universeSnapshot.docs
    ) {

      const stock =
        stockDoc.data();

      if (
        !stock.instrumentToken
      ) {
        continue;
      }
console.log(
        "SYNCING:",
        stock.symbol
      );

      const history =
        await kite.getHistoricalData(
          stock.instrumentToken,
          "day",
          new Date("2025-06-01"),
          new Date(),
          false
        );
for (
        const candle
        of history
      ) {

        const rawDate =
          String(
            candle.date
          );

        const saveDate =
          rawDate.substring(
            0,
            10
          );

        await setDoc(

          doc(
            db,
            "universe",
            stockDoc.id,
            "history",
            saveDate
          ),

          {
            date:
              saveDate,

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
updatedStocks++;

    }

    return NextResponse.json({

      success: true,

      updatedStocks,

    });

  } catch (error: any) {

    console.error(
      "SYNC HISTORY ERROR:"
    );

    console.error(
      error
    );

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}


