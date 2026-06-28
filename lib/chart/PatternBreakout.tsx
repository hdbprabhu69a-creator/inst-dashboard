"use client";

type Props={

price:number;

};

export default function PatternBreakout({

price,

}:Props){

return(

<div
className="
rounded-lg
border
border-green-700
bg-[#102015]
px-3
py-2
">

<div className="text-[10px] text-zinc-500">

BREAKOUT

</div>

<div className="font-bold text-green-400">

? {price.toFixed(2)}

</div>

</div>

);

}
