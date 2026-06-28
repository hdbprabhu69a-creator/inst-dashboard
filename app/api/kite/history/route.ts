import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * =========================
 * TYPES
 * =========================
 */

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

/**
 * =========================
 * KITE CLIENT
 * =========================
 */

async function getKite() {
  const tokenDoc = await getDoc(doc(db, "settings", "kite"));
  const accessToken = tokenDoc.data()?.accessToken;

  if (!accessToken) {
    throw new Error("No Access Token Found");
  }

  const kite = new KiteConnect({
    api_key: process.env.KITE_API_KEY!,
  });

  kite.setAccessToken(accessToken);

  return kite;
}

/**
 * =========================
 * FETCH DAILY DATA
 * =========================
 */

async function fetchDaily(
  kite: any,
  instrumentToken: number,
  from: Date,
  to: Date
) {
  const data = await kite.getHistoricalData(
    instrumentToken,
    "day",
    from,
    to,
    false,
    false
  );

  return data || [];
}

/**
 * =========================
 * NORMALIZE
 * =========================
 */

function normalize(data: any[]): Candle[] {
  return data.map((c: any) => ({
    time: String(c.date).substring(0, 10),
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
    volume: Number(c.volume ?? 0),
  }));
}

/**
 * =========================
 * WEEKLY AGGREGATION
 * =========================
 */

function toWeekly(candles: Candle[]): Candle[] {
  const weeks: Record<string, Candle> = {};

  for (const c of candles) {
    const date = new Date(c.time);
    const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;

    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        time: weekKey,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
      };
    } else {
      const w = weeks[weekKey];
      w.high = Math.max(w.high, c.high);
      w.low = Math.min(w.low, c.low);
      w.close = c.close;
      w.volume += c.volume;
    }
  }

  return Object.values(weeks);
}

/**
 * =========================
 * MONTHLY AGGREGATION
 * =========================
 */

function toMonthly(candles: Candle[]): Candle[] {
  const months: Record<string, Candle> = {};

  for (const c of candles) {
    const date = new Date(c.time);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!months[monthKey]) {
      months[monthKey] = {
        time: monthKey,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
      };
    } else {
      const m = months[monthKey];
      m.high = Math.max(m.high, c.high);
      m.low = Math.min(m.low, c.low);
      m.close = c.close;
      m.volume += c.volume;
    }
  }

  return Object.values(months);
}

/**
 * =========================
 * ROUTE
 * =========================
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");
    const period = searchParams.get("period") || "D";

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token" },
        { status: 400 }
      );
    }

    const kite = await getKite();

    const to = new Date();
    const from = new Date();

    // default 2 years back for safety
    from.setFullYear(from.getFullYear() - 2);

    const raw = await fetchDaily(
      kite,
      Number(token),
      from,
      to
    );

    const candles = normalize(raw);

    let result: Candle[] = candles;

    if (period === "W") {
      result = toWeekly(candles);
    }

    if (period === "M") {
      result = toMonthly(candles);
    }

    return NextResponse.json({
      success: true,
      period,
      candles: result,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}