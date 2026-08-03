"use client";

import { Stock } from "./types";

interface Props{
  row:Stock;
  swingFilter:string;
  num:(v:any)=>string;
}

export default function FibCells({
  row,
  swingFilter,
  num,
}:Props){

const fib=

swingFilter==="2W"
?row.twoWeekFib

:swingFilter==="1M"
?row.oneMonthFib

:swingFilter==="3M"
?row.threeMonthFib

:swingFilter==="6M"
?row.sixMonthFib

:swingFilter==="1Y"
?row.oneYearFib

:row.oneWeekFib;

return(

<>

<td className="border-l-2 border-l-zinc-600 border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap font-medium text-green-400">
{num(fib?.fib236)}
</td>

<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap font-medium text-lime-400">
{num(fib?.fib382)}
</td>

<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap font-medium text-yellow-400">
{num(fib?.fib50)}
</td>

<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap font-medium text-orange-400">
{num(fib?.fib618)}
</td>

<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap font-medium text-red-400">
{num(fib?.fib786)}
</td>

</>

);

}


