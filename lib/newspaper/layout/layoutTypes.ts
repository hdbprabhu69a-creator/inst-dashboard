export interface Rectangle{

    x:number;

    y:number;

    width:number;

    height:number;

}

export interface PageRegion extends Rectangle{

    id:string;

    type:
        | "header"
        | "article"
        | "advertisement"
        | "image"
        | "unknown";

}

export interface LayoutResult{

    width:number;

    height:number;

    regions:PageRegion[];

}
