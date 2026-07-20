import type { PositionState } from "./ledgerTypes";

export function updateMarketValue(
    position: PositionState,
    marketPrice: number
): PositionState {

    const holdingValue =
        Number(
            (
                position.holdingQty *
                marketPrice
            ).toFixed(2)
        );

    const costValue =
        Number(
            (
                position.holdingQty *
                position.averageCost
            ).toFixed(2)
        );

    const unrealizedPnL =
        Number(
            (
                holdingValue -
                costValue
            ).toFixed(2)
        );

    return {

        ...position,

        holdingValue,

        unrealizedPnL

    };

}
