import JSZip from "jszip";
import fs from "node:fs";

async function main(){

    const file=process.argv[2];

    const buffer=fs.readFileSync(file);

    const zip=await JSZip.loadAsync(buffer);

    console.log("========== DOCX FILES ==========");

    Object.keys(zip.files)
        .sort()
        .forEach(f=>console.log(f));

    console.log("");

    console.log("========== document.xml ==========");

    const xml=await zip.file("word/document.xml")?.async("string");

    console.log(xml?.substring(0,5000));

}

main().catch(console.error);
