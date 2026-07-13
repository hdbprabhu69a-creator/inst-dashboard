/**
 * The NSE report UI is the single source of truth for the Phase 2 browser
 * workflow. Keep URLs, visible labels, and browser-navigation behaviour here
 * so a change to NSE's site is reviewed in one place.
 */
export const NSE_REPORT_CONFIG = {
  timezone: "Asia/Kolkata",
  urls: {
    fiiDiiReport: "https://www.nseindia.com/reports/fii-dii",
    marketCalendar:
      "https://www.nseindia.com/resources/exchange-communication-holidays",
  },
  navigation: {
    timeoutMs: 45_000,
    downloadTimeoutMs: 30_000,
    waitUntil: "domcontentloaded" as const,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  },
  selectors: {
    // Public NSE labels, not generated classes, IDs, or report filenames.
    calendarEquitiesHeading: "Holidays for the calendar year",
    fiiDiiNseHeading:
      "FII/FPI & DII trading activity on NSE in Capital Market Segment",
    downloadLinkText: "Download (.csv)",
  },
  artifacts: {
    root: "logs/playwright",
    screenshots: "screenshots",
    html: "html",
    traces: "traces",
    network: "network",
  },
  outputDirectory: "data/nse-reports",
  retry: {
    // Times are IST. Override with NSE_REPORT_RETRY_TIMES=16:35,16:45,...
    times: ["16:35", "16:45", "17:00", "17:15", "17:30", "18:00"],
    // No further report attempts are made after this IST time.
    cutoff: "18:00",
  },
} as const;

export type NseSelectorName = keyof typeof NSE_REPORT_CONFIG.selectors;
