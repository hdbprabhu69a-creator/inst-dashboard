import type { TradeSummary } from "../contractNoteTypes";
import type { PdfTextItem } from "../pdf/textItems";

interface Cell {
    x:number;
    text:string;
}

interface Row {
    y:number;
    cells:Cell[];
}

function buildRows(items:PdfTextItem[]):Row[]{

    const tolerance=2;
    const rows:Row[]=[];

    for(const item of items){

        let row=rows.find(r=>Math.abs(r.y-item.y)<tolerance);

        if(!row){

            row={
                y:item.y,
                cells:[]
            };

            rows.push(row);

        }

        row.cells.push({
            x:item.x,
            text:item.text
        });

    }

    rows.sort((a,b)=>a.y-b.y);

    for(const row of rows){

        row.cells.sort((a,b)=>a.x-b.x);

    }

    return rows;

}

function cell(row:Row,min:number,max:number){

    return row.cells
        .filter(c=>c.x>=min && c.x<max)
        .map(c=>c.text)
        .join(" ")
        .trim();

}

function numberValue(text:string){

    return Number(
        text
            .replace(/\u2212/g,"-")
            .replace(/\u2013/g,"-")
            .replace(/\u2014/g,"-")
            .replace(/,/g,"")
            .replace(/[^\d.-]/g,"")
    )||0;

}

export function parseSummary(
    items:PdfTextItem[]
):TradeSummary{

    const rows=buildRows(items);

    const row=rows.find(r=>
        r.cells.some(c=>/^IN[A-Z0-9]+/i.test(c.text))
    );

    if(!row){

        throw new Error("Summary row not found.");

    }

        return{

        isin:cell(row,0,80),

        symbol:cell(row,80,170),

        buyQty:numberValue(cell(row,170,220)),

        averagePrice:numberValue(cell(row,220,285)),

        buyValue:numberValue(cell(row,380,450)),

        sellQty:numberValue(cell(row,450,495)),

        sellValue:numberValue(cell(row,670,720)),

        netQty:numberValue(cell(row,720,750)),

        netObligation:numberValue(cell(row,750,830))

    };

}



