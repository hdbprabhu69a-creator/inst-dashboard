"use client";

import { useMemo } from "react";
import { synchronizeChartCandles } from "@/lib/liveChart/liveChartSync";

export function useChartLiveSync(history:any[]){
    return useMemo(
        ()=>synchronizeChartCandles(history),
        [history]
    );
}

