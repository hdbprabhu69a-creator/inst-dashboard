"use client";

export type SwingMarker={

label:string;

x:number;

y:number;

visible:boolean;

};

type Props={

markers:SwingMarker[];

};

const COLORS={

HH:"#16a34a",

HL:"#22c55e",

LH:"#f59e0b",

LL:"#dc2626",

};

const SYMBOLS={

HH:"?",

HL:"?",

LH:"?",

LL:"?",

};

export default function SwingOverlay({

markers,

}:Props){

return(

<>

{markers

.filter(

m=>m.visible

)

.map(marker=>(

<div

key={

marker.label+

marker.x+

marker.y

}

className="
absolute
pointer-events-none
select-none
-translate-x-1/2
-translate-y-1/2
flex
flex-col
items-center
gap-1
"

style={{

left:marker.x,

top:marker.y,

}}

>

<div

style={{

color:

COLORS[

marker.label as keyof typeof COLORS

]??

"#ffffff",

}}

className="
text-lg
leading-none
font-bold
drop-shadow
"

>

{

SYMBOLS[

marker.label as keyof typeof SYMBOLS

]??

"?"

}

</div>

<div

className="
rounded
px-2
py-[2px]
text-[10px]
font-bold
text-white
shadow-xl
"

style={{

background:

COLORS[

marker.label as keyof typeof COLORS

]??

"#2563eb",

}}

>

{marker.label}

</div>

</div>

))}

</>

);

}

