"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function VolumeTable() {

  const {
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  if (
    marketStructureLoading
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-zinc-500">

        Loading Volume...

      </div>

    );

  }

  if (
    !marketStructure
  ) {

    return (

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs text-red-400">

        No Volume Data

      </div>

    );

  }

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1">

      <table className="w-full text-[11px]">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-500">

            <th className="text-left py-0.5">
              TF
            </th>

            <th className="text-right py-0.5">
             VOLUME
            </th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td className="py-0.5 font-bold text-cyan-400">
              D
            </td>

            <td className="text-right text-yellow-400">
              {Math.round(
                marketStructure.totalVolumeDaily || 0
              ).toLocaleString()}
            </td>

          </tr>

          <tr>

            <td className="py-0.5 font-bold text-cyan-400">
              W
            </td>

            <td className="text-right text-yellow-400">
              {Math.round(
                  marketStructure.totalVolumeWeekly || 0
 
              ).toLocaleString()}
            </td>

          </tr>

          <tr>

            <td className="py-0.5 font-bold text-cyan-400">
              M
            </td>

            <td className="text-right text-yellow-400">
              {Math.round(
                marketStructure.totalVolumeMonthly || 0
              ).toLocaleString()}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}