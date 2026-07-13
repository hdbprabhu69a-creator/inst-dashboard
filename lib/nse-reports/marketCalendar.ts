import type { Page } from "playwright";

import { NSE_REPORT_CONFIG } from "./config";

const MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

function istDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: NSE_REPORT_CONFIG.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return {
    iso: `${part("year")}-${part("month")}-${part("day")}`,
    weekday: part("weekday"),
  };
}

function holidaysFromCalendarText(calendarText: string) {
  const holidays = new Set<string>();
  const matches = calendarText.matchAll(/\b(\d{1,2})-([A-Za-z]{3})-(\d{4})\b/g);

  for (const match of matches) {
    const [, day, monthName, year] = match;
    const month = MONTHS[monthName.toLowerCase()];
    if (month) holidays.add(`${year}-${month}-${day.padStart(2, "0")}`);
  }

  return holidays;
}

/**
 * Uses NSE's Market Timings & Holidays UI, then evaluates the displayed
 * calendar. Weekends are always non-trading days; NSE-published holidays are
 * read fresh for every browser run.
 */
export async function getNseTradingDayStatus(page: Page, date = new Date()) {
  const target = istDateParts(date);
  if (target.weekday === "Sat" || target.weekday === "Sun") {
    return { isTradingDay: false, reason: "weekend", date: target.iso } as const;
  }

  await page.goto(NSE_REPORT_CONFIG.urls.marketCalendar, {
    waitUntil: NSE_REPORT_CONFIG.navigation.waitUntil,
    timeout: NSE_REPORT_CONFIG.navigation.timeoutMs,
  });
  await page
    .getByText(NSE_REPORT_CONFIG.selectors.calendarEquitiesHeading, { exact: false })
    .first()
    .waitFor({ state: "visible", timeout: NSE_REPORT_CONFIG.navigation.timeoutMs });

  const calendarText = await page.locator("body").innerText();
  const holidays = holidaysFromCalendarText(calendarText);
  if (holidays.has(target.iso)) {
    return { isTradingDay: false, reason: "nse-holiday", date: target.iso } as const;
  }

  return { isTradingDay: true, reason: "trading-day", date: target.iso } as const;
}
