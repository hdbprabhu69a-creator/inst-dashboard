import { NextResponse } from "next/server";
import { DeliveryDownloader, DownloadValidator } from "@/lib/delivery";
import {
  extractDeliveryZip,
  validateExtractedCsv
} from "@/src/lib/deliveryImportEngine";
import { importDeliveryCsv } from "@/src/lib/sharedDeliveryImporter";

export async function GET() {

  try {

    console.log("[1] Creating Downloader");
    const downloader = new DeliveryDownloader();
    console.log("[2] Starting Download");
    const result = await downloader.download();
    console.log("[3] Download Complete", result);

    if (!result.success || !result.filePath) {
      return NextResponse.json(
        { success:false, stage:"download", result },
        { status:500 }
      );
    }

    console.log("[4] Validating ZIP");
    const validator = new DownloadValidator();
    const validation = validator.validate(result.filePath);
    console.log("[5] Validation", validation);

    if (!validation.valid) {
      return NextResponse.json(
        { success:false, stage:"validation", validation },
        { status:400 }
      );
    }

    const extraction = {
      success: true,
      zipFile: result.filePath,
      csvFile: result.filePath,
      extractedDir: ""
    };

    console.log("[6] CSV Download - Extraction skipped");

    console.log("[7] Validating CSV");
    if (!validateExtractedCsv(result.filePath)) {
      return NextResponse.json(
        { success:false, stage:"csv-validation" },
        { status:400 }
      );
    }

    console.log("[8] Importing Firestore");
    const imported =
      await importDeliveryCsv(
        result.filePath
      );

    return NextResponse.json({

      success:true,

      stage:"completed",

      download:result,

      validation,

      extraction,

      imported

    });

  } catch (error) {
    console.error("[DELIVERY ERROR]", error);

    return NextResponse.json(
      {
        success:false,
        error:error instanceof Error
          ? error.message
          : String(error)
      },
      { status:500 }
    );

  }

}




