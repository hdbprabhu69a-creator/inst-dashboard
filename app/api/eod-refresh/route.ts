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
    // RUN BULK UPDATE
    //

    const baseUrl =
      process.env
        .NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const response =
      await fetch(
        `${baseUrl}/api/market-structure-bulk-v2`
      );

    const result =
      await response.json();

    if (
      !result.success
    ) {

      return NextResponse.json({
        success: false,
        error:
          result.error,
      });

    }

    //
    // SAVE EOD DATE
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

    return NextResponse.json({

      success: true,

      updated:
        result.updated,

      ignored:
        result.ignored,

      failed:
        result.failed,

      timestamp:
        new Date()
          .toISOString(),

      message:
        "EOD REFRESH COMPLETE",

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