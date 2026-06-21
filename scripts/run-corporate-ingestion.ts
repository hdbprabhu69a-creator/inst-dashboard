import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function runCorporateIngestion() {
  console.log(
    "================================="
  );
  console.log(
    "CORPORATE INGESTION STARTED"
  );
  console.log(
    "================================="
  );

  try {
    console.log("Running NSE Ingestion...");

    try {
      const nseModule = await import(
        "../lib/corporate/ingest-nse"
      );

      if (
        typeof nseModule.ingestNSE ===
        "function"
      ) {
        await nseModule.ingestNSE();
      }
    } catch (error) {
      console.log(
        "NSE ingestion not available yet"
      );
    }

    console.log("Running BSE Ingestion...");

    try {
      const bseModule = await import(
        "../lib/corporate/ingest-bse"
      );

      if (
        typeof bseModule.ingestBSE ===
        "function"
      ) {
        await bseModule.ingestBSE();
      }
    } catch (error) {
      console.log(
        "BSE ingestion not available yet"
      );
    }

    console.log(
      "================================="
    );
    console.log(
      "CORPORATE INGESTION COMPLETED"
    );
    console.log(
      "================================="
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runCorporateIngestion()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });