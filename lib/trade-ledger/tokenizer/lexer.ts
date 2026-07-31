import {Cursor} from "./cursor";
import {Token,TokenType} from "./token";

export abstract class Lexer{

  protected readonly tokens:Token[]=[];

  constructor(
    protected readonly cursor:Cursor
  ){}

  abstract tokenize():Token[];

}

