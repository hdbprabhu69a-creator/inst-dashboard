"use client";

import { Stock } from "./types";

interface Props{
  row:Stock;
  num:(v:any)=>string;
}

export default function VolumeCells({
  row,
  num,
}:Props){

return(

<>

<td className="border border-amber-800 text-center text-amber-300">
{num(row.volume?.daily)}
</td>

<td className="border border-amber-800 text-center text-amber-300">
{num(row.volume?.weekly)}
</td>

<td className="border border-amber-800 text-center text-amber-300">
{num(row.volume?.monthly)}
</td>

<td className="border border-pink-800 text-center text-pink-300">
{num(row.deliveryPercent)}
</td>

<td className="border border-zinc-700 text-center text-green-300">
{row.trend?.phase ?? "-"}
</td>

<td className="border border-zinc-700 text-center text-violet-300">
{row.marketState ?? "-"}
</td>

<td className="border border-green-700 bg-green-950/20 text-center font-semibold text-green-300">
{num(row.target)}
</td>

<td className="border border-red-700 bg-red-950/20 text-center font-semibold text-red-300">
{num(row.stopLoss)}
</td>

</>

);

}
