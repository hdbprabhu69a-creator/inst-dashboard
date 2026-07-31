import {Cursor} from "./cursor";
import {Lexer} from "./lexer";
import {Token,TokenType} from "./token";
import {ISIN,TIME} from "./patterns";

export class AnnexureLexer extends Lexer{

  constructor(text:string){

    super(new Cursor(text));

  }

  override tokenize():Token[]{

    while(!this.cursor.eof()){

      this.cursor.skipWhitespace();

      if(this.cursor.eof()){

        break;

      }

      const position=this.cursor.position();

      let value="";

      while(!this.cursor.eof()&&!/\s/.test(this.cursor.peek())){

        value+=this.cursor.next();

      }

      this.tokens.push({

        type:this.getTokenType(value),

        value,

        position

      });

    }

    this.tokens.push({

      type:TokenType.EOF,

      value:"",

      position:this.cursor.position()

    });

    return this.tokens;

  }

  private getTokenType(value:string):TokenType{

    if(ISIN.test(value)){

      return TokenType.ISIN;

    }

    if(TIME.test(value)){

      return TokenType.TIME;

    }

    if(/^-?\d+(\.\d+)?$/.test(value)){

      return TokenType.NUMBER;

    }

    if(value==="BUY"){

      return TokenType.BUY;

    }

    if(value==="SELL"){

      return TokenType.SELL;

    }

    if(value==="NSE"||value==="BSE"){

      return TokenType.EXCHANGE;

    }

    return TokenType.WORD;

  }

}

