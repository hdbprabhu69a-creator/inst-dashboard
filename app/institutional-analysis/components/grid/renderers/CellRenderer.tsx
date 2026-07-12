"use client";

import { GridColumn } from "../GridTypes";
import { GridTheme } from "../GridTheme";

export function renderCell(column: GridColumn, row: any) {

  let value = row[column.key];

  if (typeof value === "number") {

    switch (column.type) {

      case "score":
        value = Math.round(value);
        break;

      case "percent":
      case "probability":
        value = value.toFixed(1) + "%";
        break;

      case "volume":
        if (value >= 10000000) value = (value / 10000000).toFixed(1) + "Cr";
        else if (value >= 100000) value = (value / 100000).toFixed(1) + "L";
        else if (value >= 1000) value = (value / 1000).toFixed(1) + "K";
        else value = value.toFixed(1);
        break;

      default:
        value = value.toFixed(1);
        break;

    }

  }

  const badge = (text: any, color: string) => (
    <span className={"inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold shadow-lg " + color}>
      {text ?? "-"}
    </span>
  );

  switch (column.type) {

    case "pivot":
    case "price":
      return <span className={GridTheme.pivot}>{value}</span>;

    case "support":
      return <span className={GridTheme.support}>{value}</span>;

    case "resistance":
      return <span className={GridTheme.resistance}>{value}</span>;

    case "score":
      return badge(value, "bg-cyan-900/40 text-cyan-300 border border-cyan-500");

    case "alignment":
      return badge(value, "bg-emerald-900/40 text-emerald-300 border border-emerald-500");

    case "bias":
      return badge(value, "bg-orange-900/40 text-orange-300 border border-orange-500");

    case "probability":
      return badge(value, "bg-yellow-900/40 text-yellow-300 border border-yellow-500");

    case "verdict":
      return badge(value, "bg-lime-900/40 text-lime-300 border border-lime-500");

    case "badge":

      if (typeof value === "string") {

        const v = value.toLowerCase();

        if (v.includes("bull") || v.includes("buy") || v.includes("yes") || v.includes("strong"))
          return badge(value, "bg-emerald-900/40 text-emerald-300 border border-emerald-500");

        if (v.includes("bear") || v.includes("sell") || v.includes("no") || v.includes("weak"))
          return badge(value, "bg-red-900/40 text-red-300 border border-red-500");

        if (v.includes("neutral"))
          return badge(value, "bg-yellow-900/40 text-yellow-300 border border-yellow-500");

      }

      return badge(value, "bg-slate-800 text-slate-200 border border-slate-600");

    default:
      return value ?? "-";

  }

}
