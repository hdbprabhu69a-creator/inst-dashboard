import { NextResponse } from "next/server";
import axios from "axios";
import { adminDb } from "@/lib/firebase-admin";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

const INDEXES = [
  { symbol:"NIFTY",              kiteSymbol:"NIFTY 50" },
  { symbol:"NIFTYNXT50",         kiteSymbol:"NIFTY NEXT 50" },
  { symbol:"BANKNIFTY",          kiteSymbol:"NIFTY BANK" },
  { symbol:"FINNIFTY",           kiteSymbol:"NIFTY FIN SERVICE" },
  { symbol:"MIDCPNIFTY",         kiteSymbol:"NIFTY MID SELECT" },

  { symbol:"AUTO",               kiteSymbol:"NIFTY AUTO" },
  { symbol:"IT",                 kiteSymbol:"NIFTY IT" },
  { symbol:"FMCG",               kiteSymbol:"NIFTY FMCG" },
  { symbol:"PHARMA",             kiteSymbol:"NIFTY PHARMA" },
  { symbol:"METAL",              kiteSymbol:"NIFTY METAL" },
  { symbol:"ENERGY",             kiteSymbol:"NIFTY ENERGY" },
  { symbol:"REALTY",             kiteSymbol:"NIFTY REALTY" },
  { symbol:"MEDIA",              kiteSymbol:"NIFTY MEDIA" },
  { symbol:"OILGAS",             kiteSymbol:"NIFTY OIL & GAS" },
  { symbol:"PSUBANK",            kiteSymbol:"NIFTY PSU BANK" },
  { symbol:"PVTBANK",            kiteSymbol:"NIFTY PVT BANK" },
  { symbol:"CONSUMERDURABLES",   kiteSymbol:"NIFTY CONSUMER DURABLES" },
  { symbol:"HEALTHCARE",         kiteSymbol:"NIFTY HEALTHCARE INDEX" },
  { symbol:"INFRA",              kiteSymbol:"NIFTY INFRASTRUCTURE" },
  { symbol:"COMMODITIES",        kiteSymbol:"NIFTY COMMODITIES" },
  { symbol:"SERVICES",           kiteSymbol:"NIFTY SERVICES SECTOR" },
  { symbol:"MNC",                kiteSymbol:"NIFTY MNC" },
  { symbol:"INDIADEFENCE",       kiteSymbol:"NIFTY INDIA DEFENCE" },
  { symbol:"CPSE",               kiteSymbol:"NIFTY CPSE" },
];

export async function GET() {

  const accessToken = await getCachedAccessToken();

  const response = await axios.get(
    "https://api.kite.trade/instruments",
    {
      headers: {
        Authorization: `token ${process.env.KITE_API_KEY}:${accessToken}`,
        "X-Kite-Version": "3",
      },
    }
  );

  const rows = response.data.split("\n");

  let updated = 0;

  for (const index of INDEXES) {

    const row = rows.find(
      (line: string) =>
        line.includes(`,${index.kiteSymbol},`) &&
        line.includes(",NSE")
    );

    if (!row) {
  console.log("NOT FOUND:", index.kiteSymbol);
  continue;
}

    const cols = row.split(",");

    await adminDb
      .collection("universe_indices")
      .doc(index.symbol)
      .set({
        symbol: index.symbol,
        kiteSymbol: index.kiteSymbol,
        instrumentToken: Number(cols[0]),
        exchange: cols[11],
        segment: cols[9],
        name: cols[2],
        updatedAt: new Date().toISOString(),
      });

    updated++;
  }

  return NextResponse.json({
    success: true,
    updated,
  });
}





