import { NextResponse } from "next/server";

import { getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";
import { getHistory } from "@/institutional-analysis/repository/historyRepository";
import { analyzeTrend } from "@/institutional-analysis/engine/priceStructure/analyzeTrend";
import { volumeAnalysis } from "@/institutional-analysis/engine/volume/volumeAnalysis";

export async function GET(req: Request) {

    try {

        const { searchParams } = new URL(req.url);

        const symbol = searchParams.get("symbol");

        if (!symbol) {

            return NextResponse.json(
                {
                    success: false,
                    error: "symbol required"
                },
                {
                    status: 400
                }
            );

        }

        const upper = symbol.toUpperCase();

        const ms: any = await getMarketStructure(upper);

        if (!ms) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Market structure not found"
                },
                {
                    status: 404
                }
            );

        }

        const candles = await getHistory(upper);

        const trend =
            candles.length >= 30
                ? analyzeTrend(candles)
                : null;

        const volume =
            candles.length >= 20
                ? volumeAnalysis(candles)
                : null;

        return NextResponse.json({

            success: true,

            symbol: upper,

            data: {

                cmp: ms.cmp ?? ms.dailyOHLC?.close ?? null,

                pivot: ms.pivot ?? null,

                cpr: ms.cpr ?? null,

                trend,

                volume

            }

        });

    } catch (e: any) {

        return NextResponse.json(
            {
                success: false,
                error: e.message
            },
            {
                status: 500
            }
        );

    }

}

