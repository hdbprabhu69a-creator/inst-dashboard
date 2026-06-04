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
            "/api/scan-universe"
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

        Scanning Universe...

      </div>

    );

  }

  return (

    <div className="p-4">

      <h1
        className="
          text-4xl
          font-bold
          text-cyan-400
          mb-4
        "
      >
        HEAT MAP
      </h1>

      <div
        className="
          grid
          grid-cols-8
          gap-2
        "
      >

        {stocks.map(
          (stock: any) => (

            <div
              key={stock.symbol}
              className={`
                rounded-xl
                h-20
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
                    : stock.color === "YELLOW"
                    ? "bg-yellow-500"
                    : "bg-red-600"
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
                {stock.score}
              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}