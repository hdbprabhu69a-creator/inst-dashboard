import {NextRequest,NextResponse} from "next/server";
import {getMacroRows,saveMacroRow} from "@/lib/firestore/macroRepository";

export async function GET(){

    const rows=await getMacroRows();

    return NextResponse.json(rows);

}

export async function PUT(req:NextRequest){

    const row=await req.json();

    await saveMacroRow(row);

    return NextResponse.json({success:true});

}
