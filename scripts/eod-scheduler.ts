import cron from "node-cron";

import {
  runPendingEODIfRequired,
} from "../lib/startup/eodRecovery";

const BASE_URL =
  "http://localhost:3000";

const HISTORY_API =
  `${BASE_URL}/api/kite/populate-history`;


/*
 * AUTO POWER
 *
 * Wait until Next.js is actually ready.
 *
 * This is important because this scheduler can
 * start at the same time as npm run dev/start.
 */
async function waitForServer(
  retries = 30,
  delayMs = 2000
) {

  for (
    let attempt = 1;
    attempt <= retries;
    attempt++
  ) {

    try {

      const response =
        await fetch(
          `${BASE_URL}/live-dashboard`,
          {
            cache: "no-store",
          }
        );

      if (
        response.ok
      ) {

        console.log(
          "[AUTO POWER] Next.js server ready."
        );

        return true;
      }

    } catch {
      // Server is still starting.
    }

    console.log(
      `[AUTO POWER] Waiting for Next.js... ${attempt}/${retries}`
    );

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          delayMs
        )
    );

  }

  return false;

}


/*
 * AUTO POWER
 *
 * Populate history before EOD.
 */
async function updateHistory() {

  console.log(
    "[AUTO POWER] Updating history..."
  );

  const response =
    await fetch(
      HISTORY_API,
      {
        cache: "no-store",
      }
    );

  if (
    !response.ok
  ) {

    throw new Error(
      `History HTTP ${response.status}`
    );

  }

  const result =
    await response.json();

  console.log(
    "[AUTO POWER] History completed:",
    result
  );

  return result;

}


/*
 * AUTO POWER
 *
 * Complete startup recovery.
 *
 * This is what catches an EOD missed because
 * the machine/server was switched off.
 */
async function runStartupRecovery() {

  console.log(
    "============================================"
  );

  console.log(
    "[AUTO POWER] STARTUP RECOVERY"
  );

  console.log(
    "============================================"
  );

  const ready =
    await waitForServer();

  if (!ready) {

    throw new Error(
      "Next.js server did not become ready."
    );

  }

  /*
   * First make sure Firestore history contains
   * the latest completed trading day.
   */
  await updateHistory();

  /*
   * Then compare latest market date with
   * settings/eodStatus.lastRunDate.
   */
  const result =
    await runPendingEODIfRequired();

  console.log(
    "[AUTO POWER] Startup recovery result:",
    result
  );

}


/*
 * AUTO POWER
 *
 * Start recovery when this scheduler starts.
 */
void runStartupRecovery()
  .catch(
    (error) => {

      console.error(
        "[AUTO POWER] Startup recovery failed:",
        error
      );

    }
  );


/*
 * DAILY BACKUP SCHEDULER
 *
 * 15:40 IST
 * Monday-Friday
 *
 * Even if startup recovery already ran,
 * runPendingEODIfRequired() prevents a duplicate.
 */
cron.schedule(

  "40 15 * * 1-5",

  async () => {

    try {

      console.log(
        "============================================"
      );

      console.log(
        "[AUTO POWER] 15:40 SCHEDULED CHECK"
      );

      console.log(
        "============================================"
      );

      await updateHistory();

      const result =
        await runPendingEODIfRequired();

      console.log(
        "[AUTO POWER] Scheduled result:",
        result
      );

    } catch (error) {

      console.error(
        "[AUTO POWER] Scheduled recovery failed:",
        error
      );

    }

  },

  {
    timezone:
      "Asia/Kolkata",
  }

);


console.log(
  "[AUTO POWER] EOD Scheduler Running"
);

console.log(
  "[AUTO POWER] Startup recovery enabled"
);

console.log(
  "[AUTO POWER] Daily 15:40 IST recovery enabled"
);

