import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const verdict = (s: number) =>
  s >= 90
    ? "STRONG BUY"
    : s >= 80
    ? "BUY ON DIP"
    : s >= 65
    ? "HOLD"
    : s >= 50
    ? "OBSERVE"
    : "AVOID";

function score(stock: any) {
  const cmp = stock.cmp || 0;
  let s = 0;

  [
    [stock.dailyPivot?.pivot, 5],
    [stock.weeklyPivot?.pivot, 7],
    [stock.monthlyPivot?.pivot, 8],
  ].forEach(([v, p]) => {
    if (cmp > Number(v)) s += Number(p);
  });

  [
    [stock.dailyVWAP, 5],
    [stock.weeklyVWAP, 7],
    [stock.monthlyVWAP, 8],
  ].forEach(([v, p]) => {
    if (cmp > Number(v)) s += Number(p);
  });

  [
    stock.dailyCPR?.tc,
    stock.weeklyCPR?.tc,
    stock.monthlyCPR?.tc,
  ].forEach((v) => {
    if (cmp > Number(v)) s += 5;
  });

  const del = stock.deliveryPctDaily || 0;

  if (del >= 70) s += 15;
  else if (del >= 60) s += 12;
  else if (del >= 50) s += 8;
  else if (del >= 40) s += 4;

  const low =
    stock.oneWeekSwing?.low || 0;

  const high =
    stock.oneWeekSwing?.high || 0;

  const range =
    high - low;

  if (range > 0) {
    const pos =
      (cmp - low) / range;

    s +=
      pos <= 0.33
        ? 15
        : pos <= 0.66
        ? 7
        : 2;
  }

  const vol =
    stock.totalVolumeDaily || 0;

  const avg =
    (stock.totalVolumeWeekly || 0) /
    5;

  if (avg > 0) {
    if (vol > avg * 1.25) s += 15;
    else if (vol > avg) s += 8;
  }

  return Math.min(
    100,
    Math.round(s)
  );
}

export async function GET() {
  try {
    const [
      marketSnapshot,
      universeSnapshot,
    ] = await Promise.all([
      getDocs(
        collection(
          db,
          "marketStructure"
        )
      ),
      getDocs(
        collection(
          db,
          "universe"
        )
      ),
    ]);

    const sectorMap =
      new Map(
        universeSnapshot.docs.map(
          (d) => {
            const x =
              d.data();

            return [
              x.symbol,
              x.sector ||
                "UNKNOWN",
            ];
          }
        )
      );
const tokenDoc =
  await adminDb
    .collection("settings")
    .doc("kite")
    .get();

const accessToken =
  tokenDoc.data()?.accessToken;

const kite =
  new KiteConnect({
    api_key:
      process.env.KITE_API_KEY!,
  });

kite.setAccessToken(
  accessToken
);

const quotes =
  await kite.getQuote(
    marketSnapshot.docs.map(
      d =>
        `NSE:${d.data().symbol}`
    )
  );
      const rows =
      marketSnapshot.docs
        .map((doc) => {
          const stock =
  doc.data();

const q =
  quotes[
    `NSE:${stock.symbol}`
  ];

const liveCmp =
  q?.last_price ??
  stock.cmp ??
  0;

const liveVolume =
  q?.volume ??
  stock.totalVolumeDaily ??
  0;

const sc =
  score({
    ...stock,
    cmp: liveCmp,
    totalVolumeDaily:
      liveVolume,
  });
          return {
            symbol:
              stock.symbol,

            sector:
              sectorMap.get(
                stock.symbol
              ) ||
              "UNKNOWN",

           
              cmp: liveCmp,

            open:
  q?.ohlc?.open ??
  stock.dailyOHLC?.open ??
  0,

high:
  q?.ohlc?.high ??
  stock.dailyOHLC?.high ??
  0,
    low:
  q?.ohlc?.low ??
  stock.dailyOHLC?.low ??
  0,
    close:
  q?.ohlc?.close ??
  stock.dailyOHLC?.close ??
  0,
    volume: liveVolume,

dvol:
  liveVolume,

wvol:
  stock.totalVolumeWeekly || 0,

mvol:
  stock.totalVolumeMonthly || 0,

dpvt:
  stock.dailyPivot
    ?.pivot || 0,
            wpvt:
              stock.weeklyPivot
                ?.pivot || 0,

            mpvt:
              stock.monthlyPivot
                ?.pivot || 0,

            oneWeekLow:
              stock.oneWeekSwing
                ?.low || 0,

            oneWeekHigh:
              stock.oneWeekSwing
                ?.high || 0,

            dailyVWAP:
              stock.dailyVWAP || 0,

            weeklyVWAP:
              stock.weeklyVWAP || 0,

            monthlyVWAP:
              stock.monthlyVWAP || 0,

            deliveryPctDaily:
              stock.deliveryPctDaily ||
              0,

            score: sc,

            verdict:
              verdict(sc),
          };
        })
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    return NextResponse.json({
      success: true,
      count:
        rows.length,
      rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error:
        error?.message ||
        "Unknown Error",
    });
  }
}