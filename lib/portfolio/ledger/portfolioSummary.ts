import type { PortfolioLedgerRow } from "./ledgerTypes";

export function buildPortfolioSummary(
    rows:PortfolioLedgerRow[]
){

    return{

        invested:
            rows.reduce(
                (t,r)=>t+r.tradeValue,
                0
            ),

        holdingValue:
            rows.reduce(
                (t,r)=>t+r.holdingValue,
                0
            ),

        realized:
            rows.reduce(
                (t,r)=>t+r.netRealized,
                0
            ),

        unrealized:
            rows.reduce(
                (t,r)=>t+r.unrealizedPnL,
                0
            )

    };

}

