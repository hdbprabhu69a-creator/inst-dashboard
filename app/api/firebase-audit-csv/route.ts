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

    const documents: any[] =
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
      "DailyCPR",
      "WeeklyCPR",
      "MonthlyCPR",
      "DailyVWAP",
      "WeeklyVWAP",
      "MonthlyVWAP",
      "DailyVolume",
      "WeeklyVolume",
      "MonthlyVolume",
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

      if (!stock.dailyCPR)
        issues.push("NO_DAILY_CPR");

      if (!stock.weeklyCPR)
        issues.push("NO_WEEKLY_CPR");

      if (!stock.monthlyCPR)
        issues.push("NO_MONTHLY_CPR");

      if (!stock.dailyVWAP)
        issues.push("NO_DAILY_VWAP");

      if (!stock.weeklyVWAP)
        issues.push("NO_WEEKLY_VWAP");

      if (!stock.monthlyVWAP)
        issues.push("NO_MONTHLY_VWAP");

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

        stock.dailyCPR?.pivot || "",
        stock.weeklyCPR?.pivot || "",
        stock.monthlyCPR?.pivot || "",

        stock.dailyVWAP || "",
        stock.weeklyVWAP || "",
        stock.monthlyVWAP || "",

        stock.totalVolumeDaily || "",
        stock.totalVolumeWeekly || "",
        stock.totalVolumeMonthly || "",

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
            'attachment; filename="firebase-audit.csv"',
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
