import type {
    OrderLedgerRow,
    PositionState
} from "./ledgerTypes";

export class PositionEngine {

    private readonly positions = new Map<string, PositionState>();

    update(
        order: OrderLedgerRow
    ): PositionState {

        let position = this.positions.get(order.symbol);

        if (!position) {

            position = {

                symbol: order.symbol,

                holdingQty: 0,

                averageCost: 0,

                tradeAvg: 0,

                holdingValue: 0,

                realizedPnL: 0,

                unrealizedPnL: 0,

                totalProfit: 0,

                totalLoss: 0

            };

            this.positions.set(order.symbol, position);

        }

        if (order.side === "BUY") {

            const existingValue =
                position.holdingQty *
                position.averageCost;

            const newValue =
                order.quantity *
                order.averagePrice;

            position.holdingQty += order.quantity;

            position.averageCost =
                position.holdingQty === 0
                    ? 0
                    : (existingValue + newValue) /
                      position.holdingQty;

        } else {

            position.holdingQty -= order.quantity;

            if (position.holdingQty < 0) {

                position.holdingQty = 0;

            }

            if (position.holdingQty === 0) {

                position.averageCost = 0;

            }

        }

        position.tradeAvg = order.averagePrice;

        position.holdingValue =
            Number(
                (
                    position.holdingQty *
                    position.averageCost
                ).toFixed(2)
            );

        return {
            ...position
        };

    }

    get(
        symbol: string
    ): PositionState | undefined {

        return this.positions.get(symbol);

    }

    getAll(): PositionState[] {

        return [...this.positions.values()];

    }

}

