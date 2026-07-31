import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";

export async function POST(request: NextRequest) {

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {

        return NextResponse.json(
            { error:"PDF not provided." },
            { status:400 }
        );

    }

    const tempPath = path.join(
        os.tmpdir(),
        file.name
    );

    await fs.writeFile(
        tempPath,
        Buffer.from(await file.arrayBuffer())
    );

    return await new Promise<NextResponse>((resolve)=>{

        const tsx = path.join(process.cwd(),"node_modules","tsx","dist","cli.mjs");

        console.log("CWD:",process.cwd()); console.log("TSX:",tsx); execFile(process.execPath,[tsx,
                "lib/trade-ledger/worker/importContractNoteWorker.ts",
                tempPath
            ],

            {
                cwd:process.cwd()
            },

            async (error, stdout, stderr)=>{

                await fs.unlink(tempPath).catch(()=>{});

                if(error){

                    resolve(
                        NextResponse.json(
                            {
                                success:false,
                                error:stderr || error.message
                            },
                            {
                                status:500
                            }
                        )
                    );

                    return;
                }

                resolve(
                    NextResponse.json(
                        JSON.parse(stdout.trim().split(/\r?\n/).pop()!)
                    )
                );

            }

        );

    });

}




