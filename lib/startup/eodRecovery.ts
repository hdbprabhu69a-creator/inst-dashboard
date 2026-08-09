import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { KiteConnect } from "kiteconnect";

import {
  getCachedAccessToken,
} from "@/lib/kite/tokenCache";

import {
  loadInstrumentMap,
  getDailyCandles,
} from "@/src/lib/kiteData";

import {
  generateMarketStructure,
} from "@/lib/market/generateMarketStructure";


const EOD_STATUS_COLLECTION =
  "settings";

const EOD_STATUS_DOCUMENT =
  "eodStatus";


async function getLatestTradingDate() {

  console.log(
    "[AUTO POWER] Getting latest trading date from Kite..."
  );

  const accessToken =
    await getCachedAccessToken();

  if (!accessToken) {

    console.log(
      "[AUTO POWER] Kite access token unavailable."
    );

    return null;
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

  const token =
    instrumentMap.get(
      "NSE:SBIN"
    );

  if (!token) {

    console.log(
      "[AUTO POWER] SBIN token not found."
    );

    return null;
  }

  const candles =
    await getDailyCandles(
      kite,
      Number(token)
    );

  if (
    !candles ||
    candles.length === 0
  ) {

    console.log(
      "[AUTO POWER] No Kite daily candles."
    );

    return null;
  }

  const latest =
    candles[
      candles.length - 1
    ];

  if (!latest?.date) {

    console.log(
      "[AUTO POWER] Latest candle has no date."
    );

    return null;
  }

  const latestDate =
    new Date(
      latest.date
    )
      .toISOString()
      .split("T")[0];

  console.log(
    "[AUTO POWER] Latest completed trading date:",
    latestDate
  );

  return latestDate;
}


async function getLastRunDate() {

  const statusRef =
    doc(
      db,
      EOD_STATUS_COLLECTION,
      EOD_STATUS_DOCUMENT
    );

  const snapshot =
    await getDoc(
      statusRef
    );

  if (!snapshot.exists()) {

    console.log(
      "[AUTO POWER] No EOD checkpoint found."
    );

    return null;
  }

  const lastRunDate =
    snapshot.data()
      ?.lastRunDate;

  console.log(
    "[AUTO POWER] Last processed EOD date:",
    lastRunDate ?? "NONE"
  );

  return (
    typeof lastRunDate === "string"
      ? lastRunDate
      : null
  );
}


export async function runPendingEODIfRequired() {

  console.log(
    "============================================"
  );

  console.log(
    "[AUTO POWER] EOD RECOVERY CHECK"
  );

  console.log(
    "============================================"
  );


  const latestTradingDate =
    await getLatestTradingDate();

  if (!latestTradingDate) {

    console.log(
      "[AUTO POWER] Cannot determine trading date."
    );

    return {
      success: false,
      skipped: true,
      reason:
        "TRADING_DATE_UNAVAILABLE",
    };
  }


  const lastRunDate =
    await getLastRunDate();


  console.log(
    "[AUTO POWER] DATE COMPARISON:",
    {
      latestTradingDate,
      lastRunDate,
    }
  );


  /*
   * Nothing missed.
   */
  if (
    lastRunDate ===
    latestTradingDate
  ) {

    console.log(
      "[AUTO POWER] EOD already processed."
    );

    return {
      success: true,
      skipped: true,
      date:
        latestTradingDate,
    };
  }


  /*
   * EOD is missing.
   */
  console.log(
    "[AUTO POWER] MISSED EOD DETECTED."
  );

  console.log(
    "[AUTO POWER] Starting STOCK market structure..."
  );


  const stockResult =
    await generateMarketStructure({

      sourceCollection:
        "universe",

      targetCollection:
        "marketStructure",

      includeDelivery:
        true,

    });


  console.log(
    "[AUTO POWER] STOCK RESULT:",
    stockResult
  );


  if (
    !stockResult?.success
  ) {

    console.error(
      "[AUTO POWER] STOCK EOD FAILED."
    );

    return {
      success: false,
      skipped: false,
      date:
        latestTradingDate,
      stockResult,
    };
  }


  console.log(
    "[AUTO POWER] Stock structure completed."
  );

  console.log(
    "[AUTO POWER] Starting INDEX market structure..."
  );


  const indexResult =
    await generateMarketStructure({

      sourceCollection:
        "universe_indices",

      targetCollection:
        "index_market_structure",

      includeDelivery:
        false,

    });


  console.log(
    "[AUTO POWER] INDEX RESULT:",
    indexResult
  );


  if (
    !indexResult?.success
  ) {

    console.error(
      "[AUTO POWER] INDEX EOD FAILED."
    );

    /*
     * Do NOT update the checkpoint.
     *
     * This allows the next startup / scheduler
     * to retry the missed EOD.
     */
    return {
      success: false,
      skipped: false,
      date:
        latestTradingDate,
      stockResult,
      indexResult,
    };
  }


  console.log(
    "[AUTO POWER] Index structure completed."
  );


  /*
   * IMPORTANT:
   *
   * Checkpoint is written ONLY after both
   * STOCK and INDEX processing succeeds.
   */
  const statusRef =
    doc(
      db,
      EOD_STATUS_COLLECTION,
      EOD_STATUS_DOCUMENT
    );


  await setDoc(
    statusRef,
    {
      lastRunDate:
        latestTradingDate,

      session:
        "AUTO_POWER",

      updatedAt:
        serverTimestamp(),

    },
    {
      merge: true,
    }
  );


  console.log(
    "============================================"
  );

  console.log(
    "[AUTO POWER] EOD COMPLETED:",
    latestTradingDate
  );

  console.log(
    "============================================"
  );


  return {
    success: true,
    skipped: false,
    date:
      latestTradingDate,
    stockResult,
    indexResult,
  };

}
