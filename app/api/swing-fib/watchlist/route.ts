import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const COLLECTION = "watchlist";
const DOCUMENT = "main";

export async function GET() {
  try {
    const snap = await adminDb
      .collection(COLLECTION)
      .doc(DOCUMENT)
      .get();

    if (!snap.exists) {
      return NextResponse.json({
        success: true,
        symbols: [],
        valueBuyEntries: [],
      });
    }

    const data = snap.data() ?? {};

    return NextResponse.json({
      success: true,
      symbols: Array.isArray(data.symbols)
        ? data.symbols
        : [],
      valueBuyEntries:
        Array.isArray(data.valueBuyEntries)
          ? data.valueBuyEntries
          : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Failed to load Watchlist",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const body = await request.json();

    const symbols =
      Array.isArray(body.symbols)
        ? Array.from(
            new Set(
              body.symbols
                .map((x: any) =>
                  String(x).trim()
                )
                .filter(Boolean)
            )
          )
        : [];

    const valueBuyEntries =
      Array.isArray(body.valueBuyEntries)
        ? body.valueBuyEntries
        : [];

    await adminDb
      .collection(COLLECTION)
      .doc(DOCUMENT)
      .set(
        {
          symbols,
          valueBuyEntries,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

    return NextResponse.json({
      success: true,
      symbols,
      valueBuyEntries,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Failed to save Watchlist",
      },
      {
        status: 500,
      }
    );
  }
}
