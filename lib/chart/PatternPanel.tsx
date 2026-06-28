"use client";

import { PatternResult } from "@/lib/pattern/types";

type Props = {
  result?: PatternResult;
};

export default function PatternPanel({
  result,
}: Props) {

  if (!result) {

    return (

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

        <h2 className="text-xl font-bold mb-5">
          Pattern Engine
        </h2>

        <div className="text-zinc-500">
          Waiting for analysis...
        </div>

      </div>

    );

  }

  return (

    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      <h2 className="text-xl font-bold mb-5">
        Pattern Engine
      </h2>

      <table className="w-full text-sm">

        <tbody>

          <tr>
            <td className="text-zinc-500 py-2">
              Pattern
            </td>
            <td className="text-right">
              {result.pattern}
            </td>
          </tr>

          <tr>
            <td className="text-zinc-500 py-2">
              Confidence
            </td>
            <td className="text-right">
              {result.confidence}%
            </td>
          </tr>

          <tr>
            <td className="text-zinc-500 py-2">
              Breakout
            </td>
            <td className="text-right">
              {result.breakout.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="text-zinc-500 py-2">
              Target
            </td>
            <td className="text-right">
              {result.target.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="text-zinc-500 py-2">
              Stop Loss
            </td>
            <td className="text-right">
              {result.stoploss.toFixed(2)}
            </td>
          </tr>

          <tr>
            <td className="text-zinc-500 py-2">
              Swing Count
            </td>
            <td className="text-right">
              {result.swings.length}
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  );

}