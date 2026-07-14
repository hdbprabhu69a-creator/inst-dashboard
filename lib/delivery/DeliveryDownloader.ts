import path from "path";
import { BrowserManager } from "./BrowserManager";
import { NseDeliveryNavigator } from "./NseDeliveryNavigator";
import { DELIVERY_CONFIG } from "./config";
import type { DownloadResult } from "./types";

export class DeliveryDownloader {
  async download(): Promise<DownloadResult> {
    const started = Date.now();
    const browser = new BrowserManager();

    try {
      const page = await browser.launch();

      const navigator = new NseDeliveryNavigator(page);

      await navigator.openReportsHome();

      const response = await page.request.get(
        "https://www.nseindia.com/api/daily-reports?key=CM"
      );

      const json = await response.json();

      require("fs").writeFileSync(
        "logs/playwright/daily-reports.json",
        JSON.stringify(json, null, 2),
        "utf8"
      );

      console.log("[Delivery] daily-reports.json saved.");
      await navigator.dismissCookieBanner();

      const reports = await response.json();

      const allReports = Object.values(reports).flat() as any[];

      const today = new Date();
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const tradingDate = `${today.getDate()}-${months[today.getMonth()]}-${today.getFullYear()}`;

      const target = allReports.find((r:any)=>
        r.displayName==="Full Bhavcopy and Security Deliverable data" &&
        r.tradingDate===tradingDate
      );

      if(!target){
        throw new Error("Today's Security Deliverable CSV not found.");
      }

      const fileName = target.fileActlName;
      const filePath = path.join(DELIVERY_CONFIG.DOWNLOAD_DIR,fileName);

      const fileResponse = await page.request.get(
        target.filePath + target.fileActlName
      );

      if(!fileResponse.ok()){
        throw new Error(`Download failed: ${fileResponse.status()}`);
      }

      require("fs").writeFileSync(
        filePath,
        Buffer.from(await fileResponse.body())
      );

      return {
        success: true,
        fileName,
        filePath,
        downloadedAt: new Date(),
        durationMs: Date.now() - started,
        attempts: 1
      };
    } catch (error) {
      return {
        success: false,
        durationMs: Date.now() - started,
        attempts: 1,
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      await browser.close();
    }
  }
}






