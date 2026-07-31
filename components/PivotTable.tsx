"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function PivotTable() {

  const {
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  if (
    marketStructureLoading
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-500">

        Loading Pivot Structure...

      </div>

    );

  }

  if (
    !marketStructure
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-red-400">

        No Pivot Structure Found

      </div>

    );

  }

  const data = [

    {
      timeframe: "D",
      ...marketStructure.dailyPivot,
    },

    {
      timeframe: "W",
      ...marketStructure.weeklyPivot,
    },

    {
      timeframe: "M",
      ...marketStructure.monthlyPivot,
    },

  ];

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2">

      <table className="w-full text-xs">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-500">

            <th className="text-left py-1">
              TF
            </th>

            <th className="text-right py-1">
              S2
            </th>

            <th className="text-right py-1">
              S1
            </th>

            <th className="text-right py-1">
              PVT
            </th>

            <th className="text-right py-1">
              R1
            </th>

            <th className="text-right py-1">
              R2
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map(
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

                <td className="text-right text-red-400">

                  {row.s2?.toFixed(2)}

                </td>

                <td className="text-right text-red-400">

                  {row.s1?.toFixed(2)}

                </td>

                <td className="text-right text-blue-400">

                  {row.pivot?.toFixed(2)}

                </td>

                <td className="text-right text-green-400">

                  {row.r1?.toFixed(2)}

                </td>

                <td className="text-right text-green-400">

                  {row.r2?.toFixed(2)}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}
