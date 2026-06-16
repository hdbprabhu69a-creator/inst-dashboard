"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

function toMillion(
  value: number = 0
) {
  return (
    value / 1000000
  ).toFixed(2);
}

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

  const ms =
    marketStructure as any;

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1">

      <table className="w-full text-[11px]">

        <thead>

          <tr className="border-b border-zinc-800 text-zinc-500">

            <th className="text-left py-0.5">
              TF
            </th>

            <th className="text-right py-0.5">
              VOL(M)
            </th>

            <th className="text-right py-0.5">
              DEL(M)
            </th>

            <th className="text-right py-0.5">
              DEL%
            </th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td className="py-0.5 font-bold text-cyan-400">
              D
            </td>

            <td className="text-right text-yellow-400">

              {toMillion(
                ms.totalVolumeDaily || 0
              )}

            </td>

            <td className="text-right text-orange-300">

              {toMillion(
                ms.totalDeliveryDaily || 0
              )}

            </td>

            <td className="text-right text-green-400">

              {ms.deliveryPctDaily?.toFixed(1) || "-"}

            </td>

          </tr>

          <tr>

            <td className="py-0.5 font-bold text-cyan-400">
              W
            </td>

            <td className="text-right text-yellow-400">

              {toMillion(
                ms.totalVolumeWeekly || 0
              )}

            </td>

            <td className="text-right text-orange-300">

              {toMillion(
                ms.totalDeliveryWeekly || 0
              )}

            </td>

            <td className="text-right text-green-400">

              {ms.deliveryPctWeekly?.toFixed(1) || "-"}

            </td>

          </tr>

          <tr>

            <td className="py-0.5 font-bold text-cyan-400">
              M
            </td>

            <td className="text-right text-yellow-400">

              {toMillion(
                ms.totalVolumeMonthly || 0
              )}

            </td>

            <td className="text-right text-orange-300">

              {toMillion(
                ms.totalDeliveryMonthly || 0
              )}

            </td>

            <td className="text-right text-green-400">

              {ms.deliveryPctMonthly?.toFixed(1) || "-"}

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}