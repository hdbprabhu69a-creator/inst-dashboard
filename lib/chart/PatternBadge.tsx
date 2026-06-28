"use client";

type Props={

title:string;

value:string|number;

color?:string;

};

export default function PatternBadge({

title,

value,

color="#22c55e",

}:Props){

return(

<div

className="rounded-lg border border-zinc-700 bg-[#131722] px-3 py-2 shadow"

>

<div className="text-[10px] text-zinc-500">

{title}

</div>

<div

style={{color}}

className="font-bold"

>

{value}

</div>

</div>

);

}
