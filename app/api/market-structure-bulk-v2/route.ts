import {
  buildDailyStructure,
  buildWeeklyStructure,
  buildMonthlyStructure,
  buildFibLevels,
} from "@/src/lib/marketStructureEngine";
import {
  canRunEOD,
} from "@/src/lib/eodGuard";

import {
  buildAllSwings,
} from "@/src/lib/swingEngine";

import {
  getCompletedDailyCandle,
} from "@/src/lib/eodEngine";

import {
  loadInstrumentMap,
  getDailyCandles,
} from "@/src/lib/kiteData";

import {
  buildMetadata,
} from "@/src/lib/marketMetadata";

import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import { buildDeliveryData } from "@/lib/market/buildDeliveryData";
import { loadMarketData } from "@/lib/market/loadMarketData";

export async function GET() {
if (
  !canRunEOD()
) {

  return NextResponse.json({

    success: false,

    message:
      "Market Still Open",

  });

}
const indiaTime =
  new Date(
    new Date().toLocaleString(
      "en-US",
      {
        timeZone:
          "Asia/Kolkata",
      }
    )
  );

const today =
  indiaTime
    .toISOString()
    .split("T")[0];

const currentSession =

  (
    indiaTime.getHours() > 15 ||

    (
      indiaTime.getHours() === 15 &&
      indiaTime.getMinutes() >= 30
    )

  )

    ? "POST_CLOSE"

    : "PRE_CLOSE";

const eodStatusRef =
  doc(
    db,
    "settings",
    "eodStatus"
  );

const eodStatusDoc =
  await getDoc(
    eodStatusRef
  );

if (
  eodStatusDoc.exists()
) {

  const lastRunDate =
    eodStatusDoc.data()
      ?.lastRunDate;

  const lastSession =
    eodStatusDoc.data()
      ?.session;

  if (

    lastRunDate ===
      today &&

    lastSession ===
      currentSession

  ) {

    return NextResponse.json({

      success: false,

      message:
        "Already Updated Today",

    });

  }

}  try {

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

      return NextResponse.json({
        success: false,
        error: "No Access Token",
      });

    }

    const kite =
      new KiteConnect({
        api_key:
          process.env.KITE_API_KEY!,
      });

    kite.setAccessToken(
      accessToken
    );

    const instrumentMap =
      await loadInstrumentMap();
const sourceCollection = "universe";
const targetCollection = "marketStructure";
const includeDelivery = true;
    const snapshot =
      await getDocs(
        collection(
          db,
          sourceCollection
        )
      );

    const stocks: any[] =
      snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );


    let updated = 0;
    let ignored = 0;
    let failed = 0;

    const updatedSymbols: string[] = [];
    const ignoredSymbols: string[] = [];
    const failedSymbols: string[] = [];

    for (const stock of stocks) {

      try {


      } catch (error: any) {
console.log(
          error
        );

        failed++;

        failedSymbols.push(
          stock.symbol
        );

      }

    }
await setDoc(

  eodStatusRef,

  {

    lastRunDate:
      today,

    session:
      currentSession,

    updatedAt:
      serverTimestamp(),

  },

  {
    merge: true,
  }

);

    return NextResponse.json({

      success: true,

      total:
        stocks.length,

      updated,

      ignored,

      failed,

      updatedSymbols,

      ignoredSymbols,

      failedSymbols,

      message:
        "BULK V2 COMPLETE",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}
















