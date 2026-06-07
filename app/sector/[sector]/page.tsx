"use client";

import { use, useEffect, useState } from "react";

export default function SectorStocksPage({
  params,
}: {
  params: Promise<{
    sector: string;
  }>;
}) {

  const { sector } = use(params);

  const [stocks, setStocks] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const response =
          await fetch(
            `/api/sector-stocks?sector=${sector}`
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

  }, [sector]);

  if (loading) {

    return (

      <div
        className="
          p-6
          text-cyan-400
          text-xl
        "
      >
        Loading...
      </div>

    );

  }

  return (

    <main className="p-6">

      <div
        className="
          text-4xl
          font-bold
          text-cyan-400
          mb-6
        "
      >
        {sector}
      </div>

      <div
        className="
          grid
          grid-cols-8
          gap-3
        "
      >

        {stocks.map(
          (stock: any) => (

            <div
              key={stock.symbol}
              className={`
                rounded-xl
                h-24
                flex
                flex-col
                justify-center
                items-center
                text-center

                ${
                  stock.color === "DARKGREEN"
                    ? "bg-green-800"
                    : stock.color === "GREEN"
                    ? "bg-green-600"
                    : stock.color === "RED"
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
                Heat {stock.heatScore}
              </div>

            </div>

          )
        )}

      </div>

    </main>

  );

}