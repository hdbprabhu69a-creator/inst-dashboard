import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { importContractNoteFirestore } from "./importContractNoteFirestore";

async function main(){

    const input=process.argv[2];

    if(!input){

        console.error(
            "Usage: npx tsx runImport.ts <pdf-or-folder>"
        );

        process.exit(1);

    }

    const stat=fs.statSync(input);

    const files=stat.isDirectory()

        ?fs.readdirSync(input)
            .filter(file=>file.toLowerCase().endsWith(".pdf"))
            .sort()
            .map(file=>path.join(input,file))

        :[input];

    let success=0;

    let failed=0;

    for(const file of files){

        try{

            console.log("");

            console.log("===================================");

            console.log(path.basename(file));

            console.log("===================================");

            await importContractNoteFirestore(file);

            success++;

        }catch(error){

            failed++;

            console.error(error);

        }

    }

    console.log("");

    console.log("Completed");

    console.log("Imported :",success);

    console.log("Failed   :",failed);

}

main().catch(console.error);

