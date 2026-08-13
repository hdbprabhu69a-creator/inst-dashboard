import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const MARKET_STATES = [
  "Accumulation",
  "Markup",
  "Expansion",
  "Distribution",
  "Markdown",
  "Reaccumulation",
];

export async function GET(
  request: Request
) {
  try {

    const url =
      new URL(request.url);

    const symbol =
      url.searchParams
        .get("symbol")
        ?.trim()
        .toUpperCase();

    if (!symbol) {
      return NextResponse.json({
        success: true,
        total: 0,
        data: [],
      });
    }

    const snap =
      await adminDb
        .collection("delivery_history")
        .where("symbol", "==", symbol)
        .get();

    const data =
      snap.docs
        .map((doc) => {

          const raw =
            doc.data();

          const {
            deliveryPct,
            ...rest
          } = raw;

          return {
            id: doc.id,
            ...rest,

            deliveryPercent:
              Number(
                deliveryPct ?? 0
              ),

            state:
              typeof raw.state === "string"
                ? raw.state
                : "",
          };

        })
        .sort(
          (a: any, b: any) =>
            String(b.date).localeCompare(
              String(a.date)
            )
        );

    return NextResponse.json({
      success: true,
      symbol,
      total: data.length,
      data,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Failed to load delivery history",
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

    const body =
      await request.json();

    const id =
      String(
        body.id ?? ""
      ).trim();

    const symbol =
      String(
        body.symbol ?? ""
      )
        .trim()
        .toUpperCase();

    const state =
      String(
        body.state ?? ""
      ).trim();

    if (!id || !symbol) {
      return NextResponse.json(
        {
          success: false,
          error:
            "id and symbol are required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      state &&
      !MARKET_STATES.includes(state)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid market state",
        },
        {
          status: 400,
        }
      );
    }

    const ref =
      adminDb
        .collection("delivery_history")
        .doc(id);

    const snap =
      await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Delivery history record not found",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      snap.data() ?? {};

    if (
      String(existing.symbol ?? "")
        .toUpperCase() !== symbol
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Symbol mismatch",
        },
        {
          status: 400,
        }
      );
    }

    await ref.update({
      state: state || null,
      stateUpdatedAt:
        new Date(),
    });

    return NextResponse.json({
      success: true,
      id,
      symbol,
      state,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Failed to update market state",
      },
      {
        status: 500,
      }
    );

  }
}
