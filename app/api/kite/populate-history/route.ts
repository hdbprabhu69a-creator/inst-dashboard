import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
  doc,
  query,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import { getHistoricalCandles } from "@/lib/kite/historical";

type Candle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const sleep = (ms: number) =>
  new Promise(r => setTimeout(r, ms));

function dateString(d: Date) {
  return d.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

function completedTradingDate() {

  const now = new Date();

  const ist = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );

  const d = new Date(ist);

  const day = d.getDay();

  const closed =
    d.getHours() > 15 ||
    (
      d.getHours() === 15 &&
      d.getMinutes() >= 30
    );

  if (day === 6) {

    d.setDate(d.getDate() - 1);

  } else if (day === 0) {

    d.setDate(d.getDate() - 2);

  } else if (!closed) {

    d.setDate(d.getDate() - 1);

    if (d.getDay() === 0) {

      d.setDate(d.getDate() - 2);

    } else if (d.getDay() === 6) {

      d.setDate(d.getDate() - 1);

    }
  }

  return dateString(d);
}

function normalize(rows: any[]): Candle[] {

  return rows.map(c => {

    const utc = new Date(c.date);

    const ist = new Date(
      utc.getTime() +
      5.5 * 60 * 60 * 1000
    );

    return {

      date: [
        ist.getUTCFullYear(),
        String(
          ist.getUTCMonth() + 1
        ).padStart(2, "0"),
        String(
          ist.getUTCDate()
        ).padStart(2, "0"),
      ].join("-"),

      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume ?? 0),

    };
  });
}

export async function GET() {

  const started = Date.now();

  try {

    const token =
      await getCachedAccessToken();

    if (!token) {

      return NextResponse.json(
        {
          success: false,
          error: "No Access Token",
        },
        {
          status: 401,
        }
      );
    }

    const targetDate =
      completedTradingDate();

    console.log(
      "[HISTORY] TARGET:",
      targetDate
    );

    const stocks =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    let updatedStocks = 0;
    let currentStocks = 0;
    let firstLoadStocks = 0;
    let repairedStocks = 0;
    let newCandles = 0;
    let failed = 0;

    for (
      const stockDoc of stocks.docs
    ) {

      const stock =
        stockDoc.data();

      const symbol =
        stock.symbol ??
        stockDoc.id;

      if (!stock.instrumentToken) {
        continue;
      }

      const history =
        collection(
          db,
          "universe",
          stockDoc.id,
          "history"
        );

      const latestSnap =
        await getDocs(
          query(
            history,
            orderBy(
              "date",
              "desc"
            ),
            limit(1)
          )
        );

      let from: Date;

      let latestStoredDate:
        string | null = null;

      let isFirstLoad = false;

      if (
        latestSnap.empty
      ) {

        /*
         * FIRST LOAD
         * --------------------
         * Load 2 years.
         */

        firstLoadStocks++;

        isFirstLoad = true;

        from = new Date();

        from.setFullYear(
          from.getFullYear() - 2
        );

      } else {

        latestStoredDate =
          latestSnap.docs[0]
            .data()
            .date;

        /*
         * OVERLAP REPAIR
         * --------------------
         *
         * Do NOT skip when latest
         * date is already current.
         *
         * Re-fetch the last 7
         * calendar days so that
         * incorrect existing candles
         * are repaired.
         */

        from =
          new Date(
            `${latestStoredDate}T00:00:00`
          );

        from.setDate(
          from.getDate() - 30
        );

        /*
         * If latest stored date is
         * already current, this is
         * a repair/verification run.
         */

      if (
  latestStoredDate &&
  latestStoredDate >= targetDate
) {

  currentStocks++;

}

      }

      const to =
        new Date(
          `${targetDate}T23:59:59+05:30`
        );

      console.log(
        "[HISTORY]",
        symbol,
        "FROM:",
        dateString(from),
        "TO:",
        targetDate,
        isFirstLoad
          ? "FIRST LOAD"
          : "OVERLAP REPAIR"
      );

      let raw: any[];

      try {

        raw =
          await getHistoricalCandles(
            Number(
              stock.instrumentToken
            ),
            from,
            to,
            "day"
          );

      } catch (e: any) {

        failed++;

        console.error(
          "[HISTORY] FAILED",
          symbol,
          e?.message
        );

        continue;
      }

      const candles =
        normalize(raw);

      /*
       * FIRST LOAD
       * --------------------
       * Write everything.
       *
       * EXISTING HISTORY
       * --------------------
       * Write the overlap window
       * again, including existing
       * documents.
       *
       * This repairs bad OHLC values.
       */

      const writable =
        candles.filter(c => {

          if (
            c.date > targetDate
          ) {
            return false;
          }

          if (
            !latestStoredDate
          ) {
            return true;
          }

          const overlapStart =
            dateString(from);

          return (
            c.date >= overlapStart
          );

        });

      if (
        !writable.length
      ) {

        continue;
      }

      let batch =
        writeBatch(db);

      let ops = 0;

      let repairedThisStock = false;

      for (
        const candle of writable
      ) {

        const ref =
          doc(
            db,
            "universe",
            stockDoc.id,
            "history",
            candle.date
          );

        /*
         * IMPORTANT:
         *
         * merge:true allows an
         * existing wrong candle
         * to be corrected.
         */

        batch.set(
          ref,
          {
            ...candle,

            symbol,

            instrumentToken:
              stock.instrumentToken,

            updatedAt:
              new Date().toISOString(),

          },
          {
            merge: true,
          }
        );

        ops++;

        newCandles++;

        if (
          latestStoredDate &&
          candle.date <= latestStoredDate
        ) {

          repairedThisStock = true;

        }

        if (
          ops === 400
        ) {

          await batch.commit();

          batch =
            writeBatch(db);

          ops = 0;
        }

      }

      if (ops) {

        await batch.commit();

      }

      if (
        repairedThisStock
      ) {

        repairedStocks++;

      }

      updatedStocks++;

      await sleep(250);

    }

    console.log(
      "================================"
    );

    console.log(
      "[HISTORY] COMPLETE"
    );

    console.log(
      "TARGET:",
      targetDate
    );

    console.log(
      "UPDATED STOCKS:",
      updatedStocks
    );

    console.log(
      "ALREADY CURRENT:",
      currentStocks
    );

    console.log(
      "FIRST LOAD:",
      firstLoadStocks
    );

    console.log(
      "REPAIRED STOCKS:",
      repairedStocks
    );

    console.log(
      "WRITTEN CANDLES:",
      newCandles
    );

    console.log(
      "FAILED:",
      failed
    );

    console.log(
      "TIME:",
      (
        (Date.now() - started) /
        1000
      ).toFixed(2),
      "sec"
    );

    console.log(
      "================================"
    );

    return NextResponse.json({

      success:
        failed === 0,

      targetDate,

      totalStocks:
        stocks.size,

      updatedStocks,

      currentStocks,

      firstLoadStocks,

      repairedStocks,

      newCandles,

      failed,

    });

  } catch (error: any) {

    console.error(
      "[HISTORY] ERROR:",
      error?.message
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ??
          String(error),

      },
      {
        status: 500,
      }
    );

  }
}