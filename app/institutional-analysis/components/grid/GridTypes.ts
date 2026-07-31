export type CellType =
  | "text"
  | "number"
  | "price"
  | "pivot"
  | "support"
  | "resistance"
  | "percent"
  | "volume"
  | "score"
  | "badge"
  | "signal"
  | "verdict"
  | "alignment"
  | "bias"
  | "probability";

export interface GridColumn{
  key:string;
  title:string;
  width?:number;
  type?:CellType;
  align?:"left"|"center"|"right";
}

