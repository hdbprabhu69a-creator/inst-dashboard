"use client";

type Label={

text:string;

x:number;

y:number;

color?:string;

};

type Props={

labels:Label[];

};

export default function PatternLabels({

labels,

}:Props){

return(

<>

{labels.map(label=>(

<div

key={label.text+label.x}

className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center shadow-lg pointer-events-none"

style={{

left:label.x,

top:label.y,

background:label.color??"#2563eb",

}}

>

{label.text}

</div>

))}

</>

);

}
