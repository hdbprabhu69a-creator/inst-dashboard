"use client";

export default function PatternToolbar(){

const tools=[

"Trend",

"Fib",

"Channel",

"Triangle",

"H&S",

"DT",

"DB",

"Flag",

"Wedge",

"Cup"

];

return(

<div
className="
absolute
left-4
bottom-4
flex
gap-2
flex-wrap
">

{tools.map(tool=>(

<button

key={tool}

className="
rounded
border
border-zinc-700
bg-[#131722]
px-3
py-1
text-xs
text-zinc-300
hover:bg-zinc-800
"

>

{tool}

</button>

))}

</div>

);

}

