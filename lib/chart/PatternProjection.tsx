"use client";

type Props={

price:number;

target:number;

};

export default function PatternProjection({

price,

target,

}:Props){

const direction=

target>price

?"Bullish"

:"Bearish";

return(

<div
className="
rounded-lg
border
border-zinc-700
bg-[#131722]
px-3
py-2
">

<div className="text-xs text-zinc-500">

Projection

</div>

<div className="font-semibold text-cyan-400">

{direction}

</div>

</div>

);

}

