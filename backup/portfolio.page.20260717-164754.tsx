"use client";

import { useState } from "react";
import { usePortfolio } from "@/hooks/portfolio/usePortfolio";
import {
Home,
Briefcase,
BarChart3,
PieChart,
Shield,
Search,
Bell,
User,
ChevronDown,
Wallet,
TrendingUp,
DollarSign
} from "lucide-react";

import GridTable from "@/app/institutional-analysis/components/GridTable";

const cards=[
{title:"Net Worth",icon:Wallet,key:"netWorth"},
{title:"Day P&L",icon:TrendingUp,key:"dayPnL"},
{title:"Total P&L",icon:DollarSign,key:"totalPnL"},
{title:"Unrealized",icon:BarChart3,key:"unrealizedPnL"},
{title:"Realized",icon:PieChart,key:"realizedPnL"},
{title:"Cash",icon:Wallet,key:"cash"},
{title:"Buying Power",icon:DollarSign,key:"buyingPower"}
];

export default function PortfolioPage(){

const [selected]=useState("dashboard");
const [activeTab,setActiveTab]=useState("Holdings");

const {
  data,
  loading,
  error,
}=usePortfolio();

const columns=[
{key:"symbol",title:"INSTRUMENT",width:180},
{key:"segment",title:"SEGMENT",width:90},
{key:"quantity",title:"QTY",width:90},
{key:"averagePrice",title:"AVG COST",width:120},
{key:"lastPrice",title:"LTP",width:110},
{key:"investedValue",title:"INVESTED",width:150},
{key:"marketValue",title:"CURRENT VALUE",width:160},
{key:"unrealizedPnL",title:"TOTAL P&L",width:130},
{key:"returnPercent",title:"RETURN %",width:100},
];

const rows = data?.holdings ?? [];

const formatShortINR = (value: number) => {
  const n = Number(value ?? 0);

  if (n >= 10000000) return `${"\u20B9"}${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${"\u20B9"}${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `${"\u20B9"}${(n / 1000).toFixed(2)}K`;

  return `${"\u20B9"}${n.toLocaleString("en-IN")}`;
};



const portfolioTabs=[
"Holdings",
"Positions",
"Orders",
"Allocation",
"Risk",
"Performance",
"Reports"
];


return(

<div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">

<aside className="flex w-52 flex-col border-r border-slate-700 bg-[#0b1220] py-2">

<button className="flex h-11 w-full items-center gap-3 px-4 bg-slate-800 text-white font-medium">
<Home size={18} />
<span>Dashboard</span>
</button>
<button className="flex h-11 w-full items-center gap-3 px-4 text-white hover:bg-slate-800">
<Briefcase size={18} />
<span>OMS</span>
</button>
<button className="flex h-11 w-full items-center gap-3 px-4 text-white hover:bg-slate-800">
<BarChart3 size={18} />
<span>Positions</span>
</button>
<button className="flex h-11 w-full items-center gap-3 px-4 text-white hover:bg-slate-800">
<PieChart size={18} />
<span>Performance</span>
</button>
<button className="flex h-11 w-full items-center gap-3 px-4 text-white hover:bg-slate-800">
<Shield size={18} />
<span>Risk</span>
</button>

</aside>

<div className="flex flex-1 flex-col overflow-hidden">

<div className="flex h-12 items-center justify-between divide-x divide-slate-700 border-b border-slate-700 bg-[#0d1117] px-4">

<div className="relative">

<Search
size={18}
className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-100"
/>

<input
placeholder="Search instruments..."
className="w-[320px] border border-slate-700 bg-slate-800 text-white placeholder:text-slate-300 py-1.5 pl-10 pr-4 rounded outline-none"
/>
</div>

<button className=" border border-slate-700 bg-slate-800 p-2">

<Bell size={18}/>

</button>

<button className="flex items-center gap-1  border border-slate-700 bg-slate-800 px-3 py-1">

<div className="rounded-full bg-cyan-500 p-1.5">

<User size={16}/>

</div>

<div>

<div className="text-base font-bold text-white">
Portfolio
</div>

<div className="text-xs text-slate-100">
LIVE
</div>

</div>

<ChevronDown size={16}/>

</button>

</div>



<div className="border-b border-slate-700 bg-[#0b1220] px-2 py-1.5">
  <div className="grid grid-cols-7 divide-x divide-slate-700 h-[68px]">

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">NET ASSETS</div>
      <div className="text-base font-bold text-white">{formatShortINR(data?.netWorth)}</div>
    </div>

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">INVESTED</div>
      <div className="text-base font-bold text-white">{formatShortINR(data?.investedValue)}</div>
    </div>

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">MARKET VALUE</div>
      <div className="text-base font-bold text-white">{formatShortINR(data?.marketValue)}</div>
    </div>

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">TOTAL P&L</div>
      <div className={Number(data?.totalPnL)>=0?"text-base font-bold text-white text-emerald-400":"text-base font-bold text-white text-rose-400"}>
        {formatShortINR(data?.totalPnL)}
      </div>
    </div>

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">CASH</div>
      <div className="text-base font-bold text-white">{formatShortINR(data?.cash)}</div>
    </div>

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">BUYING POWER</div>
      <div className="text-base font-bold text-white">{formatShortINR(data?.buyingPower)}</div>
    </div>

    <div className="flex h-full flex-col justify-center px-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">RETURN</div>
      <div className={Number(data?.totalPnL)>=0?"text-base font-bold text-white text-emerald-400":"text-base font-bold text-white text-rose-400"}>
        {Number(data?.investedValue)>0?((Number(data?.totalPnL)/Number(data?.investedValue))*100).toFixed(2):"0.00"}%
      </div>
    </div>

  </div>
</div>

<div className="flex-1 bg-slate-950 p-0 overflow-hidden flex flex-col">



<div className="flex items-center gap-6 border-b border-slate-700 bg-[#0f172a] px-5 h-12 text-sm">

<button className="border-b-2 border-cyan-400 px-3 h-full font-bold text-white">
Holdings
</button>

<button className="px-3 h-full font-medium text-white opacity-100 hover:text-cyan-300 transition-colors">
Positions
</button>

<button className="px-3 h-full font-medium text-white opacity-100 hover:text-cyan-300 transition-colors">
Orders
</button>

<button className="px-3 h-full font-medium text-white opacity-100 hover:text-cyan-300 transition-colors">
Allocation
</button>

<button className="px-3 h-full font-medium text-white opacity-100 hover:text-cyan-300 transition-colors">
Risk
</button>

<button className="px-3 h-full font-medium text-white opacity-100 hover:text-cyan-300 transition-colors">
Performance
</button>

<button className="px-3 h-full font-medium text-white opacity-100 hover:text-cyan-300 transition-colors">
Reports
</button>

</div>

<div className="flex h-12 items-center justify-between border-b border-slate-700 bg-[#0b1220] px-4">
<div className="text-base font-bold text-white">
<span className="text-base font-bold tracking-wide">Portfolio Manager ({rows.length})</span>
</div>
<div className="flex gap-1">
<button className="rounded-sm border border-slate-700 bg-slate-700 text-white px-5 py-1.5 text-sm font-medium hover:bg-slate-700 transition-colors">Filter</button>
<button className="rounded-sm border border-slate-700 bg-slate-700 text-white px-5 py-1.5 text-sm font-medium hover:bg-slate-700 transition-colors">Export</button>
<button className="rounded-sm border border-slate-700 bg-slate-700 text-white px-5 py-1.5 text-sm font-medium hover:bg-slate-700 transition-colors">Reconcile</button>
</div>
</div>

<div className="flex-1 border border-slate-700 rounded-none bg-[#0b1220] overflow-hidden">


{activeTab==="Holdings" && (
  <GridTable
    columns={columns}
    rows={rows}
  />
)}

{activeTab!=="Holdings" && (
  <div className="flex h-full items-center justify-center text-slate-100 text-sm">
    {activeTab} module coming next...
  </div>
)}

</div>

<div className="grid h-12 grid-cols-5 items-center border-t border-slate-700 bg-[#0b1220] text-sm text-white">

<div className="border-r border-slate-700 px-5">
Holdings : {rows.length}
</div>

<div className="border-r border-slate-700 px-5">
Invested :
{formatShortINR(data?.investedValue)}
</div>

<div className="border-r border-slate-700 px-5">
Current :
{formatShortINR(data?.marketValue)}
</div>

<div className={`border-r border-slate-700 px-5 ${Number(data?.totalPnL)>=0 ? "text-emerald-400" : "text-rose-400"}`}>
Total P&L :
{formatShortINR(data?.totalPnL)}
</div>

<div className="px-5">
Last Sync :
LIVE
</div>

</div>



</div>

</div>

</div>

);

}












