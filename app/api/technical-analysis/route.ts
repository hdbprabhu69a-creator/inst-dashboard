import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  calculateTechnical,
  Candle,
} from "@/lib/technical/technicalEngine";


function buildWeeklyOHLC(candles: Candle[]) {
  const groups: Record<string, Candle[]> = {};

  for (const candle of candles) {
    const d = new Date(candle.time + "T00:00:00");
    const day = d.getDay() || 7;

    const monday = new Date(d);
    monday.setDate(d.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);

    const key = monday.toISOString().slice(0, 10);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(candle);
  }

  const result: Record<string, Candle> = {};

  for (const key of Object.keys(groups)) {
    const group = groups[key].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    result[group[group.length - 1].time] = {
      time: group[group.length - 1].time,
      open: group[0].open,
      high: Math.max(...group.map(x => x.high)),
      low: Math.min(...group.map(x => x.low)),
      close: group[group.length - 1].close,
      volume: group.reduce(
        (sum, x) => sum + x.volume,
        0
      ),
    };
  }

  return result;
}

function attachOHLC(
  technical: any[],
  candles: Candle[],
  timeframe: "D" | "W" | "M"
) {
  const dailyMap: Record<string, Candle> = {};

  for (const candle of candles) {
    dailyMap[candle.time] = candle;
  }

  const weeklyMap =
    timeframe === "W"
      ? buildWeeklyOHLC(candles)
      : {};

  return technical.map((row: any) => {
    const candle =
      timeframe === "W"
        ? weeklyMap[row.date]
        : dailyMap[row.date];

    return {
      ...row,
      high: candle?.high ?? null,
      low: candle?.low ?? null,
      close: candle?.close ?? null,
    };
  });
}
export async function GET(
  request: NextRequest
) {
  try {
    const symbol =
      (
        request.nextUrl.searchParams.get(
          "symbol"
        ) ?? ""
      )
        .trim()
        .toUpperCase();

    const timeframe = (request.nextUrl.searchParams.get("tf") ?? "D") as "D" | "W" | "M";

    const refresh = request.nextUrl.searchParams.get("refresh") === "1";

    if (!symbol) {
      return NextResponse.json({
        success: false,
        error: "Missing symbol",
      });
    }

    if (
      !["D", "W", "M"].includes(
        timeframe
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid timeframe",
        },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * 1. READ TECHNICAL CACHE FIRST
     * =====================================================
     *
     * Separate Firestore collection:
     *
     * technical_analysis
     *
     * One document contains ALL indicators for
     * one stock + timeframe + date.
     */

    const technicalSnap =
      await getDocs(
        query(
          collection(
            db,
            "technical_analysis"
          ),
          where(
            "symbol",
            "==",
            symbol
          ),
          where(
            "timeframe",
            "==",
            timeframe
          )
        )
      );

    if (!technicalSnap.empty && !refresh) {

      const cachedRows = technicalSnap.docs.map(
        (d: any) => d.data()
      );

      const stockSnap = await adminDb
        .collection("universe")
        .where("symbol", "==", symbol.toUpperCase())
        .limit(1)
        .get();

      let historyRows: any[] = [];

      if (!stockSnap.empty) {

        const stockId = stockSnap.docs[0].id;

        const historySnap = await adminDb
          .collection("universe")
          .doc(stockId)
          .collection("history")
          .orderBy("date")
          .get();

        historyRows = historySnap.docs.map(
          (d: any) => d.data()
        );
      }

      const dailyOHLC: Record<string, any> = {};

      for (const row of historyRows) {

        const date =
          String(row.date).substring(0, 10);

        dailyOHLC[date] = {
          high: Number(row.high),
          low: Number(row.low),
          close: Number(row.close),
        };
      }

      const weeklyOHLC: Record<string, any> = {};

      if (timeframe === "W") {

        const groups: Record<string, any[]> = {};

        for (const row of historyRows) {

          const date =
            String(row.date).substring(0, 10);

          const d =
            new Date(date + "T00:00:00");

          const day =
            d.getDay() || 7;

          const monday =
            new Date(d);

          monday.setDate(
            d.getDate() - day + 1
          );

          const key =
            monday.toISOString().substring(0, 10);

          if (!groups[key]) {
            groups[key] = [];
          }

          groups[key].push({
            date,
            open: Number(row.open),
            high: Number(row.high),
            low: Number(row.low),
            close: Number(row.close),
          });
        }

        for (const key of Object.keys(groups)) {

          const group =
            groups[key].sort(
              (a, b) =>
                a.date.localeCompare(b.date)
            );

          const last =
            group[group.length - 1];

          weeklyOHLC[last.date] = {
            high: Math.max(
              ...group.map(x => x.high)
            ),
            low: Math.min(
              ...group.map(x => x.low)
            ),
            close: last.close,
          };
        }
      }

      const data = cachedRows.map(
        (row: any) => {

          const ohlc =
            timeframe === "W"
              ? weeklyOHLC[row.date]
              : dailyOHLC[row.date];

          return {
            ...row,
            high:
              row.high ??
              ohlc?.high ??
              null,
            low:
              row.low ??
              ohlc?.low ??
              null,
            close:
              row.close ??
              ohlc?.close ??
              null,
          };
        }
      );

      return NextResponse.json({
        success: true,
        source: "firestore-cache",
        symbol,
        timeframe,
        data,
      });
    }

    /*
     * =====================================================
     * 2. CACHE MISS
     * =====================================================
     *
     * Use the SAME Firestore history source
     * used by /api/history.
     */

    const stockSnap =
      await getDocs(
        query(
          collection(
            db,
            "universe"
          ),
          where(
            "symbol",
            "==",
            symbol
          )
        )
      );

    if (stockSnap.empty) {
      return NextResponse.json({
        success: false,
        error:
          "Stock not found in universe",
      });
    }

    const stockId =
      stockSnap.docs[0].id;

    const historySnap =
      await getDocs(
        query(
          collection(
            db,
            "universe",
            stockId,
            "history"
          ),
          orderBy("date")
        )
      );

    const candles: Candle[] =
      historySnap.docs
        .map((doc) => {
          const d: any =
            doc.data();

          return {
            time: String(
              d.date ?? ""
            ).slice(0, 10),

            open: Number(
              d.open ?? 0
            ),

            high: Number(
              d.high ?? 0
            ),

            low: Number(
              d.low ?? 0
            ),

            close: Number(
              d.close ?? 0
            ),

            volume: Number(
              d.volume ?? 0
            ),
          };
        })
        .filter(
          (x: Candle) =>
            !!x.time &&
            x.close > 0 &&
            x.high > 0 &&
            x.low > 0
        )
        .sort(
          (a: Candle, b: Candle) =>
            a.time.localeCompare(
              b.time
            )
        );

    if (!candles.length) {
      return NextResponse.json({
        success: true,
        source: "history",
        symbol,
        timeframe,
        data: [],
      });
    }

    /*
     * =====================================================
     * 3. CALCULATE D / W / M
     * =====================================================
     */

    const calculated =
      calculateTechnical(
        candles,
        timeframe
      );

    const technical =
      attachOHLC(
        calculated,
        candles,
        timeframe
      );

    /*
     * =====================================================
     * 4. STORE IN SEPARATE COLLECTION
     * =====================================================
     *
     * Document ID:
     *
     * SYMBOL_TIMEFRAME_DATE
     *
     * Example:
     *
     * SBIN_D_2026-08-13
     */

    const batchSize = 400;

    for (
      let start = 0;
      start < technical.length;
      start += batchSize
    ) {
      const chunk =
        technical.slice(
          start,
          start + batchSize
        );

      const batchWrites =
        chunk.map(async (row) => {
          const id =
            `${symbol}_${timeframe}_${row.date}`;

          /*
           * Firebase client SDK does not expose
           * server-side batch writes here.
           *
           * Use a direct document write.
           */
          const { setDoc, doc } =
            await import(
              "firebase/firestore"
            );

          await setDoc(
            doc(
              db,
              "technical_analysis",
              id
            ),
            {
              symbol,
              timeframe,
              date: row.date,

              rsi: row.rsi,
              adx: row.adx,
              plusDI: row.plusDI,
              minusDI: row.minusDI,

              macd: row.macd,
              signal: row.signal,
              histogram:
                row.histogram,

              cci: row.cci,

              updatedAt:
                new Date()
            },
            {
              merge: true
            }
          );
        });

      await Promise.all(
        batchWrites
      );
    }

    /*
     * =====================================================
     * 5. RETURN DATA
     * =====================================================
     */

    return NextResponse.json({
      success: true,
      source:
        "calculated-and-stored",
      symbol,
      timeframe,
      data: technical
        .slice()
        .reverse(),
    });

  } catch (error: any) {

    console.error(
      "TECHNICAL ANALYSIS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Technical analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}





