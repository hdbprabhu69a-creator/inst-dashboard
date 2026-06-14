"use client";

import {
  useEffect,
  useState,
} from "react";

export default function ScannerPage() {

  const [stocks, setStocks] =
    useState<any[]>([]);

  const [results, setResults] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [running, setRunning] =
    useState(false);

  const [scanner, setScanner] =
    useState("ALL");

  const [filters, setFilters] =
    useState({

      aboveDailyPivot: true,
      aboveWeeklyPivot: true,
      aboveMonthlyPivot: true,

      aboveDailyVWAP: true,
      aboveWeeklyVWAP: true,
      aboveMonthlyVWAP: true,

      aboveDailyCPR: true,
      aboveWeeklyCPR: true,
      aboveMonthlyCPR: true,

      near1WeekHigh: false,
      near1MonthHigh: false,

    });

  useEffect(() => {

    loadStocks();

  }, []);

  async function loadStocks() {

    try {

      const response =
        await fetch(
          "/api/scanner"
        );

      const result =
        await response.json();

      if (result.success) {

        setStocks(
          result.stocks || []
        );

        setResults(
          result.stocks || []
        );

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function runScan() {

    try {

      setRunning(true);

      const response =
        await fetch(
          "/api/scanner",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                ...filters,

                scanner,

              }),
          }
        );

      const result =
        await response.json();

      if (result.success) {

        setResults(
          result.stocks || []
        );

      }

    } catch (error) {

      console.error(error);

    } finally {

      setRunning(false);

    }

  }

  function toggleFilter(
    key: string
  ) {

    setFilters(
      (prev: any) => ({
        ...prev,
        [key]:
          !prev[key],
      })
    );

  }

  function buttonClass(
    active: boolean
  ) {

    return active

      ? "bg-green-700 text-white"

      : "bg-zinc-900 text-zinc-400";

  }

  if (loading) {

    return (

      <main className="bg-black min-h-screen flex items-center justify-center text-white">

        Loading Scanner...

      </main>

    );

  }

  const sectorMap:
    Record<
      string,
      any[]
    > = {};

  results.forEach(
    (stock: any) => {

      const sector =
        stock.sector ||
        "UNKNOWN";

      if (
        !sectorMap[
          sector
        ]
      ) {

        sectorMap[
          sector
        ] = [];

      }

      sectorMap[
  sector
].push(stock);
    }
  );

  const sectors =
    Object.entries(
      sectorMap
    ).sort(
      (
        a,
        b
      ) =>
        b[1].length -
        a[1].length
    );

  return (

    <main
      className="
        bg-black
        min-h-screen
        p-2
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
          mb-2
        "
      >

         SCANNER
        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <select
            value={scanner}
            onChange={(e) =>
              setScanner(
                e.target.value
              )
            }
           className="
  bg-zinc-900
  border
  border-zinc-700
  text-white
  text-[11px]
  px-2
  py-1
  rounded
"
          >

            <option value="ALL">
              All Stocks
            </option>

            <option value="CPR05">
              CPR Width &lt; 0.5%
            </option>

            <option value="CPR10">
  CPR Width &lt; 1%
</option>

<option value="ALIGNMENT">
  Alignment 8/9+
</option>

          </select>

          <div
            className="
              text-zinc-500
              text-sm
            "
          >
            {results.length}
            {" "}
            Results
          </div>

        </div>

      </div>

      <div
        className="
          border
          border-zinc-800
          rounded-lg
          p-2
          mb-3
          flex
          justify-between
          items-center
        "
      >

        <div
          className="
            flex
            flex-wrap
            gap-1
          "
        >

          {[
            ["DP","aboveDailyPivot"],
            ["WP","aboveWeeklyPivot"],
            ["MP","aboveMonthlyPivot"],
            ["DV","aboveDailyVWAP"],
            ["WV","aboveWeeklyVWAP"],
            ["MV","aboveMonthlyVWAP"],
            ["DC","aboveDailyCPR"],
            ["WC","aboveWeeklyCPR"],
            ["MC","aboveMonthlyCPR"],
            ["1WH","near1WeekHigh"],
            ["1MH","near1MonthHigh"],
          ].map(
            ([label,key]) => (

              <button
                key={key}
                onClick={() =>
                  toggleFilter(
                    key
                  )
                }
                className={`
                  w-10
                  h-6
                  rounded
                  text-[10px]
                  font-semibold
                  ${buttonClass(
                    filters[
                      key as keyof typeof filters
                    ]
                  )}
                `}
              >
                {label}
              </button>

            )
          )}

        </div>

        <button
          onClick={
            runScan
          }
          disabled={
            running
          }
          className="
  bg-cyan-700
  hover:bg-cyan-600
  text-white
  text-[10px]
  font-bold
  px-2
  py-1
  rounded
"
        >
          {
            running
              ? "RUN..."
              : "SCAN"
          }
        </button>

      </div>

      {sectors.map(
        (
          [sector, sectorStocks]
        ) => (

          <div
            key={sector}
            className="mb-3"
          >

            <div
             className="
  text-orange-100
 text-[11px]  
  font-bold
  mb-1
  border-b
  border-zinc-900
  pb-1
"
            >
              {sector}
              {" "}
              (
              {
                sectorStocks.length
              }
              )
            </div>

            <div
              className="
                grid
                grid-cols-4
md:grid-cols-8
xl:grid-cols-10
2xl:grid-cols-12
                gap-1
              "
            >

              {sectorStocks.map(
                (
                  stock: any
                ) => (

                  <div
                    key={
                      stock.symbol
                    }

                    onClick={() => {

                      localStorage.setItem(
                        "selectedStock",
                        stock.symbol
                      );

                      window.location.href =
                        "/";

                    }}

                 className="
  bg-black
  border
  border-zinc-900
  rounded

  h-11

  flex
  flex-row

  items-center
  justify-between

  px-2

  hover:bg-zinc-950

  cursor-pointer
"                  >

                    <div
  className="
    flex
    flex-col
    w-full
    leading-none
  "
>

  <div
    className="
      text-orange-100
      text-[10px]
      font-bold
      truncate
    "
  >
    {stock.symbol}
  </div>

  <div
    className="
      text-zinc-400
      text-[9px]
    "
  >
    CMP {stock.cmp?.toFixed(0)}
  </div>

  <div
    className="
      text-cyan-400
      text-[9px]
    "
  >

    {
      scanner === "ALIGNMENT"

        ? `A ${stock.alignmentScore || 0}/9`

        : scanner === "CPR05" ||
          scanner === "CPR10"

        ? `C ${
            stock.cprWidth
              ? stock.cprWidth.toFixed(2)
              : "0.00"
          }%`

        : ""
    }

  </div>

</div>
                   
                  </div>

                )
              )}

            </div>

          </div>

        )
      )}

    </main>

  );

}