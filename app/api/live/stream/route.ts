import { liveTickHub } from "@/lib/server/stream/LiveTickHub";
import { ensureLiveServerStarted } from "@/lib/server/bootstrap/liveServerBootstrap";

export async function GET(request: Request) {

  await ensureLiveServerStarted();

  const encoder = new TextEncoder();

  let unsubscribe = () => {};

  const stream = new ReadableStream({

    start(controller) {

      let closed = false;

      const cleanup = () => {

        if (closed) return;

        closed = true;

        unsubscribe();

        try {
          controller.close();
        } catch {}

        console.log("[SSE] Client closed");

      };

      request.signal.addEventListener(
        "abort",
        cleanup,
        { once: true }
      );

      controller.enqueue(
        encoder.encode(": connected\n\n")
      );

      unsubscribe = liveTickHub.subscribe((tick:any) => {

        if (closed) return;

        try {

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify(tick)}\n\n`
            )
          );

        } catch {

          cleanup();

        }

      });

    },

    cancel() {

      unsubscribe();

    }

  });

  return new Response(stream,{
    headers:{
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache, no-transform",
      "Connection":"keep-alive",
    },
  });

}

