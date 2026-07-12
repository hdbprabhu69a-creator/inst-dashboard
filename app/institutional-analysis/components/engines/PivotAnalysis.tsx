"use client";

import InstitutionalGrid from "../grid/InstitutionalGrid";
import { GridColumn } from "../grid/GridTypes";

interface Props{
  rows:any[];
}

const columns:GridColumn[]=[
{key:"symbol",title:"Symbol",type:"text",width:140},
{key:"cmp",title:"CMP",type:"price"},
{key:"dailyValue",title:"DPVT",type:"pivot"},
{key:"dailyR1",title:"DR1",type:"resistance"},
{key:"dailyR2",title:"DR2",type:"resistance"},
{key:"dailyS1",title:"DS1",type:"support"},
{key:"dailyS2",title:"DS2",type:"support"},
{key:"weeklyValue",title:"WPVT",type:"pivot"},
{key:"weeklyR1",title:"WR1",type:"resistance"},
{key:"weeklyR2",title:"WR2",type:"resistance"},
{key:"weeklyS1",title:"WS1",type:"support"},
{key:"weeklyS2",title:"WS2",type:"support"},
{key:"monthlyValue",title:"MPVT",type:"pivot"},
{key:"monthlyR1",title:"MR1",type:"resistance"},
{key:"monthlyR2",title:"MR2",type:"resistance"},
{key:"monthlyS1",title:"MS1",type:"support"},
{key:"monthlyS2",title:"MS2",type:"support"},
{key:"alignment",title:"Align",type:"alignment"},
{key:"bias",title:"Bias",type:"bias"},
{key:"score",title:"Score",type:"score"},
{key:"verdict",title:"Verdict",type:"verdict"}
];

export default function PivotAnalysis({rows}:Props){
  return <InstitutionalGrid columns={columns} rows={rows}/>;
}
