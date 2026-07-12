import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getHistory } from "@/institutional-analysis/repository/historyRepository";
import { detectSwingHighs } from "@/institutional-analysis/engine/priceStructure/detectSwingHighs";
import { detectSwingLows } from "@/institutional-analysis/engine/priceStructure/detectSwingLows";

export async function GET() {

  try {

    const universe = await getDocs(
      collection(db,"universe")
    );

    const ready:any[] = [];
    const missing:any[] = [];

    for (const stockDoc of universe.docs) {

      const stock = stockDoc.data();

      if (!stock.symbol) continue;

      const candles =
        await getHistory(stock.symbol);

      if (candles.length < 100) {

        missing.push({

          symbol: stock.symbol,

          candles: candles.length

        });

        continue;

      }

      const swingHighs =
        detectSwingHighs(candles);

      const swingLows =
        detectSwingLows(candles);

      ready.push({

        symbol: stock.symbol,

        candles: candles.length,

        swingHighCount: swingHighs.length,

        swingLowCount: swingLows.length,

        latestSwingHigh:
          swingHighs.at(-1)?.price ?? null,

        latestSwingDate:
          swingHighs.at(-1)?.date ?? null

      });

    }

    ready.sort((a,b)=>a.symbol.localeCompare(b.symbol));
    missing.sort((a,b)=>a.symbol.localeCompare(b.symbol));

    return NextResponse.json({

      success: true,

      processed: ready.length + missing.length,

      historyAvailable: ready.length,

      historyMissing: missing.length,

      ready,

      missing

    });

  } catch (e:any) {

    return NextResponse.json({

      success: false,

      error: e.message

    },{

      status: 500

    });

  }

}
