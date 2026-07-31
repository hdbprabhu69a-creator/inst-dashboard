export function normalizeText(
  text:string
):string{

  return text
    .replace(/\r/g,"")
    .replace(/[ \t]+/g," ")
    .replace(/\n{2,}/g,"\n")
    .trim();

}

