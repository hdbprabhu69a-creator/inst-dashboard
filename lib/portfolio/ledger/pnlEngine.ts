import type {
    OrderLedgerRow,
    PositionState
} from "./ledgerTypes";

export class PnlEngine{

    update(
        position:PositionState,
        order:OrderLedgerRow
    ):PositionState{

        if(order.side==="BUY"){

            return{

                ...position,

                realizedPnL:Number(position.realizedPnL.toFixed(2)),

                totalProfit:Number(position.totalProfit.toFixed(2)),

                totalLoss:Number(position.totalLoss.toFixed(2))

            };

        }

        const pnl=
            (
                order.averagePrice-
                position.averageCost
            )*
            order.quantity;

        position.realizedPnL+=pnl;

        if(pnl>=0){

            position.totalProfit+=pnl;

        }
        else{

            position.totalLoss+=Math.abs(pnl);

        }

        return{

            ...position,

            realizedPnL:Number(position.realizedPnL.toFixed(2)),

            totalProfit:Number(position.totalProfit.toFixed(2)),

            totalLoss:Number(position.totalLoss.toFixed(2))

        };

    }

}
