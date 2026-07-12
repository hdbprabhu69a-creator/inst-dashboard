export function getPivotAlignment(d:string,w:string,m:string){

  const bull=["PVT+","R1","R2","R3+"];
  const bear=["PVT-","S1","S2","S3-"];

  const b=[d,w,m].filter(x=>bull.includes(x)).length;
  const s=[d,w,m].filter(x=>bear.includes(x)).length;

  if(b===3) return "TRIPLE_BULL";
  if(s===3) return "TRIPLE_BEAR";
  if(b===2) return "DOUBLE_BULL";
  if(s===2) return "DOUBLE_BEAR";

  return "MIXED";

}
