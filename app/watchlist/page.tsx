"use client";

import { useEffect, useState } from "react";

type Row = {
  symbol:string;
  sector:string;

  cmp:number;

  open:number;
  high:number;
  low:number;
  close:number;

  volume:number;

  dpvt:number;
  wpvt:number;
  mpvt:number;

  oneWeekLow:number;
  oneWeekHigh:number;

  dailyVWAP:number;
  weeklyVWAP:number;
  monthlyVWAP:number;

  deliveryPctDaily:number;

  score:number;
  verdict:string;
};

const V:any = {
  "STRONG BUY":["SB","text-green-400"],
  "BUY ON DIP":["BD","text-cyan-400"],
  HOLD:["H","text-yellow-400"],
  OBSERVE:["O","text-orange-400"],
  AVOID:["A","text-red-400"],
};
const scoreColor=(s:number)=>
 s>=90?"text-green-400":
 s>=80?"text-cyan-400":
 s>=65?"text-yellow-400":
 s>=50?"text-orange-400":
 "text-red-400";
export default function WatchlistPage() {

  const [rows,setRows] =
    useState<Row[]>([]);

  const [prev,setPrev] =
    useState<Record<string,number>>({});

  const [search,setSearch] =
    useState("");

  const [loading,setLoading] =
    useState(true);

  const [time,setTime] =
    useState("");

  useEffect(() => {

    load();

    const i =
      setInterval(
        load,
        3000
      );

    return () =>
      clearInterval(i);

  }, []);

  async function load() {

    try {

      const r =
        await fetch(
          "/api/watchlist"
        );

      const j =
        await r.json();

      if (
        j.success
      ) {

        setPrev(
          Object.fromEntries(
            rows.map(
              r => [
                r.symbol,
                r.cmp
              ]
            )
          )
        );

        setRows(
          j.rows || []
        );

        setTime(
          new Date()
          .toLocaleTimeString()
        );

      }

    } catch(e) {

      console.error(e);

    } finally {

      setLoading(false);

    }

  }

  const filtered =
    rows.filter(
      r =>
        r.symbol
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const counts =
    rows.reduce(
      (a,r) => {

        const c =
          V[r.verdict]?.[0];

        if(c) a[c]++;

        return a;

      },
      {
        SB:0,
        BD:0,
        H:0,
        O:0,
        A:0,
      }
    );

  const cmpColor=(r:Row)=>{

 const p=prev[r.symbol];

 return p===undefined
  ?"text-white"
  :r.cmp>p
  ?"text-green-400 bg-green-950/40"
  :r.cmp<p
  ?"text-red-400 bg-red-950/40"
  :"text-white";

};
  if (loading) {

    return (

      <main className="bg-black min-h-screen flex items-center justify-center text-white">

        Loading...

      </main>

    );

  }

  return (

    <main className="bg-black text-white min-h-screen p-1">

      <div className="flex justify-between text-[10px] mb-1">

        <div className="text-cyan-400 font-bold">

          WATCHLIST({rows.length})

          {" | "}

          SB:{counts.SB}

          {" "}

          BD:{counts.BD}

          {" "}

          H:{counts.H}

          {" "}

          O:{counts.O}

          {" "}

          A:{counts.A}

        </div>

        <div className="text-green-400">

          LIVE {time}

        </div>

      </div>

      <input
        value={search}
        onChange={(e)=>
          setSearch(
            e.target.value
          )
        }
        placeholder="Search..."
        className="
          w-full
          bg-black
          border-b
          border-zinc-800
          text-[10px]
          px-1
          py-1
          mb-1
          outline-none
        "
      />

      <div className="overflow-auto">

        <table className="w-full table-fixed text-[10px]">

          <thead>

            <tr className="border-b border-cyan-900 bg-zinc-950 sticky top-0">

              <th className="w-[28px] text-zinc-600">#</th>

              <th className="w-[75px] text-left text-cyan-300">SYM</th>

              <th className="w-[48px] text-green-400">CMP</th>

              <th className="w-[50px] text-white">O</th>

              <th className="w-[50px] text-green-400">H</th>

              <th className="w-[50px] text-red-400">L</th>

              <th className="w-[50px] text-yellow-400">PC</th>

              <th className="w-[48px] text-blue-400">DP</th>

              <th className="w-[48px] text-blue-400">WP</th>

              <th className="w-[48px] text-blue-400">MP</th>

              <th className="w-[55px] text-orange-400">SWL</th>

              <th className="w-[55px] text-orange-400">SWH</th>

              <th className="w-[48px] text-purple-400">DV</th>

              <th className="w-[48px] text-purple-400">WV</th>

              <th className="w-[48px] text-purple-400">MV</th>

              <th className="w-[48px] text-yellow-400">VOL</th>

              <th className="w-[45px] text-yellow-400">DEL</th>

              <th className="w-[40px] text-cyan-400">SC</th>

              <th className="w-[40px] text-white">VD</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map(
              (r,i) => (

                <tr
                  key={r.symbol}
                  className="
 border-b
 border-zinc-900
 hover:bg-cyan-950/20
 cursor-pointer
 transition-all
"
                  onClick={() => {

                    localStorage.setItem(
                      "selectedStock",
                      r.symbol
                    );

                    window.location.href =
                      "/";

                  }}
                >

                  <td className="text-center text-zinc-500">
                    {i+1}
                  </td>

                  <td className="text-left text-cyan-200 font-bold">
  {r.symbol}
</td>
                  <td
 className={`text-center font-bold transition-all duration-300 ${cmpColor(r)}`}
>
 {r.cmp?.toFixed(2)}
</td>

                  <td className="text-center">
  {r.open?.toFixed(2)}
</td>

<td className="text-center text-green-400">
  {r.high?.toFixed(2)}
</td>

<td className="text-center text-red-400">
  {r.low?.toFixed(2)}
</td>

<td className="text-center text-yellow-400">
  {r.close?.toFixed(2)}
</td>
                  <td className="text-center">{r.dpvt?.toFixed(0)}</td>
                  <td className="text-center">{r.wpvt?.toFixed(0)}</td>
                  <td className="text-center">{r.mpvt?.toFixed(0)}</td>

                  <td className="text-center">{r.oneWeekLow?.toFixed(0)}</td>
                  <td className="text-center">{r.oneWeekHigh?.toFixed(0)}</td>

                  <td className="text-center">{r.dailyVWAP?.toFixed(0)}</td>
                  <td className="text-center">{r.weeklyVWAP?.toFixed(0)}</td>
                  <td className="text-center">{r.monthlyVWAP?.toFixed(0)}</td>

                  <td className="text-center">
                    {(r.volume/1000000).toFixed(1)}
                  </td>

                  <td className="text-center">
                    {r.deliveryPctDaily?.toFixed(0)}
                  </td>

                  <td
 className={`text-center font-bold ${scoreColor(r.score)}`}
>
 {r.score}
</td>
                  <td
 className={`text-center font-bold rounded ${
  r.verdict==="STRONG BUY"
   ?"bg-green-950 text-green-300"
   :r.verdict==="BUY ON DIP"
   ?"bg-cyan-950 text-cyan-300"
   :r.verdict==="HOLD"
   ?"bg-yellow-950 text-yellow-300"
   :r.verdict==="OBSERVE"
   ?"bg-orange-950 text-orange-300"
   :"bg-red-950 text-red-300"
 }`}
>
 {V[r.verdict]?.[0]}
</td>
                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </main>

  );

}