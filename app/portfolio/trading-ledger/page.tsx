"use client";

import { usePortfolio } from "@/hooks/portfolio/usePortfolio";
import {
    buildPortfolioLedger,
    buildPortfolioSummary
} from "@/lib/portfolio/ledger";
import { usePortfolioMarketData } from "@/hooks/usePortfolioMarketData";

import InstitutionalGrid from "@/app/institutional-analysis/components/grid/InstitutionalGrid";
import type { GridColumn } from "@/app/institutional-analysis/components/grid/GridTypes";

const columns: GridColumn[] = [
  { key:"tradeDate", title:"DATE", width:75, type:"text" },
  { key:"symbol", title:"STOCK", width:90, type:"text" },
  { key:"action", title:"ACTION", width:70, type:"badge" },
  { key:"quantity", title:"QTY", width:60, type:"number" },
  { key:"tradeAvg", title:"AVG", width:70, type:"price" },
  { key:"cmp", title:"CMP", width:70, type:"price" },
  { key:"holdingQty", title:"HOLD", width:70, type:"number" },
  { key:"investedValue", title:"INVESTED", width:95, type:"price" },
  { key:"holdingValue", title:"H.VALUE", width:95, type:"price" },
  { key:"unrealizedPnL", title:"UNREAL", width:90, type:"price" },
  { key:"unrealizedPct", title:"UNREAL %", width:85, type:"percent" },
  { key:"netRealized", title:"REALIZED", width:90, type:"price" }
];

export default function TradingLedgerPage(){

    const { data } = usePortfolio();

    const trades: any[] = (data?.trades as any[]) ?? [];

    const symbols: string[] = [...new Set(
        trades.map(
            (trade:any): string => String(trade.symbol)
        )
    )];

const {
    prices
} =
    usePortfolioMarketData(
        symbols
    );

const rows =
        buildPortfolioLedger(
        trades,
        prices
    );

    const summary=
        buildPortfolioSummary(rows);

    return(

        <div className="h-screen bg-slate-950 flex flex-col">

            <>
    <div className="text-white p-4">
        Trades : {trades.length}
        <br />
        Rows : {rows.length}
    </div>

    <div className="flex-1 min-h-0 overflow-hidden"><InstitutionalGrid
        columns={columns}
        rows={rows}
    /></div></>

        </div>

    );

}



















