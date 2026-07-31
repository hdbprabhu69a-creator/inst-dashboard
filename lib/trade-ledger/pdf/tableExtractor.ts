import type {PdfTextItem} from "./textItems";

export interface PdfTradeRow{

    orderNo:string;
    orderTime:string;
    tradeNo:string;
    tradeTime:string;
    security:string;
    side:string;
    exchange:string;
    quantity:string;
    brokerage:string;
    price:string;
    total:string;

}

const ROW_TOLERANCE=2;

const COLUMNS={

    orderNo:[0,120],
    orderTime:[120,170],
    tradeNo:[170,235],
    tradeTime:[235,280],
    security:[280,400],
    side:[400,445],
    exchange:[445,500],
    quantity:[500,545],
    brokerage:[545,590],
    price:[590,710],
    total:[710,790]

} as const;

function inside(
    x:number,
    min:number,
    max:number
){

    return x>=min && x<max;

}

function readColumn(
    row:PdfTextItem[],
    min:number,
    max:number
){

    return row
        .filter(c=>inside(c.x,min,max))
        .sort((a,b)=>a.x-b.x)
        .map(c=>c.text)
        .join(" ")
        .trim();

}

export function extractTradeRows(
    items:PdfTextItem[]
):PdfTradeRow[]{

    const sorted=[...items].sort((a,b)=>{

        if(Math.abs(b.y-a.y)>ROW_TOLERANCE){

            return b.y-a.y;

        }

        return a.x-b.x;

    });

    const grouped:PdfTextItem[][]=[];

    for(const item of sorted){

        let row=grouped.find(r=>Math.abs(r[0].y-item.y)<=ROW_TOLERANCE);

        if(!row){

            row=[];

            grouped.push(row);

        }

        row.push(item);

    }

    const trades:PdfTradeRow[]=[];

    for(const row of grouped){

        const orderNo=readColumn(row,...COLUMNS.orderNo);

        if(!/^\d{10,20}$/.test(orderNo)){

            continue;

        }

        console.log({symbol:readColumn(row,...COLUMNS.security),side:readColumn(row,...COLUMNS.side),price:readColumn(row,...COLUMNS.price),total:readColumn(row,...COLUMNS.total)});


        trades.push({

            orderNo,

            orderTime:readColumn(row,...COLUMNS.orderTime),

            tradeNo:readColumn(row,...COLUMNS.tradeNo),

            tradeTime:readColumn(row,...COLUMNS.tradeTime),

            security:readColumn(row,...COLUMNS.security),

            side:readColumn(row,...COLUMNS.side),

            exchange:readColumn(row,...COLUMNS.exchange),

            quantity:readColumn(row,...COLUMNS.quantity),

            brokerage:readColumn(row,...COLUMNS.brokerage),

            price:readColumn(row,...COLUMNS.price),

            total:readColumn(row,...COLUMNS.total)

        });

    }

    return trades;

}



