"use client";

import { useEffect, useState } from "react";

function num(value: any) {
  return value == null || isNaN(value)
    ? "-"
    : Number(value).toFixed(2);
}

function dt(value: any) {
  if (!value) return "-";

  if (value.seconds) {
    return new Date(
      value.seconds * 1000
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  }

  return String(value);
}

export default function SwingFibPage() {

  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

const [search,setSearch]=useState("");
const [sectorFilter,setSectorFilter]=useState("ALL");

  useEffect(() => {

    async function load() {

      const res = await fetch(
        "/api/swing-fib/stocks"
      );

      const json = await res.json();

      setStocks(
        json.stocks ?? []
      );

      setLoading(false);

    }

    load();

  }, []);

useEffect(() => {

  const interval = setInterval(async () => {

    const res = await fetch(
      "/api/swing-fib/stocks",
      {
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!json.success) return;

    setStocks(previous =>

      previous.map(stock => {

        const latest = json.stocks.find(
          (item: any) =>
            item.symbol === stock.symbol
        );

        return latest
          ? {
              ...stock,
              liveCmp: latest.liveCmp,
            }
          : stock;

      })

    );

  }, 1000);

  return () => clearInterval(interval);

}, []);


  
const sectorList=[
  "ALL",
  ...Array.from(
    new Set(
      stocks
        .map((x:any)=>x.sector)
        .filter(Boolean)
    )
  ).sort()
];

const filteredStocks=stocks.filter((row:any)=>{

  const matchSearch=
    row.symbol
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchSector=
    sectorFilter==="ALL" ||
    row.sector===sectorFilter;

  return matchSearch && matchSector;

});




if (loading) {

    return (

      <div className="flex h-screen items-center justify-center bg-black text-yellow-300 text-xl">

        Loading Institutional Scanner...

      </div>

    );

  }

  return (

    <div className="h-screen overflow-auto bg-black p-2">

      <div className="sticky top-0 z-[100] mb-3 flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3">

<input
type="text"
placeholder="Search Symbol..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-72 rounded border border-zinc-700 bg-black px-3 py-2 text-cyan-300 placeholder:text-zinc-500 outline-none"
/>

<select
value={sectorFilter}
onChange={(e)=>setSectorFilter(e.target.value)}
className="rounded border border-zinc-700 bg-black px-3 py-2 text-yellow-300"
>
{sectorList.map((sector)=>(
<option key={sector} value={sector}>
{sector}
</option>
))}
</select>

<div className="ml-auto text-sm text-zinc-400">
Showing {filteredStocks.length} / {stocks.length}
</div>

</div>

<table className="min-w-[3600px] border-collapse text-[12px]">

        <thead className="sticky top-0 z-50 bg-black">

<tr className="border-b border-zinc-700">

<th className="sticky left-0 z-50 bg-black px-3 py-2 text-cyan-300 font-bold border border-zinc-800">SYM</th>

<th className="sticky left-32 z-50 bg-black px-3 py-2 text-lime-300 font-bold border border-zinc-800">CMP</th>

<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1W H</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1W HD</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1W L</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1W LD</th>

<th className="px-3 py-2 text-yellow-400 border border-zinc-800">2W H</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">2W HD</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">2W L</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">2W LD</th>

<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1M H</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1M HD</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1M L</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">1M LD</th>

<th className="px-3 py-2 text-yellow-400 border border-zinc-800">3M H</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">3M HD</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">3M L</th>
<th className="px-3 py-2 text-yellow-400 border border-zinc-800">3M LD</th>

<th className="px-3 py-2 bg-green-950 text-green-300 font-bold border border-green-700">23.6</th>
<th className="px-3 py-2 bg-lime-950 text-lime-300 font-bold border border-lime-700">38.2</th>
<th className="px-3 py-2 bg-yellow-950 text-yellow-300 font-bold border border-yellow-700">50</th>
<th className="px-3 py-2 bg-orange-950 text-orange-300 font-bold border border-orange-700">61.8</th>
<th className="px-3 py-2 bg-red-950 text-red-300 font-bold border border-red-700">78.6</th>

<th className="px-3 py-2 text-sky-300 border border-zinc-800">DP</th>
<th className="px-3 py-2 text-sky-300 border border-zinc-800">WP</th>
<th className="px-3 py-2 text-sky-300 border border-zinc-800">MP</th>

<th className="px-3 py-2 text-amber-300 border border-zinc-800">DVOL</th>
<th className="px-3 py-2 text-amber-300 border border-zinc-800">WVOL</th>
<th className="px-3 py-2 text-amber-300 border border-zinc-800">MVOL</th>

<th className="px-3 py-2 text-pink-300 border border-zinc-800">DDEL%</th>

<th className="px-3 py-2 text-green-300 border border-zinc-800">TARGET</th>

<th className="px-3 py-2 text-red-300 border border-zinc-800">SL</th>

</tr>

</thead>

        <tbody>
          {filteredStocks.map((row, index) => (

  <tr
    key={row.symbol}
    className={`border-b border-zinc-800 ${
      index % 2 === 0
        ? "bg-black"
        : "bg-zinc-950"
    } hover:bg-zinc-900`}
  >

    <td className="sticky left-0 z-40 bg-inherit border border-zinc-800 px-3 py-1 text-cyan-300 font-semibold whitespace-nowrap">
      {row.symbol}
    </td>

    <td className="sticky left-32 z-40 bg-inherit border border-zinc-800 px-3 py-1 text-right text-lime-300 font-semibold">
      {num(Number(
  row.liveCmp ??
  row.cmp ??
  0
).toFixed(2))}
    </td>

    {/* ---------- 1 WEEK ---------- */}

    <td className="border border-zinc-800 text-right text-green-400">
      {num(row.oneWeekSwing?.high)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.oneWeekSwing?.highDate)}
    </td>

    <td className="border border-zinc-800 text-right text-red-400">
      {num(row.oneWeekSwing?.low)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.oneWeekSwing?.lowDate)}
    </td>

    

    {/* ---------- 2 WEEK ---------- */}

    <td className="border border-zinc-800 text-right text-green-400">
      {num(row.twoWeekSwing?.high)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.twoWeekSwing?.highDate)}
    </td>

    <td className="border border-zinc-800 text-right text-red-400">
      {num(row.twoWeekSwing?.low)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.twoWeekSwing?.lowDate)}
    </td>

    

    {/* ---------- 1 MONTH ---------- */}

    <td className="border border-zinc-800 text-right text-green-400">
      {num(row.oneMonthSwing?.high)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.oneMonthSwing?.highDate)}
    </td>

    <td className="border border-zinc-800 text-right text-red-400">
      {num(row.oneMonthSwing?.low)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.oneMonthSwing?.lowDate)}
    </td>

    

    {/* ---------- 3 MONTH ---------- */}

    <td className="border border-zinc-800 text-right text-green-400">
      {num(row.threeMonthSwing?.high)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.threeMonthSwing?.highDate)}
    </td>

    <td className="border border-zinc-800 text-right text-red-400">
      {num(row.threeMonthSwing?.low)}
    </td>

    <td className="border border-zinc-800 text-center text-sky-300">
      {dt(row.threeMonthSwing?.lowDate)}
    </td>

    

    {/* ---------- FIB ---------- */}

    <td className="border border-green-700 bg-green-950 text-right text-green-300 font-semibold">{num(row.oneWeekFib?.fib236)}</td>

    <td className="border border-lime-700 bg-lime-950 text-right text-lime-300 font-semibold">{num(row.oneWeekFib?.fib382)}</td>

    <td className="border border-yellow-700 bg-yellow-950 text-right text-yellow-300 font-semibold">{num(row.oneWeekFib?.fib50)}</td>

    <td className="border border-orange-700 bg-orange-950 text-right text-orange-300 font-semibold">{num(row.oneWeekFib?.fib618)}</td>

    <td className="border border-red-700 bg-red-950 text-right text-red-300 font-semibold">{num(row.oneWeekFib?.fib786)}</td>

    {/* ---------- PIVOTS ---------- */}

    <td className="border border-zinc-800 text-right text-sky-300">
      {num(row.dailyPivot?.pivot)}
    </td>

    <td className="border border-zinc-800 text-right text-sky-300">
      {num(row.weeklyPivot?.pivot)}
    </td>

    <td className="border border-zinc-800 text-right text-sky-300">
      {num(row.monthlyPivot?.pivot)}
    </td>
        {/* ---------- VOLUME ---------- */}

    <td className="border border-zinc-800 text-right text-amber-300">
      {num(row.volume?.daily)}
    </td>

    <td className="border border-zinc-800 text-right text-amber-300">
      {num(row.volume?.weekly)}
    </td>

    <td className="border border-zinc-800 text-right text-amber-300">
      {num(row.volume?.monthly)}
    </td>

    {/* ---------- DELIVERY ---------- */}

    <td className="border border-zinc-800 text-right text-pink-300 font-semibold">
      {num(row.deliveryPercent)}
    </td>

    {/* ---------- TREND ---------- */}

    <td
  className={`border border-zinc-800 text-center font-bold ${
    row.trend?.phase === "UPTREND" ||
    row.trend?.phase === "Uptrend"
      ? "text-green-400"
      : row.trend?.phase === "DOWNTREND" ||
        row.trend?.phase === "Downtrend"
      ? "text-red-400"
      : "text-yellow-300"
  }`}
>
  {row.trend?.phase ?? "-"}
</td>

    {/* ---------- MARKET STATE ---------- */}

    <td
      className={`border border-zinc-800 text-center font-semibold ${
        row.marketState === "Accumulation"
          ? "text-cyan-300"
          : row.marketState === "Re-Accumulation"
          ? "text-green-300"
          : row.marketState === "Distribution"
          ? "text-red-300"
          : row.marketState === "Re-Distribution"
          ? "text-orange-300"
          : row.marketState === "Expansion"
          ? "text-violet-300"
          : "text-zinc-300"
      }`}
    >
      {typeof row.marketState === "object" ? (row.marketState?.phase ?? row.marketState?.state ?? "-") : (row.marketState ?? "-")}
    </td>

    {/* ---------- TARGET ---------- */}

    <td className="border border-zinc-800 text-right text-green-300 font-bold">
      {num(row.target)}
    </td>

    {/* ---------- STOP LOSS ---------- */}

    <td className="border border-zinc-800 text-right text-red-300 font-bold">
      {num(row.stopLoss)}
    </td>

  </tr>

))}

</tbody>

</table>

</div>

);
}



























