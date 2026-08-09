"use client";

import { Stock } from "./types";

import SwingCells from "./SwingCells";
import FibCells from "./FibCells";
import PivotCells from "./PivotCells";
import VolumeDeliveryRows from "./VolumeDeliveryRows";

interface Props {
  row: Stock;
  index: number;
  swingFilter: string;
  volPeriod: string;
  history: any[];
  num: (v: any) => string;
  dt: (v: any) => string;
}

export default function TableRow({
  row,
  index,
  swingFilter,
  volPeriod,
  history,
  num,
  dt,
}: Props) {
  if (swingFilter === "VOLDEL") {
    return (
      <VolumeDeliveryRows
        row={row}
        history={history}
        index={index}
        num={num}
      />
    );
  }

  return (
    <tr
      className={`${
        index % 2 === 0
          ? "bg-black"
          : "bg-zinc-950"
      } hover:bg-zinc-900`}
    >
      <td className="sticky left-0 z-40 border border-zinc-800 bg-inherit px-0.5 py-0.5 text-center font-bold text-cyan-300 whitespace-nowrap">
        {row.symbol}
      </td>

      <td className="sticky left-[90px] z-40 border border-zinc-800 bg-inherit px-0.5 py-0.5 text-center font-bold text-lime-300 whitespace-nowrap">
        {num(row.liveCmp ?? row.cmp)}
      </td>

      <SwingCells
        row={row}
        swingFilter={swingFilter}
        num={num}
        dt={dt}
      />

      {swingFilter !== "PIVOT" && (
        <FibCells
          row={row}
          swingFilter={swingFilter}
          num={num}
        />
      )}

      {swingFilter === "PIVOT" && (
        <PivotCells
          row={row}
          swingFilter={swingFilter}
          num={num}
        />
      )}
    </tr>
  );
}