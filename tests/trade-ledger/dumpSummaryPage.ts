import { loadPdf } from "../../lib/trade-ledger/pdf/pdfLoader";
import { extractPageItems } from "../../lib/trade-ledger/pdf/pageExtractor";

const pdfPath = "G:/GProjects/inst-dashboard/tests/data/BC0109_2026-04-01_2026-07-17.pdf";

async function main() {
    const pdf = await loadPdf(pdfPath);
    const page3 = await extractPageItems(await pdf.getPage(3));

    page3
        .sort((a,b)=>a.y-b.y || a.x-b.x)
        .forEach(item =>
            console.log(`x=${item.x} y=${item.y} text="${item.text}"`)
        );
}

main().catch(console.error);
