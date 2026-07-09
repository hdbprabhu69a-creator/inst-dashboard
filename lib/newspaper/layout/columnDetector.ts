export interface TextBlock{

    text:string;

    x:number;

    y:number;

    width:number;

    height:number;

}

export interface Column{

    index:number;

    items:TextBlock[];

}

const COLUMN_GAP=120;

export function detectColumns(
    items:TextBlock[]
):Column[]{

    const sorted=[...items].sort((a,b)=>a.x-b.x);

    const columns:Column[]=[];

    for(const item of sorted){

        let column=columns.find(c=>{

            const avg=
                c.items.reduce((s,i)=>s+i.x,0)/
                c.items.length;

            return Math.abs(avg-item.x)<COLUMN_GAP;

        });

        if(!column){

            column={

                index:columns.length,

                items:[]

            };

            columns.push(column);

        }

        column.items.push(item);

    }

    for(const column of columns){

        column.items.sort((a,b)=>b.y-a.y);

    }

    return columns.sort((a,b)=>a.index-b.index);

}
