import { chromium, Browser, BrowserContext, Page } from "playwright";
import { DELIVERY_CONFIG } from "./config";

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async launch(): Promise<Page> {
    this.browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      channel: "chrome",
      headless: DELIVERY_CONFIG.HEADLESS,
      args: [
        "--disable-http2",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-blink-features=AutomationControlled",
        "--start-maximized",
        "--no-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    this.context = await this.browser.newContext({
      acceptDownloads: true,
      viewport: { width: 1600, height: 900 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36"
    });

    this.page = await this.context.newPage();

    this.page.setDefaultTimeout(DELIVERY_CONFIG.TIMEOUT);
    this.page.setDefaultNavigationTimeout(
      DELIVERY_CONFIG.NAVIGATION_TIMEOUT
    );

    this.page.on("console", msg => {
      console.log("[Playwright]", msg.type(), msg.text());
    });

    this.page.on("pageerror", err => {
      console.error("[Playwright Error]", err);
    });

    this.page.on("requestfailed", req => {
      console.warn(
        "[Request Failed]",
        req.method(),
        req.url(),
        req.failure()?.errorText
      );
    });

    return this.page;
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error("Browser not launched.");
    }
    return this.page;
  }

  async close(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();

    this.page = null;
    this.context = null;
    this.browser = null;
  }
}




