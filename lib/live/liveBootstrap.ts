import { liveEngine } from "./liveEngine";

let started = false;
let source: EventSource | null = null;

export function startLiveBootstrap() {

    if (started) return;

    started = true;

    source = new EventSource(
        "/api/live/stream"
    );

    source.onopen = () => {

        console.log(
            "[LiveBootstrap] Connected"
        );

    };

    source.onmessage = (event) => {

        try {

            const tick =
                JSON.parse(event.data);

            liveEngine.processTick(tick);

        } catch (err) {

            console.error(err);

        }

    };

    source.onerror = () => {

        console.log(
            "[LiveBootstrap] Disconnected"
        );

    };

}

export function stopLiveBootstrap() {

    source?.close();

    source = null;

    started = false;

}
