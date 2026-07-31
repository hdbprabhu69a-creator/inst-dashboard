"use client";

import GridTable,{GridColumn} from "../GridTable";

interface Props{
  rows:any[];
}

const columns:GridColumn[]=[

{key:"symbol",title:"Symbol",width:140,align:"left"},
{key:"cmp",title:"CMP",width:90,align:"right",render:r=>r.cmp?.toFixed?.(2)},

{key:"dailyBC",title:"DBC",width:72,render:r=>r.dailyBC?.toFixed?.(2)},
{key:"dailyPivot",title:"DPVT",width:72,render:r=>r.dailyPivot?.toFixed?.(2)},
{key:"dailyTC",title:"DTC",width:72,render:r=>r.dailyTC?.toFixed?.(2)},

{key:"weeklyBC",title:"WBC",width:72,render:r=>r.weeklyBC?.toFixed?.(2)},
{key:"weeklyPivot",title:"WPVT",width:72,render:r=>r.weeklyPivot?.toFixed?.(2)},
{key:"weeklyTC",title:"WTC",width:72,render:r=>r.weeklyTC?.toFixed?.(2)},

{key:"monthlyBC",title:"MBC",width:72,render:r=>r.monthlyBC?.toFixed?.(2)},
{key:"monthlyPivot",title:"MPVT",width:72,render:r=>r.monthlyPivot?.toFixed?.(2)},
{key:"monthlyTC",title:"MTC",width:72,render:r=>r.monthlyTC?.toFixed?.(2)},

{key:"width",title:"Width",width:75,render:r=>r.width?.toFixed?.(2)},
{key:"widthPct",title:"W%",width:70,render:r=>r.widthPct?.toFixed?.(2)},
{key:"widthClass",title:"Class",width:120},

{key:"relationship",title:"Relation",width:150},
{key:"virgin",title:"Virgin",width:80},
{key:"opening",title:"Open",width:130},
{key:"position",title:"Position",width:130},
{key:"breakout",title:"Breakout",width:120},
{key:"compression",title:"Comp",width:110},
{key:"acceptance",title:"Accept",width:110},
{key:"rejection",title:"Reject",width:110},
{key:"gap",title:"Gap",width:100},
{key:"probability",title:"Prob",width:120},
{key:"bias",title:"Bias",width:110},
{key:"alignment",title:"Align",width:120},
{key:"score",title:"Score",width:70},
{key:"verdict",title:"Verdict",width:110}

];

export default function CPRAnalysis({rows}:Props){
  return <GridTable columns={columns} rows={rows}/>;
}

