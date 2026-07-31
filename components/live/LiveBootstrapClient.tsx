"use client";

import { useEffect } from "react";

import {
    startLiveBootstrap,
    stopLiveBootstrap,
} from "@/lib/live/liveBootstrap";

export default function LiveBootstrapClient() {

    useEffect(() => {

        startLiveBootstrap();

        return () => {

            stopLiveBootstrap();

        };

    }, []);

    return null;

}

