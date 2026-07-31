"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { STOCK_UNIVERSE } from "@/lib/universe";

const symbols: string[] = STOCK_UNIVERSE;

interface Candle {
  time: string;
  volume: number;
  deliveryQty?: number;
}


function formatVolume(value: number) {

  if (value >= 1000000000)
    return (value / 1000000000).toFixed(2) + "B";

  if (value >= 1000000)
    return (value / 1000000).toFixed(2) + "M";

  if (value >= 1000)
    return (value / 1000).toFixed(1) + "K";

  return value.toString();

}

function formatDelivery(value?: number) {

  if (value == null || isNaN(value))
    return "";

  if (value >= 1000000000)
    return (value / 1000000000).toFixed(2) + "B";

  if (value >= 1000000)
    return (value / 1000000).toFixed(2) + "M";

  if (value >= 1000)
    return (value / 1000).toFixed(1) + "K";

  return value.toFixed(0);

}


export default function VolumeDeliveryPage() {

  const [data, setData] = useState<Record<string, Candle[]>>({});
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [sectorMap, setSectorMap] = useState<Record<string,string>>({});
const [fromDate,setFromDate]=useState("");
const [toDate,setToDate]=useState("");
const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      const result: Record<string, Candle[]> = {};

      const deliveryRes = await fetch("/api/delivery-history");
      const deliveryJson = await deliveryRes.json();

      const deliveryMap = new Map<string, number>();

      for (const row of (deliveryJson.data ?? [])) {
        deliveryMap.set(
          `${row.symbol}_${row.date}`,
          Number(row.deliveryQty ?? 0)
        );
      }

      const stockRes = await fetch("/api/swing-fib/stocks");
      const stockJson = await stockRes.json();

      const sectors: Record<string,string> = {};

      (stockJson.stocks ?? []).forEach((row:any)=>{

        sectors[row.symbol] = row.sector ?? "";

      });

      setSectorMap(sectors);

      await Promise.allSettled(

        symbols.map(async (symbol) => {

          try {

            const res = await fetch(
              `/api/history?symbol=${encodeURIComponent(symbol)}`
            );

            if (!res.ok)
              throw new Error(symbol);

            const json = await res.json();

            result[symbol] =
              Array.isArray(json)
                ? json
                    .slice(-30)
                    .reverse()
                    .map((c:any)=>({
                      ...c,
                      deliveryQty:
                        deliveryMap.get(`${symbol}_${c.time}`) ?? 0,
                    }))
                : [];

          } catch {

            result[symbol] = [];

          }

        })

      );

      setData(result);
      setLoading(false);

    }

    load();

  }, []);

  const sectorList = useMemo(() => [

    "ALL",

    ...Array.from(
      new Set(
        Object.values(sectorMap).filter(Boolean)
      )
    ).sort()

  ], [sectorMap]);

  const stocks = useMemo(() => {

    return symbols.filter(symbol=>{

      const matchSearch =
        symbol.toLowerCase().includes(
          search.toLowerCase()
        );

      const matchSector =
        sectorFilter==="ALL" ||
        sectorMap[symbol]===sectorFilter;

      return matchSearch && matchSector;

    });

  }, [search,sectorFilter,sectorMap]);

  const dates = useMemo(() => {

    for (const symbol of stocks) {

      const candles=data[symbol];

      if(candles?.length){

        return candles
          .map(c=>c.time)
          .filter(date=>{

            if(fromDate && date<fromDate)
              return false;

            if(toDate && date>toDate)
              return false;

            return true;

          });

      }

    }

    return [];

  },[stocks,data,fromDate,toDate]);

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Universe Volume & Delivery
      </h1>

      <div className="mb-6 flex items-center gap-4">

        <input
          className="border rounded px-3 py-2 w-72"
          placeholder="Search Stock..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select
          value={sectorFilter}
          onChange={(e)=>setSectorFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {sectorList.map((sector)=>(
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>

<input
type="date"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
className="border rounded px-3 py-2"
/>

<input
type="date"
value={toDate}
onChange={(e)=>setToDate(e.target.value)}
className="border rounded px-3 py-2"
/>

<div className="ml-auto text-sm text-gray-600">
          Showing {stocks.length} / {symbols.length}
        </div>

      </div>

      {loading ? (

        <div className="text-center py-20">
          Loading...
        </div>

      ) : dates.length === 0 ? (

        <div className="text-center py-20 text-red-600">
          No history data found.
        </div>

      ) : (

        <div className="overflow-auto border rounded">

          <table className="min-w-max border-collapse">

            <thead>

              <tr className="bg-slate-800 text-white">

                <th className="sticky left-0 bg-slate-800 border p-2">
                  Stock
                </th>

                <th className="sticky left-[170px] bg-slate-800 border p-2">
                  Type
                </th>

                {dates.map((d) => (

                  <th
                    key={d}
                    className="border p-2 whitespace-nowrap"
                  >
                    {d}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {stocks.map((symbol) => (

                <Fragment key={symbol}>

                  <tr>

                    <td
                      rowSpan={2}
                      className="sticky left-0 bg-white border p-2 font-bold"
                    >
                      {symbol}
                    </td>

                    <td className="sticky left-[170px] bg-white border p-2">
                      Volume
                    </td>

                    {(data[symbol] ?? [])
.filter(c=>{

if(fromDate && c.time<fromDate) return false;
if(toDate && c.time>toDate) return false;

return true;

})
.map((c) => (

                      <td
                        key={c.time}
                        className="border p-2 text-right"
                      >
                        {formatVolume(c.volume)}
                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td className="sticky left-[170px] bg-white border p-2">
                      Delivery
                    </td>

                    {(data[symbol] ?? [])
.filter(c=>{

if(fromDate && c.time<fromDate) return false;
if(toDate && c.time>toDate) return false;

return true;

})
.map((c) => (

                      <td
                        key={c.time}
                        className="border p-2 text-center"
                      >
                        {formatDelivery(c.deliveryQty)}
                      </td>

                    ))}

                  </tr>

                </Fragment>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}





