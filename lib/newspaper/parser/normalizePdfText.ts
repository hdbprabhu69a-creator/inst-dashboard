export function normalizePdfText(text:string):string{

    return text
        .replace(/\r/g,"")
        .replace(/DELHI·.*?Volume.*?\n/gi,"")
        .replace(/thehindu\s+biiSitief~?'?Sline@/gi,"")
        .replace(/SENSEX.*?\n/gi,"")
        .replace(/USDollar.*?\n/gi,"")
        .replace(/Silver.*?\n/gi,"")
        .replace(/[ \t]+/g," ")
        .replace(/\n{3,}/g,"\n\n")
        .trim();

}
