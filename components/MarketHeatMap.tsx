"use client";

import { useEffect, useState } from "react";

export default function MarketHeatMap() {

  const [stocks, setStocks] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const response =
          await fetch(
            "/api/heatmap"
          );

        const result =
          await response.json();

        setStocks(
          result.stocks || []
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

      <div className="p-6 text-cyan-400 text-xl">

        Loading HeatMap...

      </div>

    );

  }

  const groupedStocks =
    stocks.reduce(
      (
        groups: any,
        stock: any
      ) => {

        const sector =
          stock.sector ||
          "UNKNOWN";

        if (
          !groups[sector]
        ) {

          groups[sector] = [];

        }

        groups[sector].push(
          stock
        );

        return groups;

      },
      {}
    );

  const sectors =
    Object.keys(
      groupedStocks
    ).sort();

  return (

    <div className="p-2 space-y-4">

      {sectors.map(
        (sector) => (

          <div
            key={sector}
            className="
              border-b
              border-zinc-800
              pb-4
            "
          >

            <div
              className="
                grid
                grid-cols-8
                gap-2
              "
            >

              {groupedStocks[
                sector
              ]

                .sort(
                  (
                    a: any,
                    b: any
                  ) =>
                    b.heatScore -
                    a.heatScore
                )

                .map(
                  (
                    stock: any
                  ) => (

                    <div
                      key={
                        stock.symbol
                      }
                      className={`

                        rounded-xl
                        h-20

                        flex
                        flex-col

                        justify-center
                        items-center

                        text-center

                        ${
                          stock.color ===
                          "DARKGREEN"

                            ? "bg-green-800"

                            : stock.color ===
                              "GREEN"

                            ? "bg-green-600"

                            : stock.color ===
                              "RED"

                            ? "bg-red-600"

                            : "bg-yellow-600"

                        }

                      `}
                    >

                      <div
                        className="
                          text-white
                          font-bold
                          text-sm
                        "
                      >

                        {stock.symbol}

                      </div>

                      <div
                        className="
                          text-white
                          text-xs
                        "
                      >

                        Heat{" "}
                        {
                          stock.heatScore?.toFixed(
                            0
                          )
                        }

                      </div>

                    </div>

                  )
                )}

            </div>

          </div>

        )
      )}

    </div>

  );

}