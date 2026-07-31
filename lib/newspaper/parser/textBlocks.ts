export function splitIntoBlocks(text:string):string[]{

    return text
        .replace(/\r/g,"")
        .replace(/[ \t]+/g," ")
        .replace(/\n{3,}/g,"\n\n")
        .split(/\n\s*\n/)
        .map(x=>x.trim())
        .filter(x=>x.length>20);

}

