export interface BoundingBox {
  x:number;
  y:number;
  width:number;
  height:number;
}

export interface OCRWord{
  text:string;
  confidence:number;
  bbox:BoundingBox;
}

export interface OCRLine{
  words:OCRWord[];
  bbox:BoundingBox;
}

export interface OCRPage{
  pageNumber:number;
  width:number;
  height:number;
  lines:OCRLine[];
}

export interface ParsedArticle{
  id:string;
  pageNumber:number;
  title:string;
  subtitle?:string;
  author?:string;
  section?:string;
  body:string;
}

export interface ParsedNewspaper{
  source:string;
  editionDate:Date;
  pageCount:number;
  pages:OCRPage[];
  articles:ParsedArticle[];
}
