"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function CPRTable() {

  const {
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  if (
    marketStructureLoading
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-zinc-500">

        Loading CPR...

      </div>

    );

  }

  if (
    !marketStructure
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-red-400">

        No CPR Data

      </div>

    );

  }

  const data = [

    {
      timeframe: "D",
      ...marketStructure.dailyCPR,
    },

    {
      timeframe: "W",
      ...marketStructure.weeklyCPR,
    },

    {
      timeframe: "M",
      ...marketStructure.monthlyCPR,
    },

  ];

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1">

      <table className="w-full text-[11px]">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-500">

            <th className="text-left py-0.5">
              TF
            </th>

            <th className="text-right py-0.5">
              BC
            </th>

            <th className="text-right py-0.5">
              PVT
            </th>

            <th className="text-right py-0.5">
              TC
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

                <td className="py-0.5 font-bold text-cyan-400">

                  {row.timeframe}

                </td>

                <td className="text-right text-red-400">

                  {row.bc?.toFixed(2)}

                </td>

                <td className="text-right text-blue-400">

                  {row.pivot?.toFixed(2)}

                </td>

                <td className="text-right text-green-400">

                  {row.tc?.toFixed(2)}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}