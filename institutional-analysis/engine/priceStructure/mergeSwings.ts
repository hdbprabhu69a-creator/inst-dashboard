import { SwingPoint } from "../../models/priceStructureTypes";

export function mergeSwings(

  swingHighs: SwingPoint[],

  swingLows: SwingPoint[]

): SwingPoint[] {

  const merged = [

    ...swingHighs,

    ...swingLows

  ];

  merged.sort((a,b)=>{

    if(a.index!==b.index){

      return a.index-b.index;

    }

    if(a.type==="LOW" && b.type==="HIGH"){

      return -1;

    }

    return 1;

  });

  return merged;

}

