export class PriceCoordinateMapper{
  map(price:number,height:number,min:number,max:number):number{
    return height-((price-min)/(max-min))*height;
  }
}

