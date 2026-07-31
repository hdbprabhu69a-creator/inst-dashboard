import type { OrderLedgerRow, TradeRecord } from "./ledgerTypes";

export function buildOrderLedger(
    trades: TradeRecord[]
): OrderLedgerRow[] {

    const orders = new Map<string, OrderLedgerRow>();

    for (const trade of trades) {

        let order = orders.get(trade.orderNo);

        if (!order) {

            order = {

                orderNo: trade.orderNo,

                tradeDate: trade.tradeDate,

                tradeTime: trade.tradeTime,

                symbol: trade.symbol,

                side: trade.side,

                quantity: 0,

                averagePrice: 0,

                tradeValue: 0,

                brokerage: 0

            };

            orders.set(trade.orderNo, order);

        }

        order.quantity += Number(trade.quantity);

        order.tradeValue += Number(trade.price) * Number(trade.quantity);

        order.brokerage += Number(trade.brokerage);

    }

    for (const order of orders.values()) {

        order.averagePrice =
            order.quantity === 0
                ? 0
                : Number((order.tradeValue / order.quantity).toFixed(4));

    }

    return [...orders.values()]
        .sort((a, b) => {

            const [ad, am, ay] = a.tradeDate.split("/").map(Number);
        const [bd, bm, by] = b.tradeDate.split("/").map(Number);

        const [ah, ai, as] = a.tradeTime.split(":").map(Number);
        const [bh, bi, bs] = b.tradeTime.split(":").map(Number);

        const da = new Date(ay, am - 1, ad, ah, ai, as).getTime();
        const db = new Date(by, bm - 1, bd, bh, bi, bs).getTime();

        return da - db;

        });

}




