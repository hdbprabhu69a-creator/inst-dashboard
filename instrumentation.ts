const AUTO_POWER_KEY =
  "__INST_AUTO_POWER_STARTED__";

export async function register() {

  if (
    process.env.NEXT_RUNTIME !==
    "nodejs"
  ) {
    return;
  }

  const globalState =
    globalThis as typeof globalThis & {
      [AUTO_POWER_KEY]?: boolean;
    };

  if (
    globalState[AUTO_POWER_KEY]
  ) {
    return;
  }

  globalState[AUTO_POWER_KEY] =
    true;

  setTimeout(
    async () => {

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

        const {
          runPendingEODIfRequired,
        } = await import(
          "@/lib/startup/eodRecovery"
        );

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

    },
    10000
  );
}
