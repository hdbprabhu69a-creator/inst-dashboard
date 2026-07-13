import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium, type BrowserContext, type Page } from "playwright";

import { NSE_REPORT_CONFIG } from "./config";
import { getNseTradingDayStatus } from "./marketCalendar";

type BrowserLog = {
  at: string;
  kind: "console" | "request" | "response" | "requestfailed";
  message: string;
  url?: string;
  status?: number;
};

function artifactId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function artifactPath(folder: keyof typeof NSE_REPORT_CONFIG.artifacts, id: string, extension: string) {
  const artifactFolder = NSE_REPORT_CONFIG.artifacts[folder];
  return path.join(NSE_REPORT_CONFIG.artifacts.root, artifactFolder, `${id}.${extension}`);
}

async function captureFailureArtifacts(
  context: BrowserContext,
  page: Page,
  browserLog: BrowserLog[],
  id: string,
) {
  const targets = {
    screenshot: artifactPath("screenshots", id, "png"),
    html: artifactPath("html", id, "html"),
    trace: artifactPath("traces", id, "zip"),
    network: artifactPath("network", id, "json"),
  };
  await Promise.all(Object.values(targets).map((target) => mkdir(path.dirname(target), { recursive: true })));

  // A page can be partially closed after a navigation failure. Preserve every
  // artifact that is still available instead of masking the original error.
  await Promise.allSettled([
    page.screenshot({ path: targets.screenshot, fullPage: true }),
    page.content().then((html) => writeFile(targets.html, html, "utf8")),
    writeFile(targets.network, JSON.stringify(browserLog, null, 2), "utf8"),
  ]);
  await context.tracing.stop({ path: targets.trace }).catch(() => undefined);

  return targets;
}

function attachBrowserLogging(page: Page, browserLog: BrowserLog[]) {
  const add = (entry: BrowserLog) => browserLog.push(entry);
  page.on("console", (message) =>
    add({ at: new Date().toISOString(), kind: "console", message: `[${message.type()}] ${message.text()}` }),
  );
  page.on("request", (request) =>
    add({ at: new Date().toISOString(), kind: "request", message: request.method(), url: request.url() }),
  );
  page.on("response", (response) =>
    add({ at: new Date().toISOString(), kind: "response", message: response.request().method(), url: response.url(), status: response.status() }),
  );
  page.on("requestfailed", (request) =>
    add({ at: new Date().toISOString(), kind: "requestfailed", message: request.failure()?.errorText ?? "request failed", url: request.url() }),
  );
}

export type NseReportDownloadResult =
  | { status: "downloaded"; date: string; filePath: string }
  | { status: "skipped"; date: string; reason: "weekend" | "nse-holiday" };

/** Downloads the NSE-exclusive CSV through its public report page UI. */
export async function downloadNseFiiDiiReport(): Promise<NseReportDownloadResult> {
  const browser = await chromium.launch({ headless: true });
  let context: BrowserContext | undefined;
  let page: Page | undefined;
  const browserLog: BrowserLog[] = [];
  const id = artifactId();

  try {
    context = await browser.newContext({ userAgent: NSE_REPORT_CONFIG.navigation.userAgent });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    page = await context.newPage();
    attachBrowserLogging(page, browserLog);

    const marketDay = await getNseTradingDayStatus(page);
    if (!marketDay.isTradingDay) {
      await context.tracing.stop();
      return { status: "skipped", date: marketDay.date, reason: marketDay.reason };
    }

    await page.goto(NSE_REPORT_CONFIG.urls.fiiDiiReport, {
      waitUntil: NSE_REPORT_CONFIG.navigation.waitUntil,
      timeout: NSE_REPORT_CONFIG.navigation.timeoutMs,
    });

    const reportHeading = page.getByText(NSE_REPORT_CONFIG.selectors.fiiDiiNseHeading, { exact: true });
    await reportHeading.waitFor({ state: "visible", timeout: NSE_REPORT_CONFIG.navigation.timeoutMs });

    // Select the download associated with the NSE-only report heading. This
    // follows the UI relationship and never infers readiness from a filename
    // rendered elsewhere on the page.
    const downloadLink = reportHeading.locator(
      `xpath=following::a[normalize-space(.)='${NSE_REPORT_CONFIG.selectors.downloadLinkText}'][1]`,
    );
    await downloadLink.waitFor({ state: "visible", timeout: NSE_REPORT_CONFIG.navigation.timeoutMs });
    const download = await Promise.all([
      page.waitForEvent("download", { timeout: NSE_REPORT_CONFIG.navigation.downloadTimeoutMs }),
      downloadLink.click(),
    ]).then(([event]) => event);

    const outputDirectory = NSE_REPORT_CONFIG.outputDirectory;
    await mkdir(outputDirectory, { recursive: true });
    const filePath = path.join(outputDirectory, `nse-fii-dii-${marketDay.date}.csv`);
    await download.saveAs(filePath);
    await context.tracing.stop();
    return { status: "downloaded", date: marketDay.date, filePath };
  } catch (error) {
    const artifactPaths = context && page
      ? await captureFailureArtifacts(context, page, browserLog, id)
      : undefined;
    const details = artifactPaths ? ` Failure artifacts: ${JSON.stringify(artifactPaths)}.` : "";
    throw new Error(`NSE FII/DII report download failed.${details}`, { cause: error });
  } finally {
    await context?.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
}
