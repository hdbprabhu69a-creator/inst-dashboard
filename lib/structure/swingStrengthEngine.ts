export interface Swing{

 index:number;

 price:number;

 type:string;

}

export function scoreSwingStrength(

 previous:Swing,

 current:Swing,

 atr:number=0

){

 const move=
  Math.abs(
   current.price-
   previous.price
  );

 const threshold=
  atr>0
   ?atr*0.25
   :5;

 let score=0;

 if(move>=threshold)
  score+=50;

 if(move>=threshold*2)
  score+=25;

 if(move>=threshold*3)
  score+=25;

 return{

  score,

  significant:
   score>=50,

  move,

  threshold

 };

}
