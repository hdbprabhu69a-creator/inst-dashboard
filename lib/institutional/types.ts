export type InstitutionalSwingPoint = {

  price:number;

  time:string;

};

export type InstitutionalTrendline = {

  start:InstitutionalSwingPoint;

  end:InstitutionalSwingPoint;

};

export type InstitutionalChannel = {

  upper:InstitutionalTrendline;

  lower:InstitutionalTrendline;

};

