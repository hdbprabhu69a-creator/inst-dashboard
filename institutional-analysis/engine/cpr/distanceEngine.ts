export interface CPRDistanceResult{
  bc:number;
  tc:number;
  pivot:number;
  r1:number;
  r2:number;
  r3:number;
  s1:number;
  s2:number;
  s3:number;
  nearestLevel:string;
  nearestDistance:number;
}

export function getCPRDistance(
  price:number,
  bc:number,
  tc:number,
  pivot:number,
  r1:number,
  r2:number,
  r3:number,
  s1:number,
  s2:number,
  s3:number
):CPRDistanceResult{

  const levels=[
    {name:"BC",value:bc},
    {name:"TC",value:tc},
    {name:"PIVOT",value:pivot},
    {name:"R1",value:r1},
    {name:"R2",value:r2},
    {name:"R3",value:r3},
    {name:"S1",value:s1},
    {name:"S2",value:s2},
    {name:"S3",value:s3}
  ];

  let nearestLevel="";
  let nearestDistance=Number.MAX_VALUE;

  for(const level of levels){

    const distance=+(price-level.value).toFixed(2);

    if(Math.abs(distance)<Math.abs(nearestDistance)){
      nearestDistance=distance;
      nearestLevel=level.name;
    }

  }

  return{
    bc:+(price-bc).toFixed(2),
    tc:+(price-tc).toFixed(2),
    pivot:+(price-pivot).toFixed(2),
    r1:+(price-r1).toFixed(2),
    r2:+(price-r2).toFixed(2),
    r3:+(price-r3).toFixed(2),
    s1:+(price-s1).toFixed(2),
    s2:+(price-s2).toFixed(2),
    s3:+(price-s3).toFixed(2),
    nearestLevel,
    nearestDistance
  };

}
