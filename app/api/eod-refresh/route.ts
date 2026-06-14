import { NextResponse } from "next/server";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    //
    // CURRENT IST TIME
    //

    const now =
      new Date();

    const istNow =
      new Date(
        now.toLocaleString(
          "en-US",
          {
            timeZone:
              "Asia/Kolkata",
          }
        )
      );

    const hours =
      istNow.getHours();

    const minutes =
      istNow.getMinutes();

    //
    // BLOCK BEFORE 3:30 PM
    //

    const beforeMarketClose =
      hours < 15 ||
      (
        hours === 15 &&
        minutes < 30
      );

    if (
      beforeMarketClose
    ) {

      return NextResponse.json({

        success: false,

        message:
          "Market not closed. Press EOD after 3:30 PM",

      });

    }

    //
    // TODAY DATE
    //

    const today =
      istNow
        .toISOString()
        .split("T")[0];

    //
    // CHECK LAST EOD
    //

    const eodRef =
      doc(
        db,
        "settings",
        "eod"
      );

    const eodSnap =
      await getDoc(
        eodRef
      );

    const lastEodDate =
      eodSnap.data()
        ?.lastEodDate;

    if (
      lastEodDate === today
    ) {

      return NextResponse.json({

        success: false,

        message:
          "EOD already completed today",

      });

    }

    //
    // BASE URL
    //

    const baseUrl =
      process.env
        .NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    //
    // RUN MARKET STRUCTURE
    //

    const structureResponse =
      await fetch(
        `${baseUrl}/api/market-structure-bulk-v2`
      );

    const structureResult =
      await structureResponse.json();

    if (
      !structureResult.success
    ) {

      return NextResponse.json({

        success: false,

        error:
          structureResult.error,

      });

    }

    //
    // RUN DELIVERY IMPORT
    //

    const deliveryResponse =
      await fetch(
        `${baseUrl}/api/delivery-bulk`
      );

    const deliveryResult =
      await deliveryResponse.json();

    if (
      !deliveryResult.success
    ) {

      return NextResponse.json({

        success: false,

        error:
          deliveryResult.error,

      });

    }

    //
    // SAVE EOD STATUS
    //

    await setDoc(

      eodRef,

      {

        lastEodDate:
          today,

        updatedAt:
          new Date()
            .toISOString(),

      },

      {
        merge: true,
      }

    );

    //
    // SUCCESS
    //

    return NextResponse.json({

      success: true,

      updated:
        structureResult.updated,

      ignored:
        structureResult.ignored,

      failed:
        structureResult.failed,

      deliveryFiles:
        deliveryResult.files,

      deliveryRecords:
        deliveryResult.written,

      timestamp:
        new Date()
          .toISOString(),

      message:
        "EOD + DELIVERY COMPLETE",

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