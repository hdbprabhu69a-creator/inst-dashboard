import { Page } from "playwright";
import { DELIVERY_CONFIG } from "./config";

export class NseDeliveryNavigator {
  constructor(private readonly page: Page) {}

  async openReportsHome(): Promise<void> {
    console.log("[Delivery] Opening NSE homepage...");

    await this.page.goto("https://www.nseindia.com", {
      waitUntil: "domcontentloaded",
      timeout: DELIVERY_CONFIG.NAVIGATION_TIMEOUT,
    });

    await this.page.waitForTimeout(3000);

    console.log("[Delivery] Opening All Reports...");

    await this.page.goto("https://www.nseindia.com/all-reports", {
      waitUntil: "domcontentloaded",
      timeout: DELIVERY_CONFIG.NAVIGATION_TIMEOUT,
    });

    this.page.on("request", r => {
  console.log("[REQ]", r.method(), r.url());
});

this.page.on("response", async r => {
  console.log("[RES]", r.status(), r.url());
});
    await this.page.waitForTimeout(5000);

this.page.on("response", async r => {
  const u = r.url();
  if (
    u.includes("sec_bhavdata_full") ||
    u.includes(".csv") ||
    u.includes("report")
  ) {
    console.log("[NET]", r.status(), u);
  }
});

    console.log("[Delivery] All Reports loaded.");

await this.page.screenshot({
  path: "logs/playwright/all-reports-page.png",
  fullPage: true
});

const html = await this.page.content();

require("fs").writeFileSync(
  "logs/playwright/all-reports-page.html",
  html,
  "utf8"
);

console.log("[Delivery] HTML saved.");
  }

  async dismissCookieBanner(): Promise<void> {
    const buttons = [
      "button:has-text('Accept')",
      "button:has-text('I Agree')",
      "button:has-text('Agree')",
      "#accept",
      ".cookie-accept",
    ];

    for (const selector of buttons) {
      try {
        const btn = this.page.locator(selector).first();

        if (await btn.isVisible({ timeout: 1000 })) {
          await btn.click();
          console.log("[Delivery] Cookie banner dismissed.");
          return;
        }
      } catch {}
    }
  }

  async searchReport(): Promise<void> {
    return;
  }

  async downloadReport(): Promise<string> {
  await this.page.waitForTimeout(5000);

  const links = await this.page.locator("a").evaluateAll(elements =>
    elements.map(e => ({
      href: (e as HTMLAnchorElement).href || "",
      text: (e.textContent || "").trim(),
      download: (e as HTMLAnchorElement).getAttribute("download") || ""
    }))
  );

  console.log("[Delivery] Links found:", links);

  const match = links.find(x =>
    /sec_bhavdata_full_\d{8}\.csv/i.test(x.href) ||
    /sec_bhavdata_full_\d{8}\.csv/i.test(x.download) ||
    /sec_bhavdata_full_\d{8}\.csv/i.test(x.text)
  );

  const url = match?.href;

  if (!url) {
    throw new Error("Security Deliverable CSV not found.");
  }

  console.log("[Delivery] URL:", url);

  return url;
  }
}


