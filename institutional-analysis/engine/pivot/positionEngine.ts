export function getPivotPosition(cmp:number,p:any){
  if(!p)return "-";
  if(cmp>=p.r3)return "R3+";
  if(cmp>=p.r2)return "R2";
  if(cmp>=p.r1)return "R1";
  if(cmp>=p.pivot)return "PVT+";
  if(cmp>=p.s1)return "PVT-";
  if(cmp>=p.s2)return "S1";
  if(cmp>=p.s3)return "S2";
  return "S3-";
}

