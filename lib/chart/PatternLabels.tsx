"use client";

type Label = {

  text:string;

  x:number;

  y:number;

  color?:string;

};

type Props = {

  labels:Label[];

};

export default function PatternLabels({

  labels,

}:Props){

  return(

    <>

      {labels.map(label=>(

        <div

          key={label.text+label.x}

          className="absolute pointer-events-none select-none text-[10px] font-medium whitespace-nowrap"

          style={{

            left:label.x,

            top:label.y,

            color:label.color ?? "#d4d4d8",

            opacity:0.65,

            transform:"translate(-50%,-50%)",

            textShadow:"0 0 2px #000",

          }}

        >

          {label.text}

        </div>

      ))}

    </>

  );

}

