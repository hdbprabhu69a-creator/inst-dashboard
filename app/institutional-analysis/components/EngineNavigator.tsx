"use client";

const ENGINES = [
  "Trend Analysis",
  "Volume Analysis",
  "VWAP Analysis",
  "CPR Analysis",
  "Pivot Analysis",
  "Swing Analysis",
  "Fibonacci Analysis",
  "Delivery Analysis",
  "Momentum Analysis",
  "Relative Strength",
  "Sector Analysis",
  "Breadth Analysis",
  "FII / DII Flow",
  "Options Analysis",
  "Macro Analysis",
  "Risk Engine",
  "Portfolio Engine",
  "Composite Score"
];

interface Props{
  selected:string;
  setSelected:(engine:string)=>void;
}

export default function EngineNavigator({
  selected,
  setSelected
}:Props){

  return(

    <div className="h-full bg-[#0a0d12] flex flex-col">

      <div className="h-10 px-4 flex items-center border-b border-[#2a313b] text-xs font-semibold tracking-widest text-[#b8c1cc]">

        ENGINES

      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{scrollbarWidth:"none",msOverflowStyle:"none"}}>

        {ENGINES.map(engine=>(

          <button
            key={engine}
            onClick={()=>setSelected(engine)}
            className={[
              "w-full",
              "h-9",
              "px-4",
              "text-left",
              "text-[13px]",
              "border-l-2",
              "transition-all",
              selected===engine
                ? "border-cyan-400 bg-[#11161d] text-white"
                : "border-transparent text-[#b8c1cc] hover:bg-[#11161d] hover:text-white"
            ].join(" ")}
          >
            {engine}
          </button>

        ))}

      </div>

    </div>

  );

}




