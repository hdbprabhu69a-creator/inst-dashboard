import { NextResponse } from "next/server";

import { STOCK_UNIVERSE } from "@/lib/universe";

import { getHistory } from "@/lib/history/historyRepository";

import { buildTimeCycles } from "@/lib/institutional/timeCycle";
import { getLivePrices } from "@/lib/kite/getLivePrices";

export async function GET() {
  try {
    const livePrices =
      await getLivePrices(
        STOCK_UNIVERSE
      );

    const results = await Promise.all(
      STOCK_UNIVERSE.map(async (symbol) => {
        const history = await getHistory(symbol);

        if (!history.length) {
          return {
            symbol,
            cycle15: null,
            cycle45: null,
            cycle63: null,
            cycle90: null,
            cycle180: null,
            cycle252: null,
          };
        }

        return {
          symbol,
          ...buildTimeCycles(history),
        };
      })
    );

    return NextResponse.json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error("TIME CYCLE API ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to build time cycle analysis",
      },
      {
        status: 500,
      }
    );
  }
}

