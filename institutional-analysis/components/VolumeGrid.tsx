"use client";

import InstitutionalGrid from "@/app/institutional-analysis/components/grid/InstitutionalGrid";
import type { GridColumn } from "@/app/institutional-analysis/components/grid/GridTypes";
import { VolumeAnalysisResult } from "../engine/volume";

interface VolumeGridProps{
  data:VolumeAnalysisResult[];
}

const columns:GridColumn[]=[

{key:"symbol",title:"Symbol",width:140,type:"text"},
{key:"currentVolume",title:"Current Vol",width:140},

{key:"avgVolume5",title:"Avg Vol 5D",width:120},
{key:"avgVolume20",title:"Avg Vol 20D",width:120},
{key:"avgVolume50",title:"Avg Vol 50D",width:120},

{key:"avgDelivery5",title:"Del 5D",width:100},
{key:"avgDelivery10",title:"Del 10D",width:100},
{key:"avgDelivery20",title:"Del 20D",width:100},

{key:"relativeVolume",title:"Rel Vol",width:90},

{key:"volumeTrend",title:"Trend",width:120},
{key:"participation",title:"Participation",width:130},

{key:"accumulationDistribution",title:"A/D",width:120},

{key:"priceVolumeConfirmation",title:"PVC",width:120},

{key:"breakoutConfirmation",title:"Breakout",width:100},
{key:"breakdownConfirmation",title:"Breakdown",width:110},

{key:"buyingSellingClimax",title:"Climax",width:120},

{key:"dryVolume",title:"Dry",width:80},

{key:"volumeScore",title:"Vol Score",width:100},
{key:"deliveryScore",title:"Del Score",width:100},
{key:"institutionalScore",title:"Inst Score",width:110},

{key:"institutionalVerdict",title:"Verdict",width:180},

{key:"sma20",title:"SMA20",width:100},
{key:"sma50",title:"SMA50",width:100},
{key:"sma100",title:"SMA100",width:100},
{key:"sma200",title:"SMA200",width:100},

{key:"above20",title:">20",width:70},
{key:"above50",title:">50",width:70},
{key:"above100",title:">100",width:80},
{key:"above200",title:">200",width:80},

{key:"bullAlignment",title:"Bull",width:80},
{key:"bearAlignment",title:"Bear",width:80}

];

export default function VolumeGrid({data}:VolumeGridProps){

  if(!data){
    return(
      <div className="h-full flex items-center justify-center text-slate-400">
        Loading Volume Analysis...
      </div>
    );
  }

  return(
    <InstitutionalGrid
      columns={columns}
      rows={data}
    />
  );

}




