import mammoth from "mammoth";

export interface DocxPage{

    page:number;

    text:string;

}

export async function extractDocxText(
    docxPath:string
):Promise<DocxPage[]>{

    const result=await mammoth.extractRawText({
        path:docxPath
    });

    const text=result.value
        .replace(/\r/g,"")
        .replace(/\u00A0/g," ")
        .trim();

    const rawPages=text
        .split(/\f+/)
        .map(x=>x.trim())
        .filter(Boolean);

    if(rawPages.length){

        return rawPages.map((text,index)=>({

            page:index+1,

            text

        }));

    }

    return [{

        page:1,

        text

    }];

}
