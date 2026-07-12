"use client";

import InstitutionalGrid from "../grid/InstitutionalGrid";
import { GridColumn } from "../grid/GridTypes";

interface Props{
  rows:any[];
}

const columns:GridColumn[]=[
{key:"symbol",title:"Symbol",type:"text"},
{key:"cmp",title:"CMP",type:"price"},

{key:"compression",title:"Comp",type:"badge"},
{key:"acceptance",title:"Accept",type:"badge"},
{key:"probability",title:"Prob",type:"probability"},
{key:"bias",title:"Bias",type:"bias"},
{key:"alignment",title:"Align",type:"alignment"},
{key:"score",title:"Score",type:"score"},
{key:"verdict",title:"Verdict",type:"verdict"},

{key:"dailyBC",title:"DBC",type:"pivot"},
{key:"dailyPivot",title:"DPVT",type:"pivot"},
{key:"dailyTC",title:"DTC",type:"pivot"},

{key:"weeklyBC",title:"WBC",type:"pivot"},
{key:"weeklyPivot",title:"WPVT",type:"pivot"},
{key:"weeklyTC",title:"WTC",type:"pivot"},

{key:"monthlyBC",title:"MBC",type:"pivot"},
{key:"monthlyPivot",title:"MPVT",type:"pivot"},
{key:"monthlyTC",title:"MTC",type:"pivot"},

{key:"width",title:"Width",type:"number"},
{key:"widthPct",title:"W%",type:"percent"},
{key:"widthClass",title:"Class",type:"badge"},

{key:"relationship",title:"Relation",type:"badge"},
{key:"virgin",title:"Virgin",type:"badge"},
{key:"opening",title:"Open",type:"badge"},
{key:"position",title:"Position",type:"badge"},
{key:"breakout",title:"Breakout",type:"badge"},
{key:"rejection",title:"Reject",type:"badge"},
{key:"gap",title:"Gap",type:"badge"}
];

export default function CPRAnalysis({rows}:Props){
  return <InstitutionalGrid columns={columns} rows={rows}/>;
}

