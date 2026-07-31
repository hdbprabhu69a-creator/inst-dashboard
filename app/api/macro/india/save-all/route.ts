import {NextRequest,NextResponse} from "next/server";
import {saveAllMacroRows} from "@/lib/firestore/macroRepository";
import type {MacroRow} from "@/types/macro";

export async function POST(req:NextRequest){

    const rows=(await req.json()) as MacroRow[];

    await saveAllMacroRows(rows);

    return NextResponse.json({
        success:true,
        count:rows.length
    });

}

