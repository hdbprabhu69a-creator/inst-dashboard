export type CPRPosition =
  | "ABOVE_R3"
  | "R2_R3"
  | "R1_R2"
  | "TC_R1"
  | "INSIDE_CPR"
  | "BC_PIVOT"
  | "S1_BC"
  | "S2_S1"
  | "BELOW_S2";

export function getCPRPosition(
  price:number,
  bc:number,
  tc:number,
  pivot:number,
  r1:number,
  r2:number,
  r3:number,
  s1:number,
  s2:number
):CPRPosition{

  if(price>=r3) return "ABOVE_R3";

  if(price>=r2) return "R2_R3";

  if(price>=r1) return "R1_R2";

  if(price>tc) return "TC_R1";

  if(price>=bc && price<=tc)
    return "INSIDE_CPR";

  if(price>=s1 && price<bc)
    return "BC_PIVOT";

  if(price>=s2 && price<s1)
    return "S1_BC";

  if(price<s2)
    return "S2_S1";

  return "BELOW_S2";

}

