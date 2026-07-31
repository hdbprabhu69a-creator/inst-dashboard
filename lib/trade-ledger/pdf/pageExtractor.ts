import type {PdfTextItem} from "./textItems";

export async function extractPageItems(page:any):Promise<PdfTextItem[]>{

    const content=await page.getTextContent();

    return content.items
        .filter((item:any)=>typeof item.str==="string" && item.str.trim()!=="")
        .map((item:any)=>({

            text:item.str.trim(),

            x:item.transform[4],

            y:item.transform[5],

            width:item.width,

            height:item.height

        }));

}

