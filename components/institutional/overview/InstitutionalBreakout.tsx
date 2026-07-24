"use client";

import { useEffect, useState } from "react";

interface BreakoutRow{
  symbol:string;
  sector:string;
  breakoutScore:number;
  verdict:string;
  structure:string;
  phase:string;
  confidence:number;
  institutionalScore:number;
  breakoutDistance:number;
}

export default function InstitutionalBreakout(){

  const [rows,setRows]=useState<BreakoutRow[]>([]);

console.log("ROWS STATE",rows);

  useEffect(()=>{

    fetch("/api/institutional-overview/breakout?t="+Date.now(),{cache:"no-store"})
      .then(r=>r.json())
      .then(r=>{

console.log("BREAKOUT API",r);

setRows(r.rows??[]);

});

  },[]);

  return(

    <div className="rounded-xl border border-[#1f2937] bg-[#080d14] p-3">

      <div className="mb-3 flex items-center justify-between">

        <div className="font-semibold text-white">
          INSTITUTIONAL BREAKOUT
        </div>

        <div className="rounded bg-cyan-950 px-2 py-1 text-xs font-semibold text-cyan-300">
          {rows.length} ACTIVE
        </div>

      </div>

      <table className="w-full text-xs">

        <thead className="border-b border-zinc-800 text-cyan-400">

          <tr>

            <th className="py-2 text-left">SYMBOL</th>

            <th>STAGE</th>

            <th>TREND</th>

            <th>FLOW</th>

            <th>DIST</th>

            <th>SCORE</th>

          </tr>

        </thead>

        <tbody>

          {rows.length===0 && (

            <tr>

              <td
                colSpan={6}
                className="py-8 text-center text-zinc-500"
              >
                No institutional breakouts today
              </td>

            </tr>

          )}

          {rows.map(row=>(

            <tr
              key={row.symbol}
              className="border-b border-zinc-900 hover:bg-cyan-950/20"
            >

              <td className="py-2 font-semibold text-yellow-300">
                {row.symbol}
              </td>

              <td>

                <span className="rounded bg-yellow-500/20 px-2 py-1 text-yellow-300">
                  WATCH
                </span>

              </td>

              <td className="text-green-400">
                {row.structure}
              </td>

              <td className="text-cyan-300">
                {row.institutionalScore}
              </td>

              <td className="text-white">
                {row.breakoutDistance.toFixed(2)}%
              </td>

              <td>

                <span className="font-bold text-green-400">
                  {row.breakoutScore}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}


