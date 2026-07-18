"use client";

import InstitutionalGrid from "../grid/InstitutionalGrid";
import { GridColumn } from "../grid/GridTypes";

interface Props{
  rows:any[];
}

const columns:GridColumn[]=[

{key:"symbol",title:"Symbol",type:"text"},
{key:"cmp",title:"CMP",type:"price"},

{key:"deliveryPercent",title:"Del %",type:"percent"},
{key:"deliveryQty",title:"Del Qty",type:"number"},

{key:"composite",title:"Composite",type:"score"},
{key:"institutional",title:"Institutional",type:"score"},
{key:"trendScore",title:"Trend",type:"score"},
{key:"confidence",title:"Confidence",type:"score"},

{key:"trend",title:"Trend",type:"badge"},
{key:"signal",title:"Signal",type:"badge"},

{key:"deliveryGrowth",title:"Growth",type:"percent"},
{key:"deliveryMomentum",title:"Momentum",type:"percent"},
{key:"deliveryAcceleration",title:"Acceleration",type:"percent"},
{key:"historicalPercentile",title:"Hist %",type:"percent"},

{key:"accumulation",title:"Accum",type:"badge"},
{key:"distribution",title:"Distrib",type:"badge"},
{key:"absorption",title:"Absorb",type:"badge"},
{key:"smartMoneyEntry",title:"SM Entry",type:"badge"},
{key:"smartMoneyExit",title:"SM Exit",type:"badge"}

];

export default function DeliveryAnalysis({rows}:Props){
  return <InstitutionalGrid columns={columns} rows={rows}/>;
}


