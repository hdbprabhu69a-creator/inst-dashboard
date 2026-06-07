"use client";

import { useEffect, useState } from "react";

export default function MarketHeatMapPage() {

  const [sectors, setSectors] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const response =
          await fetch(
            "/api/sector-heatmap"
          );

        const result =
          await response.json();

        setSectors(
          result.sectors || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  if (loading) {

    return (

      <div
        className="
          p-8
          text-cyan-400
          text-xl
        "
      >
        Loading HeatMap...
      </div>

    );

  }

  return (

    <main
      className="
        min-h-screen
        bg-black
        p-3
      "
    >

      <div
        className="
          mb-4
          border
          border-zinc-700
          rounded-lg
          p-4
          bg-zinc-950
        "
      >

        <div
          className="
            text-4xl
            font-bold
            text-white
          "
        >
          INST HEAT MAP
        </div>

        <div
          className="
            text-zinc-400
            mt-1
          "
        >
          Sector Wise Institutional Strength
        </div>

      </div>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-4
        "
      >

        {sectors.map(
          (sector: any) => (

            <div
              key={sector.sector}
              className="
                border
                border-blue-900
                rounded-lg
                overflow-hidden
                bg-zinc-950
              "
            >

              <div
                className="
                  bg-slate-900
                  text-white
                  font-bold
                  px-4
                  py-2
                  border-b
                  border-blue-900
                "
              >

                {sector.sector}
                {" "}
                (
                {sector.stockCount}
                )

              </div>

              <div
                className="
                  grid
                  grid-cols-4
                "
              >

                {sector.stocks?.map(
                  (stock: any) => (

                    <div
                      key={stock.symbol}
                      className={`
                        h-20
                        flex
                        items-center
                        justify-center
                        text-center
                        font-bold
                        text-white
                        border
                        border-white/20

                        ${
                          stock.color === "DARKGREEN"
                            ? "bg-green-800"
                            : stock.color === "GREEN"
                            ? "bg-green-600"
                            : stock.color === "RED"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }
                      `}
                    >

                      {stock.symbol}

                    </div>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

    </main>

  );

}