export function getPivotScore(
  d:string,
  w:string,
  m:string,
  a:string
){

  const pts:any={

    "R3+":30,
    "R2":27,
    "R1":24,
    "PVT+":20,
    "PVT-":15,
    "S1":10,
    "S2":5,
    "S3-":0

  };

  let score=
    (pts[d]??0)+
    (pts[w]??0)+
    (pts[m]??0);

  if(a==="TRIPLE_BULL") score+=10;
  else if(a==="DOUBLE_BULL") score+=7;
  else if(a==="MIXED") score+=5;
  else if(a==="DOUBLE_BEAR") score+=2;
  else if(a==="TRIPLE_BEAR") score+=0;

  if(score>100) score=100;
  if(score<0) score=0;

  return score;

}
