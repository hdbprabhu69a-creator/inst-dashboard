export class Cursor{

  constructor(
    private readonly text:string,
    private index=0
  ){}

  peek(offset=0):string{

    return this.text[this.index+offset]??"";

  }

  next():string{

    return this.text[this.index++]??"";

  }

  eof():boolean{

    return this.index>=this.text.length;

  }

  skipWhitespace():void{

    while(!this.eof()&&/\s/.test(this.peek())){

      this.next();

    }

  }

  position():number{

    return this.index;

  }

}
