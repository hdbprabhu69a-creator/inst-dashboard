export type CPROpeningPosition =
  | "ABOVE_R3"
  | "R2_R3"
  | "R1_R2"
  | "PIVOT_R1"
  | "INSIDE_CPR"
  | "BC_PIVOT"
  | "S1_BC"
  | "S2_S1"
  | "BELOW_S2";

export function getOpeningPosition(
  open:number,
  bc:number,
  pivot:number,
  tc:number,
  r1:number,
  r2:number,
  r3:number,
  s1:number,
  s2:number
):CPROpeningPosition{

  if(open>=r3) return "ABOVE_R3";
  if(open>=r2) return "R2_R3";
  if(open>=r1) return "R1_R2";
  if(open>tc) return "PIVOT_R1";
  if(open>=bc && open<=tc) return "INSIDE_CPR";
  if(open>=s1 && open<bc) return "BC_PIVOT";
  if(open>=s2 && open<s1) return "S1_BC";
  if(open<s2) return "S2_S1";

  return "BELOW_S2";

}

