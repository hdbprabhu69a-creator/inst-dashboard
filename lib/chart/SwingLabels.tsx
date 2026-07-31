"use client";

type SwingLabel={

label:string;

x:number;

y:number;

color:string;

};

type Props={

labels:SwingLabel[];

};

export default function SwingLabels({

labels,

}:Props){

return(

<>

{labels.map(label=>(

<div

key={

label.label+

label.x+

label.y

}

className="
absolute
pointer-events-none
-translate-x-1/2
-translate-y-1/2
rounded-md
px-2
py-1
text-[10px]
font-bold
text-white
shadow-xl
"

style={{

left:label.x,

top:label.y,

background:label.color,

}}

>

{label.label}

</div>

))}

</>

);

}

