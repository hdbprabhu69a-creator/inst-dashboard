import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

async function getKite() {
  const tokenDoc = await adminDb
    .collection("settings")
    .doc("kite")
    .get();

  if (!tokenDoc.exists) {
    throw new Error("settings/kite document not found");
  }

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

async function fetchDaily(
  kite: any,
  instrumentToken: number,
  from: Date,
  to: Date
) {
    return (
    await kite.getHistoricalData(
      instrumentToken,
      "day",
      from,
      to,
      false,
      false
    )
  ) ?? [];
}

function normalize(data: any[]): Candle[] {
  return data.map((c) => ({
    time: String(c.date).substring(0, 10),
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
    volume: Number(c.volume ?? 0),
  }));
}

function toWeekly(candles: Candle[]): Candle[] {
  const weeks: Record<string, Candle> = {};

  for (const c of candles) {
    const d = new Date(c.time);

    const key =
      `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;

    if (!weeks[key]) {
      weeks[key] = {
        ...c,
        time: key,
      };
    } else {
      weeks[key].high = Math.max(
        weeks[key].high,
        c.high
      );

      weeks[key].low = Math.min(
        weeks[key].low,
        c.low
      );

      weeks[key].close = c.close;

      weeks[key].volume += c.volume;
    }
  }

  return Object.values(weeks);
}

function toMonthly(candles: Candle[]): Candle[] {
  const months: Record<string, Candle> = {};

  for (const c of candles) {
    const d = new Date(c.time);

    const key =
      `${d.getFullYear()}-${d.getMonth() + 1}`;

    if (!months[key]) {
      months[key] = {
        ...c,
        time: key,
      };
    } else {
      months[key].high = Math.max(
        months[key].high,
        c.high
      );

      months[key].low = Math.min(
        months[key].low,
        c.low
      );

      months[key].close = c.close;

      months[key].volume += c.volume;
    }
  }

  return Object.values(months);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");

    const period =
      searchParams.get("period") ?? "D";

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing token",
        },
        {
          status: 400,
        }
      );
    }

    const kite = await getKite();

    const to = new Date();

    const from = new Date();

    from.setFullYear(
      from.getFullYear() - 2
    );

    const raw = await fetchDaily(
      kite,
      Number(token),
      from,
      to
    );

    const candles = normalize(raw);

    let result = candles;

    switch (period) {
      case "W":
        result = toWeekly(candles);
        break;

      case "M":
        result = toMonthly(candles);
        break;

      default:
        result = candles;
    }

    return NextResponse.json({
      success: true,
      period,
      candles: result,
    });

  } catch (error: any) {

    console.error(
      "HISTORY API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}