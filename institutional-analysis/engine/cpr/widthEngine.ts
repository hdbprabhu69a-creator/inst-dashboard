export type CPRWidthClass =
  | "ULTRA_NARROW"
  | "NARROW"
  | "NORMAL"
  | "WIDE"
  | "ULTRA_WIDE";

export interface CPRWidthResult{
  width:number;
  widthPct:number;
  widthClass:CPRWidthClass;
}

export function getCPRWidth(
  bc:number,
  tc:number,
  high:number,
  low:number
):CPRWidthResult{

  const width=+(tc-bc).toFixed(2);

  const range=Math.max(high-low,0.01);

  const widthPct=+((width/range)*100).toFixed(2);

  let widthClass:CPRWidthClass="NORMAL";

  if(widthPct<=10) widthClass="ULTRA_NARROW";
  else if(widthPct<=20) widthClass="NARROW";
  else if(widthPct<=35) widthClass="NORMAL";
  else if(widthPct<=50) widthClass="WIDE";
  else widthClass="ULTRA_WIDE";

  return{
    width,
    widthPct,
    widthClass
  };

}
