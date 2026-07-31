export function getPivotBias(cmp:number,p:any){
  if(!p) return "NEUTRAL";
  if(cmp>=p.r2) return "STRONG_BULLISH";
  if(cmp>=p.pivot) return "BULLISH";
  if(cmp<=p.s2) return "STRONG_BEARISH";
  if(cmp<p.pivot) return "BEARISH";
  return "NEUTRAL";
}

