"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function FibTable() {

  const {
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  if (
    marketStructureLoading
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-zinc-500">

        Loading Fib Structure...

      </div>

    );

  }

  if (
    !marketStructure
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-red-400">

        No Fib Structure Found

      </div>

    );

  }

  const rows = [

    {
      tf: "1W",
      fib: marketStructure.weeklyFib,
    },

    {
      tf: "2W",
      fib: marketStructure.weeklyFib,
    },

    {
      tf: "1M",
      fib: marketStructure.monthlyFib,
    },

    {
      tf: "3M",
      fib: marketStructure.monthlyFib,
    },

    {
      tf: "6M",
      fib: marketStructure.monthlyFib,
    },

    {
      tf: "1Y",
      fib: marketStructure.monthlyFib,
    },

  ];

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1">

      <table className="w-full text-xs table-fixed">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-500">

            <th className="text-left py-1">
              TF
            </th>

            <th className="text-right py-1">
              23.6
            </th>

            <th className="text-right py-1">
              38.2
            </th>

            <th className="text-right py-1">
              50
            </th>

            <th className="text-right py-1">
              61.8
            </th>

            <th className="text-right py-1">
              78.6
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row) => (

              <tr
                key={row.tf}
                className="
                  border-b
                  border-zinc-800/20
                "
              >

                <td className="py-1 font-bold text-cyan-400">

                  {row.tf}

                </td>

                <td className="text-right text-orange-200">

                  {row.fib?.fib236?.toFixed(2)}

                </td>

                <td className="text-right text-orange-200">

                  {row.fib?.fib382?.toFixed(2)}

                </td>

                <td className="text-right text-blue-400">

                  {row.fib?.fib50?.toFixed(2)}

                </td>

                <td className="text-right text-green-400">

                  {row.fib?.fib618?.toFixed(2)}

                </td>

                <td className="text-right text-green-400">

                  {row.fib?.fib786?.toFixed(2)}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}