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

    const rows = [];

    rows.push([
      "Symbol",
      "CMP",
      "DailyPivot",
      "WeeklyPivot",
      "MonthlyPivot",
      "DailyCPR",
      "WeeklyCPR",
      "MonthlyCPR",
      "WeeklyFib",
      "MonthlyFib",
      "DailySwing",
      "WeeklySwing",
      "MonthlySwing",
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

        stock.dailyCPR?.pivot || "",

        stock.weeklyCPR?.pivot || "",

        stock.monthlyCPR?.pivot || "",

        stock.weeklyFib?.fib50 || "",

        stock.monthlyFib?.fib50 || "",

        stock.dailySwing?.range || "",

        stock.weeklySwing?.range || "",

        stock.monthlySwing?.range || "",

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