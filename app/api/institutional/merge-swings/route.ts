import { NextResponse } from "next/server";

import { getUniverse } from "@/institutional-analysis/repository/universeRepository";
import { getHistory } from "@/institutional-analysis/repository/historyRepository";

import { detectSwingHighs } from "@/institutional-analysis/engine/priceStructure/detectSwingHighs";
import { detectSwingLows } from "@/institutional-analysis/engine/priceStructure/detectSwingLows";
import { mergeSwings } from "@/institutional-analysis/engine/priceStructure/mergeSwings";
import { classifyStructure } from "@/institutional-analysis/engine/priceStructure/classifyStructure";

export async function GET() {

  const universe = await getUniverse();

  const results = [];

  for (const stock of universe) {

    const candles = await getHistory(stock.symbol);

    if (candles.length < 100)
      continue;

    const highs = detectSwingHighs(candles);

    const lows = detectSwingLows(candles);

    const merged = mergeSwings(highs,lows);

    const structure = classifyStructure(merged);

    results.push({

      symbol: stock.symbol,

      candles: candles.length,

      swingHighs: highs.length,

      swingLows: lows.length,

      merged: merged.length,

      structure: structure.structure,

      higherHighs: structure.higherHighs,

      higherLows: structure.higherLows,

      lowerHighs: structure.lowerHighs,

      lowerLows: structure.lowerLows

    });

  }

  return NextResponse.json({

    success: true,

    processed: results.length,

    results

  });

}
