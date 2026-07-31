export interface NewsMetric{
    metric:string;
    value:string|number;
    unit:string;
}

export interface NewsStock{
    symbol:string;
    remarks:string;
}

export interface NewsDocument{

    id?:string;

    headline:string;

    category:string;

    date:string;

    verdict:string;

    summary:string;

    metrics:NewsMetric[];

    sectors:string[];

    stocks:NewsStock[];

    watchItems:string[];

    createdAt?:any;

    updatedAt?:any;

}

