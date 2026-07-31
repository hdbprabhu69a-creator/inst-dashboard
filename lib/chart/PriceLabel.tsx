"use client";

type Props={

price:number;

text:string;

color?:string;

right?:number;

top?:number;

};

export default function PriceLabel({

price,

text,

color="#2563eb",

right=12,

top=0,

}:Props){

return(

<div

className="
absolute
rounded-md
px-2
py-1
text-[11px]
font-semibold
shadow-lg
text-white
pointer-events-none
"

style={{

right,

top,

background:color,

}}

>

{text}

<br/>

? {price.toFixed(2)}

</div>

);

}

