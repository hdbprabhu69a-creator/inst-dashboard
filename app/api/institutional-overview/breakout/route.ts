import { NextResponse } from "next/server";
import { breakoutCompositeEngine } from "@/institutional-analysis/engine/breakout";

export async function GET() {
  try {

    const base = "http://localhost:3000";

    const [watchRes, volumeRes, trendRes] = await Promise.all([
      fetch(`${base}/api/watchlist`, { cache: "no-store" }),
      fetch(`${base}/api/institutional-analysis/volume-universe`, { cache: "no-store" }),
      fetch(`${base}/api/institutional/run-universe`, { cache: "no-store" }),
    ]);

    const watchJson = await watchRes.json();
    const volumeJson = await volumeRes.json();
    const trendJson = await trendRes.json();

    const watchRows = watchJson.rows ?? [];
    const volumeRows = volumeJson.rows ?? volumeJson.data ?? [];
    const trendRows = trendJson.rows ?? trendJson.data ?? [];

    console.log("WATCH:", watchRows.length);
    console.log("VOLUME:", volumeRows.length);
    console.log("TREND:", trendRows.length);

    const volumeMap = new Map(
      volumeRows.map((x: any) => [x.symbol, x])
    );

    const trendMap = new Map(
      trendRows.map((x: any) => [x.symbol, x])
    );

    const merged = watchRows.map((w: any) => ({
      ...w,
      ...(volumeMap.get(w.symbol) ?? {}),
      ...(trendMap.get(w.symbol) ?? {}),
    }));

    console.log("MERGED:", merged.length);

    const rows = breakoutCompositeEngine(merged);

    console.log("BREAKOUT:", rows.length);

    return NextResponse.json({
      success: true,
      count: rows.length,
      rows,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );

  }
}

