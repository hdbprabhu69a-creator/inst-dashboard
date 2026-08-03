"use client";

import { Fragment } from "react";
import { Stock } from "./types";

interface Props{
  row:Stock;
  history:any[];
  index:number;
  num:(v:any)=>string;
}

function fmt(v:any){

  if(v==null||isNaN(v))
    return "-";

  const n=Number(v);

  if(n>=10000000)
    return (n/10000000).toFixed(2)+"Cr";

  if(n>=100000)
    return (n/100000).toFixed(2)+"L";

  if(n>=1000)
    return (n/1000).toFixed(1)+"K";

  return n.toFixed(0);

}

export default function VolumeDeliveryRows({
  row,
  history,
  index,
  num,
}:Props){

  return(

<Fragment>

<tr className={index%2===0?"bg-black":"bg-zinc-950"}>

<td
rowSpan={2}
className="sticky left-0 z-40 border border-zinc-800 bg-inherit px-0.5 py-0.5 text-center font-bold text-cyan-300 whitespace-nowrap"
>
{row.symbol}
</td>

<td
rowSpan={2}
className="sticky left-[80px] z-40 border border-zinc-800 bg-inherit px-0.5 py-0.5 text-center font-bold text-lime-300 whitespace-nowrap"
>
{num(row.liveCmp??row.cmp)}
</td>

<td className="border border-zinc-800 px-0.5 py-0.5 text-center font-bold text-cyan-300 whitespace-nowrap">
Volume
</td>

{history.map((c:any,i:number)=>{

const prev=i<history.length-1
?history[i+1]
:null;

const up=prev
?c.volume>prev.volume
:false;

return(

<td
key={"v"+i}
className={`border border-zinc-800 px-0.5 py-0.5 text-right whitespace-nowrap ${up?"text-lime-300":"text-red-300"}`}
>
{fmt(c.volume)}
</td>

);

})}

</tr>

<tr className={index%2===0?"bg-black":"bg-zinc-950"}>

<td className="border border-zinc-800 px-0.5 py-0.5 text-center font-bold text-yellow-300 whitespace-nowrap">
Delivery
</td>

{history.map((c:any,i:number)=>{

const prev=i<history.length-1
?history[i+1]
:null;

const up=prev
?c.volume>prev.volume
:false;

return(

<td
key={"d"+i}
className={`border border-zinc-800 px-0.5 py-0.5 text-right whitespace-nowrap ${up?"text-lime-300":"text-red-300"}`}
>
{fmt(c.deliveryQty)}
</td>

);

})}

</tr>

</Fragment>

);

}

