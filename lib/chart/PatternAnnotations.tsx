"use client";

import PatternCanvas,{
CanvasLabel,
} from "./PatternCanvas";

type Props={

labels:CanvasLabel[];

};

export default function PatternAnnotations({

labels,

}:Props){

return(

<PatternCanvas

labels={labels}

/>

);

}
