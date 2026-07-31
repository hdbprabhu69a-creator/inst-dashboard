export function splitContractNotes(
  text:string
):string[]{

  const matches=text.match(
    /CONTRACT NOTE CUM TAX INVOICE[\s\S]*?(?=CONTRACT NOTE CUM TAX INVOICE|$)/g
  );

  return matches ?? [];

}

