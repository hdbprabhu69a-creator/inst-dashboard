"use client";

import PatternMarker from "./PatternMarker";

export type CanvasLabel={

text:string;

x:number;

y:number;

color?:string;

};

type Props={

labels:CanvasLabel[];

};

export default function PatternCanvas({

labels,

}:Props){

return(

<div

className="
absolute
inset-0
pointer-events-none
"

>

{labels.map(

l=>(

<PatternMarker

key={

l.text+

l.x+

l.y

}

x={l.x}

y={l.y}

label={l.text}

color={l.color}

/>

)

)}

</div>

);

}
