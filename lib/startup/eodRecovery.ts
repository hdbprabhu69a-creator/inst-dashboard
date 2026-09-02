import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { calculateTechnical } from "@/lib/technical/technicalEngine";

import {
  generateMarketStructure,
} from "@/lib/market/generateMarketStructure";

const EOD_STATUS_COLLECTION =
  "settings";

const EOD_STATUS_DOCUMENT =
  "eod";

const BASE_URL =
  "http://localhost:3000";

const HISTORY_API =
  `${BASE_URL}/api/kite/populate-history`;

async function updateHistory() {

  const maxAttempts = 5;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {

    try {

      console.log(
        `[AUTO POWER] History update attempt ${attempt}/${maxAttempts}`
      );

      const response =
        await fetch(
          HISTORY_API,
          {
            cache: "no-store",
          }
        );

      if (response.ok) {

        const result =
          await response.json();

        if (!result?.success) {

          throw new Error(
            "History update failed"
          );

        }

        console.log(
          "[AUTO POWER] History update completed:",
          result
        );

        return result;
      }

      console.log(
        `[AUTO POWER] History API HTTP ${response.status}`
      );

    } catch (error: any) {

      console.log(
        `[AUTO POWER] History attempt ${attempt} failed:`,
        error?.message ??
          String(error)
      );

      if (
        attempt === maxAttempts
      ) {

        throw error;

      }

    }

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          3000
        )
    );

  }

  throw new Error(
    "History update failed after startup retries."
  );
}

async function getLatestTradingDate() {

  console.log(
    "[AUTO POWER] Determining latest completed trading date..."
  );

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

  let target =
    new Date(istNow);

  const hours =
    target.getHours();

  const minutes =
    target.getMinutes();

  const marketClosed =
    hours > 15 ||
    (
      hours === 15 &&
      minutes >= 30
    );

  console.log(
    "[AUTO POWER] IST:",
    istNow.toString()
  );

  console.log(
    "[AUTO POWER] Market closed:",
    marketClosed
  );

  /*
   * Before 3:30 PM:
   * today's trading session is not completed.
   */
  if (!marketClosed) {

    target.setDate(
      target.getDate() - 1
    );

  }

  /*
   * Saturday -> Friday
   */
  if (
    target.getDay() === 6
  ) {

    target.setDate(
      target.getDate() - 1
    );

  }

  /*
   * Sunday -> Friday
   */
  if (
    target.getDay() === 0
  ) {

    target.setDate(
      target.getDate() - 2
    );

  }

  const yyyy =
    target.getFullYear();

  const mm =
    String(
      target.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const dd =
    String(
      target.getDate()
    ).padStart(
      2,
      "0"
    );

  const latestTradingDate =
    `${yyyy}-${mm}-${dd}`;

  console.log(
    "[AUTO POWER] Latest completed trading date:",
    latestTradingDate
  );

  return latestTradingDate;
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

  if (
    !snapshot.exists()
  ) {

    console.log(
      "[AUTO POWER] No EOD checkpoint found."
    );

    return null;
  }

  const lastRunDate =
    snapshot
      .data()
      ?.lastRunDate;

  console.log(
    "[AUTO POWER] Last processed EOD date:",
    lastRunDate ??
      "NONE"
  );

  return (
    typeof lastRunDate ===
    "string"
      ? lastRunDate
      : null
  );
}

async function updateTechnicalAnalysisEOD() {

  const stocks = await getDocs(
    collection(db, "universe")
  );

  const batch = writeBatch(db);
  let writes = 0;

  for (const stock of stocks.docs) {

    const symbol = stock.data()?.symbol;
    if (!symbol) continue;

    const history = await getDocs(
      collection(
        db,
        "universe",
        stock.id,
        "history"
      )
    );

    const candles = history.docs
      .map(d => {
        const x = d.data();

        return {
          time: String(x.date),
          open: Number(x.open),
          high: Number(x.high),
          low: Number(x.low),
          close: Number(x.close),
          volume: Number(x.volume ?? 0),
        };
      })
      .filter(x =>
        x.time &&
        Number.isFinite(x.open) &&
        Number.isFinite(x.high) &&
        Number.isFinite(x.low) &&
        Number.isFinite(x.close)
      )
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );

    if (!candles.length) continue;

    for (const timeframe of ["D", "W", "M"] as const) {

      const rows =
        calculateTechnical(
          candles,
          timeframe
        );

      const row =
        rows[rows.length - 1];

      if (!row) continue;

      batch.set(
        doc(
          db,
          "technical_analysis",
          `${symbol}_${timeframe}_${row.date}`
        ),
        {
          ...row,
          symbol,
          timeframe,
          source: "eod-auto-update",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      writes++;
    }
  }

  if (writes) {
    await batch.commit();
  }

  return {
    success: true,
    stocks: stocks.size,
    writes,
  };
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

  /*
   * Determine the actual completed
   * trading session from IST.
   */
  const latestTradingDate =
    await getLatestTradingDate();

  if (
    !latestTradingDate
  ) {

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

  /*
   * Read EOD checkpoint.
   */
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
   * Nothing missing.
   */
  if (
    lastRunDate ===
    latestTradingDate
  ) {

    console.log(
      "[AUTO POWER] EOD already processed. Updating Technical Analysis..."
    );

    let technicalResult;

    try {

      technicalResult =
        await updateTechnicalAnalysisEOD();

    } catch (error: any) {

      return {
        success: false,
        skipped: true,
        date:
          latestTradingDate,
        reason:
          "TECHNICAL_ANALYSIS_FAILED",
        error:
          error?.message ??
          String(error),
      };
    }

    return {
      success: true,
      skipped: true,
      date:
        latestTradingDate,
      technicalResult,
    };
  }
/*
   * EOD is missing.
   */
  console.log(
    "[AUTO POWER] MISSED EOD DETECTED."
  );

  /*
   * Update completed trading history.
   */
  console.log(
    "[AUTO POWER] Updating completed trading history..."
  );

  let historyResult;

  try {

    historyResult =
      await updateHistory();

  } catch (error: any) {

    console.error(
      "[AUTO POWER] HISTORY UPDATE FAILED:",
      error?.message ??
        String(error)
    );

    return {
      success: false,
      skipped: false,
      date:
        latestTradingDate,
      reason:
        "HISTORY_UPDATE_FAILED",
      error:
        error?.message ??
        String(error),
    };
  }

  console.log(
    "[AUTO POWER] History completed."
  );

  /*
   * STOCK market structure.
   */
  console.log(
    "[AUTO POWER] Starting STOCK market structure..."
  );

  let stockResult;

  try {

    stockResult =
      await generateMarketStructure({

        sourceCollection:
          "universe",

        targetCollection:
          "marketStructure",

        includeDelivery:
          true,

      });

  } catch (error: any) {

    console.error(
      "[AUTO POWER] STOCK EOD FAILED:",
      error?.message ??
        String(error)
    );

    return {
      success: false,
      skipped: false,
      date:
        latestTradingDate,
      historyResult,
      reason:
        "STOCK_STRUCTURE_FAILED",
      error:
        error?.message ??
        String(error),
    };
  }

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
      historyResult,
      stockResult,
    };
  }

  console.log(
    "[AUTO POWER] Stock structure completed."
  );

  /*
   * INDEX market structure.
   */
  console.log(
    "[AUTO POWER] Starting INDEX market structure..."
  );

  let indexResult;

  try {

    indexResult =
      await generateMarketStructure({

        sourceCollection:
          "universe_indices",

        targetCollection:
          "index_market_structure",

        includeDelivery:
          false,

      });

  } catch (error: any) {

    console.error(
      "[AUTO POWER] INDEX EOD FAILED:",
      error?.message ??
        String(error)
    );

    return {
      success: false,
      skipped: false,
      date:
        latestTradingDate,
      historyResult,
      stockResult,
      reason:
        "INDEX_STRUCTURE_FAILED",
      error:
        error?.message ??
        String(error),
    };
  }

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
     * Do NOT update checkpoint.
     *
     * Next startup will retry.
     */
    return {
      success: false,
      skipped: false,
      date:
        latestTradingDate,
      historyResult,
      stockResult,
      indexResult,
    };
  }

  console.log(
    "[AUTO POWER] Index structure completed."
  );

  /*
   * TECHNICAL ANALYSIS
   */
  let technicalResult;

  try {

    technicalResult =
      await updateTechnicalAnalysisEOD();

  } catch (error: any) {

    console.error(
      "[AUTO POWER] TECHNICAL ANALYSIS FAILED:",
      error?.message ?? String(error)
    );

    return {
      success: false,
      skipped: false,
      date: latestTradingDate,
      historyResult,
      stockResult,
      indexResult,
      reason: "TECHNICAL_ANALYSIS_FAILED",
      error: error?.message ?? String(error),
    };
  }
  /*
   * Checkpoint is written ONLY after:
   *
   * 1. History
   * 2. Stock structure
   * 3. Index structure
   *
   * all succeed.
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

    historyResult,

    stockResult,

    indexResult,
  };
}




