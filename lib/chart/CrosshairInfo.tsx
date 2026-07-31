"use client";

type Props={

open:number;

high:number;

low:number;

close:number;

volume:number;

};

export default function CrosshairInfo({

open,

high,

low,

close,

volume,

}:Props){

const green=

close>=open;

return(

<div

className="
absolute
left-4
top-16
rounded-xl
border
border-zinc-700
bg-[#131722ee]
backdrop-blur
px-4
py-3
shadow-2xl
text-xs
space-y-1
min-w-[170px]
"

>

<div className="text-zinc-500">

CROSSHAIR

</div>

<div className={green?"text-green-400":"text-red-400"}>

O {open.toFixed(2)}

</div>

<div className="text-green-400">

H {high.toFixed(2)}

</div>

<div className="text-red-400">

L {low.toFixed(2)}

</div>

<div className="text-white">

C {close.toFixed(2)}

</div>

<div className="text-zinc-400">

VOL {volume.toLocaleString()}

</div>

</div>

);

}

