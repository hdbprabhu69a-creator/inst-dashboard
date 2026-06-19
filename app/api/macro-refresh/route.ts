import { NextResponse } from "next/server";

import YahooFinance from "yahoo-finance2";

import { db } from "@/lib/firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

const yahooFinance =
  new YahooFinance({
    suppressNotices: [
      "yahooSurvey",
    ],
  });

export async function GET() {

  try {

    const [

      nifty,

      bankNifty,

      indiaVix,

      nasdaqFut,

      spFut,

      usdinr,

      dxy,

      crude,

      gold,

      silver,

    ] = await Promise.all([

      yahooFinance.quote("^NSEI"),

      yahooFinance.quote("^NSEBANK"),

      yahooFinance.quote("^INDIAVIX"),

      yahooFinance.quote("NQ=F"),

      yahooFinance.quote("ES=F"),

      yahooFinance.quote("INR=X"),

      yahooFinance.quote("DX-Y.NYB"),

      yahooFinance.quote("CL=F"),

      yahooFinance.quote("GC=F"),

      yahooFinance.quote("SI=F"),

    ]);

    const macroData = {

      nifty:
        nifty.regularMarketPrice ?? 0,

      niftyChange:
        nifty.regularMarketChangePercent ?? 0,

      bankNifty:
        bankNifty.regularMarketPrice ?? 0,

      bankNiftyChange:
        bankNifty.regularMarketChangePercent ?? 0,

      indiaVix:
        indiaVix.regularMarketPrice ?? 0,

      indiaVixChange:
        indiaVix.regularMarketChangePercent ?? 0,

      nasdaqFut:
        nasdaqFut.regularMarketPrice ?? 0,

      nasdaqFutChange:
        nasdaqFut.regularMarketChangePercent ?? 0,

      spFut:
        spFut.regularMarketPrice ?? 0,

      spFutChange:
        spFut.regularMarketChangePercent ?? 0,

      crude:
        crude.regularMarketPrice ?? 0,

      crudeChange:
        crude.regularMarketChangePercent ?? 0,

      dxy:
        dxy.regularMarketPrice ?? 0,

      dxyChange:
        dxy.regularMarketChangePercent ?? 0,

      usdinr:
        usdinr.regularMarketPrice ?? 0,

      usdinrChange:
        usdinr.regularMarketChangePercent ?? 0,

      gold:
        gold.regularMarketPrice ?? 0,

      goldChange:
        gold.regularMarketChangePercent ?? 0,

      silver:
        silver.regularMarketPrice ?? 0,

      silverChange:
        silver.regularMarketChangePercent ?? 0,

      updatedAt:
        new Date().toISOString(),

    };

    await setDoc(
      doc(
        db,
        "macro_dashboard",
        "live"
      ),
      macroData
    );

    return NextResponse.json({
      success: true,
      data: macroData,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error:
        error.message,
    });

  }

}