import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    const documents =
      snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

    const rows: string[] = [];

    rows.push([

      "Symbol",

      "CMP",

      "DailyPivot",

      "WeeklyPivot",

      "MonthlyPivot",

      "WeeklyFib50",

      "MonthlyFib50",

      "DailySwingRange",

      "WeeklySwingRange",

      "MonthlySwingRange",

      "HeatScore",

      "RSScore",

      "VolumeScore",

      "DeliveryScore",

      "SectorScore",

      "TrendScore",

      "UpdatedAt",

      "Status",

    ].join(","));

    for (const stock of documents) {

      const issues: string[] = [];

      if (!stock.dailyPivot)
        issues.push("NO_DAILY_PIVOT");

      if (!stock.weeklyPivot)
        issues.push("NO_WEEKLY_PIVOT");

      if (!stock.monthlyPivot)
        issues.push("NO_MONTHLY_PIVOT");

      if (!stock.weeklyFib)
        issues.push("NO_WEEKLY_FIB");

      if (!stock.monthlyFib)
        issues.push("NO_MONTHLY_FIB");

      if (!stock.dailySwing)
        issues.push("NO_DAILY_SWING");

      if (!stock.weeklySwing)
        issues.push("NO_WEEKLY_SWING");

      if (!stock.monthlySwing)
        issues.push("NO_MONTHLY_SWING");

      const status =

        issues.length === 0

          ? "OK"

          : issues.join("|");

      rows.push([

        stock.symbol || "",

        stock.cmp || "",

        stock.dailyPivot?.pivot || "",

        stock.weeklyPivot?.pivot || "",

        stock.monthlyPivot?.pivot || "",

        stock.weeklyFib?.fib50 || "",

        stock.monthlyFib?.fib50 || "",

        stock.dailySwing?.range || "",

        stock.weeklySwing?.range || "",

        stock.monthlySwing?.range || "",

        stock.heatScore || 0,

        stock.rsScore || 0,

        stock.volumeScore || 0,

        stock.deliveryScore || 0,

        stock.sectorScore || 0,

        stock.trendScore || 0,

        stock.updatedAt || "",

        status,

      ].join(","));

    }

    const csv =
      rows.join("\n");

    return new Response(
      csv,
      {
        headers: {

          "Content-Type":
            "text/csv",

          "Content-Disposition":
            'attachment; filename="market-structure-audit.csv"',

        },
      }
    );

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}