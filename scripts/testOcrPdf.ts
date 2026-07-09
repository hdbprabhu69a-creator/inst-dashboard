import { extractPageText } from "../lib/newspaper/parser/ocrPdfParser";

async function main() {

    const pdf = process.argv[2];

    if (!pdf) {
        console.error("Usage: npx tsx scripts\\testOcrPdf.ts <pdf>");
        process.exit(1);
    }

    const pages = await extractPageText(pdf);

    console.log(JSON.stringify(pages, null, 2));

}

main().catch(console.error);
