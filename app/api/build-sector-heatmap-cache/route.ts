import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const snapshot = await getDocs(
      collection(db, "heatmap_cache")
    );

    const sectorMap: Record<string, any> = {};

    snapshot.docs.forEach((stockDoc) => {
      const stock = stockDoc.data();

      const sector =
        stock.sector || "UNKNOWN";

      if (!sectorMap[sector]) {
        sectorMap[sector] = {
          sector,
          stockCount: 0,
          totalHeat: 0,
          institutionalCount: 0,
          strongBuyCount: 0,
          buyCount: 0,
          watchCount: 0,
          avoidCount: 0,
          stocks: [],
        };
      }

      const heat =
        Number(stock.heatScore || 0);

      sectorMap[sector].stockCount++;
      sectorMap[sector].totalHeat += heat;

      if (heat >= 80) {
        sectorMap[sector].strongBuyCount++;
      } else if (heat >= 60) {
        sectorMap[sector].buyCount++;
      } else if (heat >= 40) {
        sectorMap[sector].watchCount++;
      } else {
        sectorMap[sector].avoidCount++;
      }

      if (heat >= 60) {
        sectorMap[sector].institutionalCount++;
      }

      sectorMap[sector].stocks.push({
        symbol: stock.symbol,
        heatScore: heat,
        color: stock.color || "RED",
        trendScore:
          Number(stock.trendScore || 0),
        rsScore:
          Number(stock.rsScore || 0),
        volumeScore:
          Number(stock.volumeScore || 0),
        deliveryScore:
          Number(stock.deliveryScore || 0),
      });
    });

    const sectors = Object.values(
      sectorMap
    );

    sectors.forEach((sector: any) => {
      sector.avgHeat =
        sector.stockCount > 0
          ? Number(
              (
                sector.totalHeat /
                sector.stockCount
              ).toFixed(2)
            )
          : 0;

      sector.stocks.sort(
        (a: any, b: any) =>
          b.heatScore - a.heatScore
      );
    });

    sectors.sort(
      (a: any, b: any) => {
        if (
          b.institutionalCount !==
          a.institutionalCount
        ) {
          return (
            b.institutionalCount -
            a.institutionalCount
          );
        }

        return b.avgHeat - a.avgHeat;
      }
    );

    for (
      let i = 0;
      i < sectors.length;
      i++
    ) {
      const sector: any =
        sectors[i];

      await setDoc(
        doc(
          db,
          "sector_heatmap_cache",
          sector.sector
        ),
        {
          sector: sector.sector,
          rank: i + 1,
          avgHeat: sector.avgHeat,
          stockCount:
            sector.stockCount,
          institutionalCount:
            sector.institutionalCount,
          strongBuyCount:
            sector.strongBuyCount,
          buyCount:
            sector.buyCount,
          watchCount:
            sector.watchCount,
          avoidCount:
            sector.avoidCount,
          stocks: sector.stocks,
          updatedAt:
            new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      sectors: sectors.length,
      message:
        "SECTOR HEATMAP CACHE REBUILT",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
