import {NextResponse} from "next/server";
import {adminDb} from "@/lib/firebase-admin";
import {classifyNews} from "@/lib/news/classifyNews";

export async function POST(){

    const snapshot=await adminDb
        .collection("news")
        .get();

    let updated=0;

    const batch=adminDb.batch();

    snapshot.docs.forEach(doc=>{

        const data=doc.data();

        const cls=classifyNews(

            data.title ??
            data.headline ??
            "",

            data.summary ??
            data.description ??
            ""

        );

        batch.update(doc.ref,{

            category:cls.category,

            subCategory:cls.subCategory ?? null,

            updatedAt:new Date()

        });

        updated++;

    });

    await batch.commit();

    return NextResponse.json({

        success:true,

        updated

    });

}

