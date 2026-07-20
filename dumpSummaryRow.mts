import { loadPdf } from "./lib/trade-ledger/pdf/pdfLoader";
import { extractPageItems } from "./lib/trade-ledger/pdf/pageExtractor";

const pdfPath = process.argv[2];

const pdf = await loadPdf(pdfPath);

const items = [];

for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    items.push(...await extractPageItems(page));
}

const summary = items
    .filter(i => /^INE[A-Z0-9]+$/i.test(i.text))
    .sort((a, b) => a.x - b.x);

if (summary.length === 0) {
    console.log("Summary row not found");
    process.exit(1);
}

const y = summary[0].y;

items
    .filter(i => Math.abs(i.y - y) < 2)
    .sort((a, b) => a.x - b.x)
    .forEach(i => {
        console.log(`${i.x.toFixed(1).padStart(6)}  ${i.text}`);
    });
