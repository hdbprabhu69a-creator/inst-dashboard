import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { importContractNoteFirestore } from "@/lib/trade-ledger/parser/importContractNoteFirestore";

export async function POST(req: NextRequest) {

    try {

        const { pdfPath } = await req.json();

        const child = spawn(
            process.execPath,
            [
                "./node_modules/tsx/dist/cli.mjs",
                "./trade-parser.mts",
                pdfPath
            ],
            {
                cwd: process.cwd()
            }
        );

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", d => stdout += d.toString());
        child.stderr.on("data", d => stderr += d.toString());

        const exitCode = await new Promise<number>(resolve => {
            child.on("close", resolve);
        });

        if (exitCode !== 0) {

            return NextResponse.json(
                {
                    stage: "parser",
                    exitCode,
                    stderr
                },
                {
                    status: 500
                }
            );

        }

        const note = JSON.parse(stdout);

        try {

            const result = await importContractNoteFirestore(note);

            return NextResponse.json({
                success: true,
                result
            });

        } catch (e) {

            return NextResponse.json(
                {
                    stage: "firestore",
                    error: e instanceof Error ? e.message : String(e),
                    stack: e instanceof Error ? e.stack : null
                },
                {
                    status: 500
                }
            );

        }

    } catch (e) {

        return NextResponse.json(
            {
                stage: "route",
                error: e instanceof Error ? e.message : String(e),
                stack: e instanceof Error ? e.stack : null
            },
            {
                status: 500
            }
        );

    }

}
