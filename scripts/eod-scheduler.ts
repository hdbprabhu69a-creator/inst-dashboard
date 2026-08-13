import {
    runPendingEODIfRequired,
} from "../lib/startup/eodRecovery";

async function runStartupRecovery() {

    console.log(
        "============================================"
    );

    console.log(
        "[AUTO POWER] STARTUP EOD CHECK"
    );

    console.log(
        "============================================"
    );

    try {

        const result =
            await runPendingEODIfRequired();

        console.log(
            "[AUTO POWER] Startup EOD result:",
            result
        );

    } catch (error) {

        console.error(
            "[AUTO POWER] Startup EOD failed:",
            error
        );

    }

}

export function startEodScheduler() {

    console.log(
        "[AUTO POWER] EOD startup check enabled"
    );

    void runStartupRecovery();

}