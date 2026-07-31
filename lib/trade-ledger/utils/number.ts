export function parseAmount(
  value: string
): number {

  return Number(
    value
      .replace(/[(),]/g,"")
      .trim()
  ) || 0;

}

export function isNegative(
  value:string
):boolean{

  return value.includes("(");

}

