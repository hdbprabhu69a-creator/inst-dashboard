export function normalizeText(text:string):string{

return text
.replace(/\r/g,"")
.replace(/\t/g," ")
.replace(/\u00A0/g," ")
.replace(/[ ]{2,}/g," ")
.trim();

}
