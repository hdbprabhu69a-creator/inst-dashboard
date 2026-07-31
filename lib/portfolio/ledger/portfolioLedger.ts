import type {
    PortfolioLedgerRow,
    TradeRecord
} from "./ledgerTypes";

import { buildOrderLedger } from "./orderLedger";
import { PositionEngine } from "./positionEngine";
import { PnlEngine } from "./pnlEngine";
import { updateMarketValue } from "./marketValue";

export function buildPortfolioLedger(
    trades:TradeRecord[],
    marketPrices:Record<string,number>={}
):PortfolioLedgerRow[]{

    const orders = buildOrderLedger(trades);

    const positions=new PositionEngine();

    const pnl=new PnlEngine();

    const rows:PortfolioLedgerRow[]=[];

    for(const order of orders){

        let position=positions.update(order);

        position=pnl.update(position,order);

        const marketPrice=
            marketPrices[order.symbol] ??
            order.averagePrice;

        position=updateMarketValue(
            position,
            marketPrice
        );

        console.log({
symbol:order.symbol,
side:order.side,
averagePrice:order.averagePrice,
tradeValue:order.tradeValue,
quantity:order.quantity
});

rows.push({

            tradeDate:order.tradeDate,

            symbol:order.symbol,

            action:order.side,

            quantity:order.quantity,

            buyPrice:
                order.side==="BUY"
                    ?Number(order.averagePrice.toFixed(2))
                    :"",

            sellPrice:
                order.side==="SELL"
                    ?Number(order.averagePrice.toFixed(2))
                    :"",

            tradeAvg:Number(order.averagePrice.toFixed(2)),

            tradeValue:Number(order.tradeValue.toFixed(2)),

            holdingQty:Number(position.holdingQty),

            averageCost:Number(position.averageCost.toFixed(2)),

            cmp:Number(marketPrice.toFixed(2)),

            unrealizedPct:
                position.averageCost===0
                    ?0
                    :Number(
                        (
                            (
                                marketPrice-position.averageCost
                            )/
                            position.averageCost*100
                        ).toFixed(2)
                    ),

            tradePnL:Number(position.realizedPnL.toFixed(2)),

            totalProfit:Number(position.totalProfit.toFixed(2)),

            totalLoss:Number(position.totalLoss.toFixed(2)),

            netRealized:Number(position.realizedPnL.toFixed(2)),

            unrealizedPnL:Number(position.unrealizedPnL.toFixed(2)),

            investedValue:Number((position.holdingQty*position.averageCost).toFixed(2)),

            holdingValue:Number(position.holdingValue.toFixed(2)),

            remarks:order.orderNo

        });

    }

    return rows.sort((a,b)=>{

    const [ad,am,ay]=a.tradeDate.split("/").map(Number);
    const [bd,bm,by]=b.tradeDate.split("/").map(Number);

    const da=new Date(ay,am-1,ad).getTime();
    const db=new Date(by,bm-1,bd).getTime();

    return db-da;

});

}

















