"use client";

import UniverseTable from "../UniverseTable";
import PivotAnalysis from "../engines/PivotAnalysis";
import CPRAnalysis from "../engines/CPRAnalysis";

interface Props{
  engine:string;
  rows:any[];
  onSelect:(symbol:string)=>void;
}

export default function EngineWorkspace({
  engine,
  rows,
  onSelect
}:Props){

  if(engine==="Trend Analysis"){
    return(
      <div className="h-full bg-[#11161d] border border-[#2a313b] rounded-md overflow-auto hidescroll">
        <UniverseTable
          rows={rows}
          onSelect={onSelect}
        />
      </div>
    );
  }

  if(engine==="Pivot Analysis"){
    return <PivotAnalysis rows={rows} />;
  }

  if(engine==="CPR Analysis"){
    return <CPRAnalysis rows={rows} />;
  }

  return(
    <div className="h-full bg-[#11161d] border border-[#2a313b] rounded-md flex items-center justify-center text-[#b8c1cc] text-lg">
      {engine}
    </div>
  );

}