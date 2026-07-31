export type AssetType=
    |"STOCK"
    |"INDEX";

export interface AssetInfo{

    symbol:string;

    displayName:string;

    type:AssetType;

}

