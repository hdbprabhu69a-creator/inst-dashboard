"use client";

import { useEffect, useMemo, useState } from "react";

import Toolbar from "./components/Toolbar";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";

import { Stock } from "./components/types";

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
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
      }
    );

  }

  if (value.toDate) {

    return value
      .toDate()
      .toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      );

  }

  return new Date(value)
    .toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
      }
    );

}

export default function SwingFibPage() {

  const [stocks,setStocks]=
    useState<Stock[]>([]);

  const [loading,setLoading]=
    useState(true);

  const [search,setSearch]=
    useState("");

  const [sectorFilter,setSectorFilter]=
    useState("ALL");

  const [swingFilter,setSwingFilter]=
  useState("ALL");

const [volPeriod,setVolPeriod]=
useState("1W");

const [historyMap,setHistoryMap]=
useState<Record<string,any[]>>({});

const [headerDates,setHeaderDates]=
useState<string[]>([]);

  async function load(){

    try{

      const res=
        await fetch(
          "/api/swing-fib/stocks",
          {
            cache:"no-store",
          }
        );

      const json=
        await res.json();

      setStocks(

json.stocks ??

json.data ??

[]

);

const deliveryRes=
await fetch("/api/delivery-history");

const deliveryJson=
await deliveryRes.json();

const deliveryMap=
new Map<string,number>();

for(const d of (deliveryJson.data??[])){

deliveryMap.set(

`${d.symbol}_${d.date}`,

Number(d.deliveryQty??0)

);

}

const historyRes=

await fetch("/api/history-bulk");

const historyJson=

await historyRes.json();

const history:Record<string,any[]>={};

for(const stock of (json.stocks??json.data??[])){

const rows=(historyJson[stock.symbol]??[])

.slice(

volPeriod==="1W"

? -5

: volPeriod==="2W"

? -10

: -22

)

.reverse()

.map((c:any)=>({

...c,

deliveryQty:

deliveryMap.get(

`${stock.symbol}_${c.time}`

) ?? 0,

}));

history[stock.symbol]=rows;

}

setHistoryMap(history);

const first=

Object.values(history)[0]??[];

setHeaderDates(

first.map((x:any)=>

new Date(x.time)

.toLocaleDateString(

"en-GB",

{

day:"2-digit",

month:"short",

}

)

)

);

    }

    finally{

      setLoading(false);

    }

  }

  useEffect(()=>{

    load();

    const timer=
      setInterval(
        load,
        5000
      );

    return ()=>clearInterval(timer);

  },[volPeriod]);

  const sectorList=
    useMemo(

      ()=>[
        "ALL",

        ...Array.from(

          new Set(

            stocks
              .map(x=>x.sector)
              .filter(Boolean)

          )

        ).sort(),

      ],

      [stocks]

    );

  const filteredStocks=
    useMemo(()=>{

      return stocks.filter(stock=>{

        if(

          !stock.symbol

            .toLowerCase()

            .includes(

              search.toLowerCase()

            )

        )

          return false;

        if(

          sectorFilter!=="ALL" &&

          stock.sector!==sectorFilter

        )

          return false;

        return true;

      });

    },

    [

      stocks,

      search,

      sectorFilter,

    ]);

  if(loading){

    return(

      <div className="flex h-screen items-center justify-center bg-black text-cyan-300 text-xl font-bold">

        Loading Swing Dashboard...

      </div>

    );

  }
    return (

<div className="min-h-screen bg-black px-2 pt-1 pb-2 text-[10px] text-white">

<Toolbar

search={search}
setSearch={setSearch}

sectorFilter={sectorFilter}
setSectorFilter={setSectorFilter}

sectorList={sectorList}

swingFilter={swingFilter}
setSwingFilter={setSwingFilter}

volPeriod={volPeriod}
setVolPeriod={setVolPeriod}

filtered={filteredStocks.length}
total={stocks.length}

/>

<div className="overflow-auto rounded-lg border border-zinc-800">

<table className="w-full table-fixed border-collapse text-[10px]">

<TableHeader

swingFilter={swingFilter}
volPeriod={volPeriod}
headerDates={headerDates}
/>

<tbody>

{filteredStocks.map(

(row,index)=>(

<TableRow

key={row.symbol}

row={row}

index={index}

swingFilter={swingFilter}
volPeriod={volPeriod}
history={historyMap[row.symbol]??[]}
num={num}

dt={dt}

/>

)

)}

</tbody>

</table>

</div>

</div>

);

}









