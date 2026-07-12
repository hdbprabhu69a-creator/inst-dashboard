export type CPRRelationship=
  | "HIGHER"
  | "LOWER"
  | "OVERLAP_HIGHER"
  | "OVERLAP_LOWER"
  | "INSIDE"
  | "OUTSIDE"
  | "UNCHANGED";

export function getCPRRelationship(
  todayBC:number,
  todayTC:number,
  prevBC:number,
  prevTC:number
):CPRRelationship{

  if(todayBC===prevBC && todayTC===prevTC)
    return "UNCHANGED";

  if(todayBC>prevTC)
    return "HIGHER";

  if(todayTC<prevBC)
    return "LOWER";

  if(todayBC>=prevBC && todayTC>=prevTC)
    return "OVERLAP_HIGHER";

  if(todayBC<=prevBC && todayTC<=prevTC)
    return "OVERLAP_LOWER";

  if(todayBC>=prevBC && todayTC<=prevTC)
    return "INSIDE";

  return "OUTSIDE";

}
