"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SectorHeatMapPage() {

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

        const sortedSectors =
          (result.sectors || []).sort(
            (a: any, b: any) =>
              a.rank - b.rank
          );

        setSectors(
          sortedSectors
        );

      } catch (error) {

        console.error(
          error
        );

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
          p-6
          text-cyan-400
          text-xl
        "
      >
        Loading Sector Heat Map...
      </div>

    );

  }

  return (

    <main
      className="
        p-6
        min-h-screen
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >

        {sectors.map(
          (
            sector: any
          ) => (

            <Link
              key={sector.sector}
              href={`/sector/${sector.sector}`}
            >

              <div
                className={`
                  rounded-xl
                  p-5
                  cursor-pointer
                  transition-all
                  hover:scale-105
                  border

                  ${
                    sector.avgHeat >= 60

                      ? "bg-green-950 border-green-600"

                      : sector.avgHeat >= 40

                      ? "bg-yellow-900 border-yellow-600"

                      : "bg-red-950 border-red-600"
                  }
                `}
              >

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    mb-3
                  "
                >

                  <div
                    className="
                      text-white
                      text-xl
                      font-bold
                    "
                  >
                    {sector.sector}
                  </div>

                  <div
                    className="
                      bg-cyan-500
                      text-black
                      text-xs
                      px-2
                      py-1
                      rounded
                      font-bold
                    "
                  >
                    #{sector.rank}
                  </div>

                </div>

                <div
                  className="
                    text-white
                    text-5xl
                    font-bold
                  "
                >
                  {Math.round(
                    sector.avgHeat
                  )}
                </div>

                <div
                  className="
                    text-zinc-200
                    mt-4
                    text-sm
                  "
                >
                  Stocks:
                  {" "}
                  {sector.stockCount}
                </div>

                <div
                  className="
                    text-green-300
                    text-sm
                  "
                >
                  Strong Buy:
                  {" "}
                  {sector.strongBuyCount}
                </div>

                <div
                  className="
                    text-yellow-200
                    text-sm
                  "
                >
                  Watch:
                  {" "}
                  {sector.watchCount}
                </div>

                <div
                  className="
                    text-red-300
                    text-sm
                  "
                >
                  Avoid:
                  {" "}
                  {sector.avoidCount}
                </div>

              </div>

            </Link>

          )
        )}

      </div>

    </main>

  );

}