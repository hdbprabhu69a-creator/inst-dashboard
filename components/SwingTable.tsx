"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

function formatDate(
  timestamp: any
) {

  if (!timestamp?.seconds) {
    return "-";
  }

  const date =
    new Date(
      timestamp.seconds * 1000
    );

  const day =
    date
      .getDate()
      .toString()
      .padStart(2, "0");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day}-${months[date.getMonth()]}`;

}

export default function SwingTable() {

  const {
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  if (
    marketStructureLoading
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-zinc-500">

        Loading Swing Structure...

      </div>

    );

  }

  if (
    !marketStructure
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-red-400">

        No Swing Structure Found

      </div>

    );

  }

  const data = [

    {
      tf: "1W",
      ...marketStructure.oneWeekSwing,
    },

    {
      tf: "2W",
      ...marketStructure.twoWeekSwing,
    },

    {
      tf: "1M",
      ...marketStructure.oneMonthSwing,
    },

    {
      tf: "3M",
      ...marketStructure.threeMonthSwing,
    },

    {
      tf: "6M",
      ...marketStructure.sixMonthSwing,
    },

    {
      tf: "1Y",
      ...marketStructure.oneYearSwing,
    },

  ];

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 overflow-x-auto">

      <table className="w-full text-xs">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-500">

            <th className="text-left py-1 w-[40px]">
              TF
            </th>

            <th className="text-right py-1 w-[90px]">
              HIGH
            </th>

            <th className="text-right py-1 w-[90px]">
              LOW
            </th>

            <th className="text-right py-1 w-[90px]">
              RANGE
            </th>

            <th className="text-right py-1 w-[90px]">
              HD
            </th>

            <th className="text-right py-1 w-[90px]">
              LD
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map(
            (row: any) => (

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

                  {row.high?.toFixed(2)}

                </td>

                <td className="text-right text-orange-200">

                  {row.low?.toFixed(2)}

                </td>

                <td className="text-right text-cyan-400">

                  {row.range?.toFixed(2)}

                </td>

                <td className="text-right text-zinc-400">

                  {formatDate(
                    row.highDate
                  )}

                </td>

                <td className="text-right text-zinc-400">

                  {formatDate(
                    row.lowDate
                  )}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}
