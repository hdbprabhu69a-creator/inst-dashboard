"use client";

import {
  useMarketStructure,
} from "@/hooks/useMarketStructure";

export default function MarketHistoryTable() {

  const {
    structure,
    loading,
    error,
  } = useMarketStructure();

  if (loading) {

    return (

      <div className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-2">

        <div className="text-center text-zinc-500 text-xs">

          Loading...

        </div>

      </div>

    );

  }

  if (error) {

    return (

      <div className="col-span-4 bg-zinc-900 border border-red-500 rounded-xl p-2 text-red-400">

        {error}

      </div>

    );

  }

  return (

    <div className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-2">

      <table className="w-full text-xs">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-400">

            <th className="text-left py-1">
              TF
            </th>

            <th className="text-right py-1">
              HIGH
            </th>

            <th className="text-right py-1">
              LOW
            </th>

            <th className="text-right py-1">
              F23
            </th>

            <th className="text-right py-1">
              F38
            </th>

            <th className="text-right py-1">
              F50
            </th>

            <th className="text-right py-1">
              F61
            </th>

            <th className="text-right py-1">
              F76
            </th>

          </tr>

        </thead>

        <tbody>

          {structure.map(
            (row: any) => (

              <tr
                key={row.timeframe}
                className="
                  border-b
                  border-zinc-800/20
                "
              >

                <td className="py-1 font-bold text-cyan-400">

                  {row.timeframe}

                </td>

                <td className="text-right text-green-400">

                  {row.high?.toFixed(2)}

                </td>

                <td className="text-right text-red-400">

                  {row.low?.toFixed(2)}

                </td>

                <td className="text-right text-white">

                  {row.fib236?.toFixed(2)}

                </td>

                <td className="text-right text-green-400">

                  {row.fib382?.toFixed(2)}

                </td>

                <td className="text-right text-yellow-400">

                  {row.fib50?.toFixed(2)}

                </td>

                <td className="text-right text-orange-400">

                  {row.fib618?.toFixed(2)}

                </td>

                <td className="text-right text-red-400">

                  {row.fib786?.toFixed(2)}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}