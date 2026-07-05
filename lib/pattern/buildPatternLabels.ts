import { PatternResult } from "./types";
import { getPatternMetadata } from "./patternMetadata";

export type PatternLabel = {

  text:string;

  x:number;

  y:number;

  color?:string;

};

export function buildPatternLabels(

  pattern:PatternResult | null

):PatternLabel[]{

  if(!pattern)
    return [];

  const meta = getPatternMetadata(pattern.pattern);

  const labels:PatternLabel[]=[];

  // Pattern Title
  labels.push({

    text:meta.title,

    x:50,

    y:18,

    color:"#f3f4f6",

  });

  // Trend Line Labels
  pattern.trendLines.forEach((line,index)=>{

    const midX=50;

    const midY=42+(index*16);

    labels.push({

      text:
        meta.lineLabels[index] ??
        ("Line "+(index+1)),

      x:midX,

      y:midY,

      color:"#FFD54F",

    });

  });

  return labels;

}
