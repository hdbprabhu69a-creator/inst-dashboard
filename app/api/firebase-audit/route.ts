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

    const audit: any[] = [];

    let passed = 0;
    let failed = 0;

    for (const stock of documents) {

      const issues: string[] = [];

      if (!stock.symbol)
        issues.push("NO_SYMBOL");

      if (!stock.cmp)
        issues.push("NO_CMP");

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

      if (!stock.weeklyOHLC)
        issues.push("NO_WEEKLY_OHLC");

      if (!stock.monthlyOHLC)
        issues.push("NO_MONTHLY_OHLC");

      if (issues.length === 0) {

        passed++;

      } else {

        failed++;

      }

      audit.push({

        symbol:
          stock.symbol,

        status:
          issues.length === 0
            ? "OK"
            : "FAILED",

        issues,

      });

    }

    return NextResponse.json({

      success: true,

      total:
        documents.length,

      passed,

      failed,

      audit,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}