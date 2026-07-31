import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";

const SECTORS = [
  { name: "BANK", token: 260105 },
  { name: "IT", token: 259849 },
  { name: "REALTY", token: 261129 },
  { name: "ENERGY", token: 261641 },
  { name: "FMCG", token: 261897 },
  { name: "PHARMA", token: 262409 },
  { name: "PSU BANK", token: 262921 },
  { name: "AUTO", token: 263433 },
  { name: "METAL", token: 263689 },
  { name: "MEDIA", token: 263945 },
  { name: "OIL & GAS", token: 289033 },
];

export async function GET() {
  try {
    const tokenDoc = await adminDb
      .collection("settings")
      .doc("kite")
      .get();

    const accessToken = tokenDoc.data()?.accessToken;

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: "No Kite access token",
      });
    }

    const kite = new KiteConnect({
      api_key: process.env.KITE_API_KEY!,
    });

    kite.setAccessToken(accessToken);

    const to = new Date();
    const from = new Date();

    // 45 calendar days ≈ 30 trading sessions
    from.setDate(to.getDate() - 45);

    const data = await Promise.all(
      SECTORS.map(async (sector) => {
        const candles: any[] = await kite.getHistoricalData(
          sector.token,
          "day",
          from,
          to,
          false
        );

        return {
          sector: sector.name,
          token: sector.token,
          history: candles
            .slice(-30)
            .reverse()
            .map((c) => ({
              date: new Date(c.date)
                .toISOString()
                .split("T")[0],
              open: c.open,
              high: c.high,
              low: c.low,
              close: c.close,
              volume: c.volume,
            })),
        };
      })
    );

    return NextResponse.json({
      success: true,
      total: data.length,
      sectors: data,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}