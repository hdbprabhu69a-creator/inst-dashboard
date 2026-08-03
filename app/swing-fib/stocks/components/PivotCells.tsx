"use client";

import { Stock } from "./types";

interface Props{
row:Stock;
swingFilter:string;
num:(v:any)=>string;
}

export default function PivotCells({
row,
swingFilter,
num,
}:Props){

if(swingFilter==="PIVOT"){

return(

<>

<td className="border border-red-900 text-center text-red-500">{num(row.dailyPivot?.s3)}</td>
<td className="border border-red-800 text-center text-red-400">{num(row.dailyPivot?.s2)}</td>
<td className="border border-orange-700 text-center text-orange-300">{num(row.dailyPivot?.s1)}</td>
<td className="border border-cyan-700 bg-cyan-950/20 text-center font-bold text-cyan-300">{num(row.dailyPivot?.pivot)}</td>
<td className="border border-green-700 text-center text-green-300">{num(row.dailyPivot?.r1)}</td>
<td className="border border-green-800 text-center text-green-400">{num(row.dailyPivot?.r2)}</td>
<td className="border border-green-900 text-center text-green-500">{num(row.dailyPivot?.r3)}</td>

<td className="border-l-2 border-l-zinc-600 border border-red-900 text-center text-red-500">{num(row.weeklyPivot?.s3)}</td>
<td className="border border-red-800 text-center text-red-400">{num(row.weeklyPivot?.s2)}</td>
<td className="border border-orange-700 text-center text-orange-300">{num(row.weeklyPivot?.s1)}</td>
<td className="border border-cyan-700 bg-cyan-950/20 text-center font-bold text-cyan-300">{num(row.weeklyPivot?.pivot)}</td>
<td className="border border-green-700 text-center text-green-300">{num(row.weeklyPivot?.r1)}</td>
<td className="border border-green-800 text-center text-green-400">{num(row.weeklyPivot?.r2)}</td>
<td className="border border-green-900 text-center text-green-500">{num(row.weeklyPivot?.r3)}</td>

<td className="border-l-2 border-l-zinc-600 border border-red-900 text-center text-red-500">{num(row.monthlyPivot?.s3)}</td>
<td className="border border-red-800 text-center text-red-400">{num(row.monthlyPivot?.s2)}</td>
<td className="border border-orange-700 text-center text-orange-300">{num(row.monthlyPivot?.s1)}</td>
<td className="border border-cyan-700 bg-cyan-950/20 text-center font-bold text-cyan-300">{num(row.monthlyPivot?.pivot)}</td>
<td className="border border-green-700 text-center text-green-300">{num(row.monthlyPivot?.r1)}</td>
<td className="border border-green-800 text-center text-green-400">{num(row.monthlyPivot?.r2)}</td>
<td className="border border-green-900 text-center text-green-500">{num(row.monthlyPivot?.r3)}</td>

</>

);

}

return(

<>

<td className="border border-cyan-800 text-center text-cyan-300">
{num(row.dailyPivot?.pivot)}
</td>

<td className="border border-cyan-800 text-center text-cyan-300">
{num(row.weeklyPivot?.pivot)}
</td>

<td className="border border-cyan-800 text-center text-cyan-300">
{num(row.monthlyPivot?.pivot)}
</td>

</>

);

}

