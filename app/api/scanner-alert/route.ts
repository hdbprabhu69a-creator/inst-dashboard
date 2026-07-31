// force deployment

import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  buyZoneScanner,
} from "@/src/lib/scanners/buyZoneScanner";

import {
  sendEmail,
} from "@/src/services/email";

import {
  sendWhatsApp,
} from "@/src/services/whatsapp";

export async function GET() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    const stocks: any[] =
      snapshot.docs.map(
        (d) => ({

          id: d.id,

          ...(d.data() as any),

        })
      );

    const buyZoneStocks =
      stocks.filter(
        (stock: any) => {

          const result =
            buyZoneScanner(
              stock
            );

          return (
            result.inBuyZone
          );

        }
      );

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const newAlerts: any[] =
      [];

    for (
      const stock of buyZoneStocks
    ) {

      const alertId =
        `BUYZONE_${stock.symbol}_${today}`;

      const alertRef =
        doc(
          db,
          "scannerAlerts",
          alertId
        );

      const existing =
        await getDoc(
          alertRef
        );

      if (
        existing.exists()
      ) {

        continue;

      }

      await setDoc(
        alertRef,
        {

          symbol:
            stock.symbol,

          scanner:
            "BUYZONE",

          cmp:
            stock.cmp,

          alertDate:
            today,

          createdAt:
            Date.now(),

        }
      );

      newAlerts.push({

        symbol:
          stock.symbol,

        cmp:
          stock.cmp,

      });

    }

    let emailSent =
      false;

    let whatsappSent =
      false;

    if (
      newAlerts.length > 0
    ) {

      const message =

`ðŸš¨ BUYZONE ALERT

${newAlerts
  .map(
    (
      stock: any,
      index: number
    ) =>

`${index + 1}. ${stock.symbol}
CMP: â‚¹${stock.cmp}`

  )
  .join("\n\n")}

INST Dashboard`;

      try {

        await sendEmail(

          "BUYZONE ALERT",

          message

        );

        emailSent =
          true;
} catch (
        error
      ) {

        console.error(
          "EMAIL ERROR:",
          error
        );

      }

      try {
await sendWhatsApp(
          message
        );

        whatsappSent =
          true;
} catch (
        error
      ) {

        console.error(
          "WHATSAPP ERROR:",
          error
        );

      }

    }

    return NextResponse.json({

      success: true,

      totalStocks:
        stocks.length,

      buyZoneCount:
        buyZoneStocks.length,

      newAlertCount:
        newAlerts.length,

      emailSent,

      whatsappSent,

      newAlerts,

    });

  } catch (
    error: any
  ) {

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

