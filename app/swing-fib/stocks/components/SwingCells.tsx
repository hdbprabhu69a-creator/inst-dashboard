"use client";

import { Stock } from "./types";

interface Props{
  row:Stock;
  swingFilter:string;
  num:(v:any)=>string;
  dt:(v:any)=>string;
}

export default function SwingCells({
  row,
  swingFilter,
  num,
  dt,
}:Props){

const show=(v:string)=>
swingFilter==="ALL"||
swingFilter===v;

return(
<>

{show("1W")&&(
<>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-green-400">{num(row.oneWeekSwing?.high)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.oneWeekSwing?.highDate)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-red-400">{num(row.oneWeekSwing?.low)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.oneWeekSwing?.lowDate)}</td>
</>
)}

{show("2W")&&(
<>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-green-400">{num(row.twoWeekSwing?.high)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.twoWeekSwing?.highDate)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-red-400">{num(row.twoWeekSwing?.low)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.twoWeekSwing?.lowDate)}</td>
</>
)}

{show("1M")&&(
<>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-green-400">{num(row.oneMonthSwing?.high)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.oneMonthSwing?.highDate)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-red-400">{num(row.oneMonthSwing?.low)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.oneMonthSwing?.lowDate)}</td>
</>
)}

{show("3M")&&(
<>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-green-400">{num(row.threeMonthSwing?.high)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.threeMonthSwing?.highDate)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-red-400">{num(row.threeMonthSwing?.low)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.threeMonthSwing?.lowDate)}</td>
</>
)}

{show("6M")&&(
<>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-green-400">{num(row.sixMonthSwing?.high)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.sixMonthSwing?.highDate)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-red-400">{num(row.sixMonthSwing?.low)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.sixMonthSwing?.lowDate)}</td>
</>
)}

{show("1Y")&&(
<>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-green-400">{num(row.oneYearSwing?.high)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.oneYearSwing?.highDate)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-red-400">{num(row.oneYearSwing?.low)}</td>
<td className="border border-zinc-800 px-0.5 py-0.5 text-center whitespace-nowrap text-sky-300">{dt(row.oneYearSwing?.lowDate)}</td>
</>
)}

</>
);

}

