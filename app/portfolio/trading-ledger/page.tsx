"use client";


import { usePortfolio } from "@/hooks/portfolio/usePortfolio";
import InstitutionalGrid from "@/app/institutional-analysis/components/grid/InstitutionalGrid";
import type { GridColumn } from "@/app/institutional-analysis/components/grid/GridTypes";

const columns: GridColumn[] = [
  { key:"tradeDate", title:"DATE", width:75, type:"text" },
  { key:"symbol", title:"STOCK", width:90, type:"text" },
  { key:"action", title:"ACTION", width:65, type:"badge" },
  { key:"quantity", title:"QTY", width:55, type:"number" },
  { key:"buyPrice", title:"BUY", width:75, type:"price" },
  { key:"sellPrice", title:"SELL", width:75, type:"price" },
  { key:"tradeValue", title:"VALUE", width:85, type:"price" },
  { key:"holdingQty", title:"HOLD", width:70, type:"number" },
  { key:"averageCost", title:"AVG", width:70, type:"price" },
  { key:"tradePnL", title:"P/L", width:70, type:"price" },
  { key:"totalProfit", title:"PROFIT", width:80, type:"price" },
  { key:"totalLoss", title:"LOSS", width:80, type:"price" },
  { key:"netRealized", title:"REALIZED", width:90, type:"price" },
  { key:"unrealizedPnL", title:"UNREAL", width:90, type:"price" },
  { key:"holdingValue", title:"H.VALUE", width:90, type:"price" },
  { key:"remarks", title:"REMARKS", width:90, type:"text" },
];

export default function TradingLedgerPage() {

  const { data } = usePortfolio();

  const trades = data?.trades ?? [];

const rows = Object.values(
  trades.reduce((acc: any, trade: any) => {

    const id = trade.order_id;

    if (!acc[id]) {
      acc[id] = {
        id,
        DATE: trade.exchange_timestamp ?? trade.fill_timestamp,
        STOCK: trade.tradingsymbol,
        ACTION: trade.transaction_type,
        qty: 0,
        value: 0,
        REMARKS: trade.product,
      };
    }

    acc[id].qty += Number(trade.quantity ?? 0);
    acc[id].value +=
      Number(trade.quantity ?? 0) *
      Number(trade.average_price ?? 0);

    return acc;

  }, {})
).map((r: any) => {

  const avg =
    r.qty === 0
      ? 0
      : r.value / r.qty;

  return {
    tradeDate: r.DATE ? new Date(r.DATE).toLocaleDateString("en-GB") : "",
    symbol: r.STOCK,
    action: r.ACTION,
    quantity: r.qty,
    buyPrice: r.ACTION==="BUY" ? avg.toFixed(2) : "",
    sellPrice: r.ACTION==="SELL" ? avg.toFixed(2) : "",
    tradeValue: r.value.toFixed(2),
    holdingQty: "",
    averageCost: "",
    tradePnL: "",
    totalProfit: "",
    totalLoss: "",
    netRealized: "",
    unrealizedPnL: "",
    holdingValue: "",
    remarks: r.REMARKS,
  };

});
  console.log(rows);

return (
    <div className="h-screen bg-slate-950 p-0 overflow-hidden">
      <InstitutionalGrid
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
















