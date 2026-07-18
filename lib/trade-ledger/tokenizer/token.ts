export enum TokenType{

  ISIN,
  TIME,
  NUMBER,
  WORD,
  SYMBOL,
  EXCHANGE,
  BUY,
  SELL,
  LPAREN,
  RPAREN,
  EOF

}

export interface Token{

  type:TokenType;

  value:string;

  position:number;

}
