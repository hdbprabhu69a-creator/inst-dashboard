"use client";

type Props={

price:number;

};

export default function PatternTarget({

price,

}:Props){

return(

<div
className="
rounded-lg
border
border-blue-700
bg-[#101826]
px-3
py-2
">

<div className="text-[10px] text-zinc-500">

TARGET

</div>

<div className="font-bold text-blue-400">

? {price.toFixed(2)}

</div>

</div>

);

}

