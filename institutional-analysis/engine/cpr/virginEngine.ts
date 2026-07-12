export function getVirginCPR(
  high:number,
  low:number,
  bc:number,
  tc:number
){

  return high<bc || low>tc;

}
