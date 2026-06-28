"use client";

type Props={

x:number;

y:number;

label:string;

color?:string;

};

export default function PatternMarker({

x,

y,

label,

color="#2563eb",

}:Props){

return(

<div

className="
absolute
pointer-events-none
-translate-x-1/2
-translate-y-1/2
"

style={{

left:x,

top:y,

}}

>

<div

className="
w-7
h-7
rounded-full
flex
items-center
justify-center
text-[11px]
font-bold
text-white
shadow-xl
"

style={{

background:color,

}}

>

{label}

</div>

</div>

);

}
