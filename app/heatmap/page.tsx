"use client";

import { useEffect, useState } from "react";

export default function HeatMapPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeatMap();
  }, []);

  async function loadHeatMap() {
    try {
      const response = await fetch("/api/sector-heatmap");

      const result = await response.json();

      const sorted = (result.sectors || [])

        .map((sector: any) => ({
          ...sector,

          stocks: (sector.stocks || []).sort(
            (a: any, b: any) =>
              (b.heatScore || 0) -
              (a.heatScore || 0)
          ),
        }))

        .sort(
          (a: any, b: any) =>
            (a.rank || 999) -
            (b.rank || 999)
        );

      setSectors(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function getColor(color: string) {
    switch (color) {
      case "DARKGREEN":
        return "bg-green-800";

      case "GREEN":
        return "bg-green-600";

      case "YELLOW":
        return "bg-amber-500";

      case "RED":
        return "bg-red-600";

      default:
        return "bg-zinc-800";
    }
  }

  function getCardHeight(stockCount: number) {
    if (stockCount <= 4) {
      return "min-h-[180px]";
    }

    if (stockCount <= 8) {
      return "min-h-[260px]";
    }

    if (stockCount <= 12) {
      return "min-h-[340px]";
    }

    return "min-h-[420px]";
  }

  if (loading) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading Heat Map...
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen p-2">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-3
        "
      >
        {sectors.map((sector: any) => (
          <div
            key={sector.sector}
            className={`
              ${getCardHeight(sector.stockCount)}
              border
              border-blue-900
              rounded-lg
              overflow-hidden
              bg-black
            `}
          >
            <div
              className="
                bg-slate-950
                px-4
                py-2
                flex
                justify-between
                items-center
              "
            >
              <div
                className="
                  text-orange-100
                  font-bold
                  text-2xl
                "
              >
                #{sector.rank} {sector.sector}
              </div>

              <div
                className="
                  text-gray-400
                  text-base
                "
              >
                {sector.stockCount}
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-4
              "
            >
              {(sector.stocks || []).map(
                (stock: any) => (
                  <div
                    key={stock.symbol}
                    className={`
                      ${getColor(stock.color)}
                      h-24
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-center
                      text-white
                      font-bold
                      text-sm
                      p-1
                    `}
                  >
                    {stock.symbol}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
