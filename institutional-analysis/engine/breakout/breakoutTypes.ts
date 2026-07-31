export interface BreakoutStage{

  score:number;

  pass:boolean;

  reasons:string[];

}

export interface RiskStage extends BreakoutStage{

  stop:number;

  target:number;

  rr:number;

}

export interface BreakoutResult{

  symbol:string;

  liquidity:BreakoutStage;

  structure:BreakoutStage;

  resistance:BreakoutStage;

  participation:BreakoutStage;

  confirmation:BreakoutStage;

  risk:RiskStage;

  breakoutScore:number;

  stage:string;

  verdict:string;

}

