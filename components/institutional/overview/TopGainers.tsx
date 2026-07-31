"use client";

import { useEffect,useState } from "react";

type Row={
  symbol:string;
  cmp:number;
  changePct:number;
  close:number;
  dvol:number;
};

export default function TopGainers(){

  const [rows,setRows]=useState<Row[]>([]);

  useEffect(()=>{

    async function load(){

      try{

        const r=await fetch("/api/watchlist?t="+Date.now());

        const j=await r.json();

        const gainers=(j.rows||[])
          .filter((x:any)=>x.changePct>0)
          .sort((a:any,b:any)=>b.changePct-a.changePct)
          .slice(0,10)
          .map((x:any)=>({

            symbol:x.symbol,
            cmp:x.cmp,
            changePct:x.changePct,
            close:x.close,
            dvol:x.dvol || 0

          }));

        setRows(gainers);

      }catch(e){

        console.error(e);

      }

    }

    load();

  },[]);

  return(

    <div className="overflow-hidden rounded-lg border border-[#26313c]">

      <table className="w-full text-[11px]">

        <thead className="bg-[#0b1016] text-[#3cf2df]">

          <tr>

            <th className="px-2 py-1 text-left">SYM</th>
            <th className="px-2 py-1 text-right">CMP</th>
            <th className="px-2 py-1 text-right">CHG%</th>
            <th className="px-2 py-1 text-right">PCLOSE</th>
            <th className="px-2 py-1 text-right">VOL(LIVE)</th>

          </tr>

        </thead>

        <tbody>

          {rows.map(r=>(

            <tr
              key={r.symbol}
              className="border-t border-[#1f2937] hover:bg-[#111827]"
            >

              <td className="px-2 py-1 text-cyan-300 font-semibold">{r.symbol}</td>

              <td className="px-2 py-1 text-right">{r.cmp.toFixed(2)}</td>

              <td className={"px-2 py-1 text-right "+(r.changePct>=0?"text-green-400":"text-red-400")}>
                {r.changePct.toFixed(2)}%
              </td>

              <td className="px-2 py-1 text-right">
                {r.close.toFixed(2)}
              </td>

              <td className="px-2 py-1 text-right">
                {(r.dvol/1000000).toFixed(1)}M
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}




