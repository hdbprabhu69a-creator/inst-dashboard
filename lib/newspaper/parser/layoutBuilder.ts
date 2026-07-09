export interface LayoutItem{
    text:string;
    x:number;
    y:number;
    width:number;
    height:number;
    fontName?:string;
}

export interface LayoutRow{
    y:number;
    items:LayoutItem[];
    text:string;
}

const Y_TOLERANCE=3;
const X_GAP=80;

export function buildRows(items:LayoutItem[]):LayoutRow[]{

    const sorted=[...items].sort((a,b)=>{

        if(Math.abs(a.y-b.y)<=Y_TOLERANCE){
            return a.x-b.x;
        }

        return b.y-a.y;

    });

    const yGroups:LayoutItem[][]=[];

    for(const item of sorted){

        let group=yGroups.find(
            g=>Math.abs(g[0].y-item.y)<=Y_TOLERANCE
        );

        if(!group){

            group=[];

            yGroups.push(group);

        }

        group.push(item);

    }

    const rows:LayoutRow[]=[];

    for(const group of yGroups){

        group.sort((a,b)=>a.x-b.x);

        let current:LayoutItem[]=[];

        let lastRight=-1;

        for(const item of group){

            if(
                current.length>0 &&
                item.x-lastRight>X_GAP
            ){

                rows.push({

                    y:current[0].y,

                    items:[...current],

                    text:current
                        .map(i=>i.text.trim())
                        .filter(Boolean)
                        .join(" ")

                });

                current=[];

            }

            current.push(item);

            lastRight=item.x+item.width;

        }

        if(current.length){

            rows.push({

                y:current[0].y,

                items:[...current],

                text:current
                    .map(i=>i.text.trim())
                    .filter(Boolean)
                    .join(" ")

            });

        }

    }

    return rows.sort((a,b)=>b.y-a.y);

}
