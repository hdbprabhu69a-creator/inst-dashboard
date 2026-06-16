import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  buyZoneScanner,
} from "@/src/lib/scanners/buyZoneScanner";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN!;

const CHAT_ID =
  process.env.TELEGRAM_CHAT_ID!;

export async function GET() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    const stocks =
      snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

    const results =
      stocks
        .map(
          (stock: any) => {

            const result =
              buyZoneScanner(
                stock
              );

            return {

              symbol:
                stock.symbol,

              cmp:
                stock.cmp,

              buyZoneType:
                result.buyZoneType,

              buyZoneScore:
                result.score,

              zoneLow:
                result.zoneLow,

              zoneHigh:
                result.zoneHigh,

              inBuyZone:
                result.inBuyZone,

            };

          }
        )
        .filter(
          (
            stock: any
          ) =>
            stock.inBuyZone
        )
        .sort(
          (
            a: any,
            b: any
          ) =>
            b.buyZoneScore -
            a.buyZoneScore
        );

    const topStocks =
      results.slice(
        0,
        10
      );

    let message =

`🔥 BUY ZONE ALERT

`;

    topStocks.forEach(
      (
        stock: any
      ) => {

        message +=

`${stock.symbol}
${stock.buyZoneType}
Score: ${stock.buyZoneScore}
CMP: ${stock.cmp}
Zone: ${stock.zoneLow}-${stock.zoneHigh}

`;

      }
    );

    message +=

`Total Candidates: ${results.length}`;

    const telegramUrl =

      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(
      telegramUrl,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            chat_id:
              CHAT_ID,

            text:
              message,
          }),
      }
    );

    return NextResponse.json({

      success: true,

      sent:
        topStocks.length,

      total:
        results.length,

    });

  } catch (
    error: any
  ) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}