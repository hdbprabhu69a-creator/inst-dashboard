"use client";

import { useEffect, useState } from "react";

type Row = {
  symbol:string;
  sector:string;

  cmp:number;

change:number;
changePct:number;

open:number;
  high:number;
  low:number;
  close:number;

  volume:number;

dvol:number;
wvol:number;
mvol:number;

dpvt:number;
wpvt:number;
mpvt:number;

dailyVWAP:number;
weeklyVWAP:number;
monthlyVWAP:number;

oneWeekLow:number;
oneWeekHigh:number;
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
 s>=70?"text-green-400":
 s>=60?"text-cyan-400":
 s>=50?"text-yellow-400":
 s>=35?"text-orange-400":
 "text-red-400";
export default function WatchlistPage() {

  const [rows,setRows] =
    useState<Row[]>([]);

  const [prev,setPrev] =
    useState<Record<string,number>>({});

  const [search,setSearch] =
    useState("");
const [selectedFilters,setSelectedFilters] =
  useState<string[]>([]);

const [runFilters,setRunFilters] =
  useState<string[]>([]);

const [scannerApplied,setScannerApplied] =
  useState(false);

const [scannerType,setScannerType] =
  useState("All Stocks");

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

 let filtered=[...rows];

//----------------------------------
// SEARCH
//----------------------------------

filtered=filtered.filter(r=>
  r.symbol.toLowerCase().includes(search.toLowerCase())
);

//----------------------------------
// SCANNER
//----------------------------------

if(scannerApplied){

  switch(scannerType){

    case "All Stocks":
      break;

    case "Buy Zone":

      filtered=filtered.filter(r=>
        r.verdict==="STRONG BUY"||
        r.verdict==="BUY ON DIP"
      );

      break;

    case "Pullback":

      filtered=filtered.filter(r=>
        r.cmp>r.dpvt &&
        r.cmp<r.oneWeekHigh
      );

      break;

    case "Breakout":

      filtered=filtered.filter(r=>{

        let s=0;

        if(r.score>=60)s+=20;
        if(r.cmp>r.dpvt)s+=15;
        if(r.cmp>r.wpvt)s+=15;
        if(r.dailyVWAP>0 && r.cmp>r.dailyVWAP)s+=10;
        if(r.changePct>=0.5)s+=10;
        if(r.dvol>r.wvol/5)s+=10;
        if(r.deliveryPctDaily>=40)s+=10;
        if(r.oneWeekHigh>0 && r.cmp>=r.oneWeekHigh*0.995)s+=20;

        return s>=60;

      });

      break;

    case "Momentum":

      filtered=filtered.filter(r=>{

        let s=0;

        if(r.score>=60)s+=20;
        if(r.cmp>r.dpvt)s+=10;
        if(r.cmp>r.wpvt)s+=10;
        if(r.cmp>r.mpvt)s+=10;
        if(r.dailyVWAP>0 && r.cmp>r.dailyVWAP)s+=10;
        if(r.changePct>=1)s+=15;
        else if(r.changePct>=0.5)s+=8;
        if(r.dvol>r.wvol/5)s+=10;
        if(r.deliveryPctDaily>=50)s+=10;
        if(r.oneWeekHigh>0 && r.cmp>=r.oneWeekHigh*0.98)s+=15;

        return s>=65;

      });

      break;

    case "Top Gainers":

      filtered=filtered
        .filter(r=>r.changePct>0)
        .sort((a,b)=>b.changePct-a.changePct);

      break;

    case "Top Losers":

      filtered=filtered
        .filter(r=>r.changePct<0)
        .sort((a,b)=>a.changePct-b.changePct);

      break;

  }

}

//----------------------------------
// LEFT FILTERS
//----------------------------------

if(runFilters.length){

  filtered=filtered.filter(r=>

    runFilters.every(f=>{

      switch(f){

        case "BZ":
          return r.verdict==="STRONG BUY"||
                 r.verdict==="BUY ON DIP";

        case "DP":
          return r.cmp>r.dpvt;

        case "WP":
          return r.cmp>r.wpvt;

        case "MP":
          return r.cmp>r.mpvt;

        case "DV":
          return r.dvol>0;

        case "WW":
          return r.wvol>0;

        case "MV":
          return r.mvol>0;

        case "DC":
          return r.deliveryPctDaily>=50;

        case "WC":
          return r.cmp>=r.oneWeekLow;

        case "MC":
          return r.cmp>=r.oneWeekHigh;

        default:
          return true;

      }

    })

  );

}
const counts =
    rows.reduce(
      (a,r) => {

        const c =
          V[r.verdict]?.[0];

        if (c && c in a) {
  a[c as keyof typeof a]++;
}

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

const cmpColor=(r:Row)=>
  r.cmp >= r.dpvt
    ? "text-green-400 font-bold"
    : "text-red-400 font-bold";

const pivotColor=(
  cmp:number,
  pivot:number
)=>
  cmp >= pivot
    ? "text-green-400"
    : "text-red-400";

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
{" | "}
RESULTS:{filtered.length}
        </div>

        

      </div>
<div className="flex items-center gap-1 mb-1 flex-wrap">

  {[
    "BZ",
    "DP",
    "WP",
    "MP",
    "DV",
    "WW",
    "MV",
    "DC",
    "WC",
    "MC",
  ].map((f) => (

    <button
      key={f}
      onClick={() => {

        setSelectedFilters((prev) =>
          prev.includes(f)
            ? prev.filter(x => x !== f)
            : [...prev, f]
        );

      }}
      className={`
        px-2
        py-0.5
        text-[10px]
        rounded
        ${
          selectedFilters.includes(f)
            ? "bg-green-700 text-white"
            : "bg-zinc-900 text-zinc-400"
        }
      `}
    >
      {f}
    </button>

  ))}

  <select
    value={scannerType}
    onChange={(e)=>
      setScannerType(
        e.target.value
      )
    }
    className="
      ml-auto
      bg-zinc-900
      border
      border-zinc-700
      text-[10px]
      px-2
      py-1
      rounded
    "
  >
                  <option>All Stocks</option>
              <option>Buy Zone</option>
    <option>Pullback</option>
    <option>Breakout</option>
    <option>Momentum</option>
    <option>Top Gainers</option>
    <option>Top Losers</option>
  </select>

  <button
   onClick={() => {
  setRunFilters([...selectedFilters]);
setScannerApplied(true);
}}
    className="
      bg-cyan-700
      px-3
      py-1
      rounded
      text-[10px]
      font-bold
    "
  >
    RUN
  </button>
<input
  value={search}
  onChange={(e)=>
    setSearch(
      e.target.value
    )
  }
  placeholder="Search..."
  className="
    w-[160px]
    bg-black
    border
    border-zinc-800
    text-[10px]
    px-2
    py-1
    rounded
    outline-none
  "
/>
</div>   

    <div
  className="overflow-x-auto"
>

        <table className="w-full table-fixed text-[10px]">

          <thead>

            <tr className="border-b border-cyan-900 bg-zinc-950 sticky top-0">

              <th className="w-[28px] text-zinc-600">#</th>

              <th className="w-[75px] text-left text-cyan-300 sticky left-0 bg-black z-20">
  SYM
</th>

              <th className="w-[42px] text-green-400 sticky left-[75px] bg-black z-20">
  CMP
</th>
<th className="w-[40px] text-cyan-400">CHG%</th>

<th className="w-[40px] text-yellow-400">SC</th>

              <th className="w-[40px] text-white">VD</th>

              <th className="w-[42px] text-white">OPEN</th>

              <th className="w-[42px] text-green-400">HIGH</th>

              <th className="w-[42px] text-red-400">LOW</th>

              <th className="w-[42px] text-yellow-400">CLOSE</th>

              <th className="w-[42px] text-blue-400">DP</th>

              <th className="w-[42px] text-blue-400">WP</th>
<th className="w-[42px] text-blue-400">MP</th>
              

              <th className="w-[42px] text-orange-400">SWL</th>

              <th className="w-[42px] text-orange-400">SWH</th>

              <th className="w-[42px] text-purple-400">DVOL</th>

<th className="w-[42px] text-purple-400">WVOL</th>

<th className="w-[42px] text-purple-400">MVOL</th>

<th className="w-[42px] text-yellow-400">DDEL</th>
              
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
"onClick={() => {

  localStorage.setItem(
    "selectedStock",
    r.symbol
  );

  window.open(
    "/",
    "_blank"
  );

}}
                >

                  <td className="text-center text-zinc-500">
                    {i+1}
                  </td>

                 <td className="text-left text-cyan-200 font-bold sticky left-0 bg-black z-10">
  {r.symbol}
</td>
     <td
 className={`text-center sticky left-[75px] bg-black z-10 ${cmpColor(r)}`}
>
 {r.cmp?.toFixed(2)}
</td>
                  <td className={`text-center font-bold ${r.changePct>=0?"text-green-400":"text-red-400"}`}>
  {r.changePct.toFixed(2)}%
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
                 <td
 className={`text-center ${pivotColor(r.cmp,r.dpvt)}`}
>
 {r.dpvt?.toFixed(0)}
</td>

<td
 className={`text-center ${pivotColor(r.cmp,r.wpvt)}`}
>
 {r.wpvt?.toFixed(0)}
</td>

<td
 className={`text-center ${pivotColor(r.cmp,r.mpvt)}`}
>
 {r.mpvt?.toFixed(0)}
</td>

                  <td className="text-center">{r.oneWeekLow?.toFixed(0)}</td>
                  <td className="text-center">{r.oneWeekHigh?.toFixed(0)}</td>

                  <td className="text-center">
  {(r.dvol/1000000).toFixed(1)}
</td>

<td className="text-center">
  {(r.wvol/1000000).toFixed(1)}
</td>

<td className="text-center">
  {(r.mvol/1000000).toFixed(1)}
</td>

<td className="text-center">
  {r.deliveryPctDaily?.toFixed(0)}
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

































