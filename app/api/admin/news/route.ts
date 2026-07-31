import {NextRequest,NextResponse} from "next/server";

import {

getAllNews,
createNews,
updateNews,
deleteNews

} from "@/lib/news/newsRepository";

export async function GET(){

    const data=await getAllNews();

    return NextResponse.json({

        success:true,

        data

    });

}

export async function POST(req:NextRequest){

    const body=await req.json();

    const id=await createNews(body);

    return NextResponse.json({

        success:true,

        id

    });

}

export async function PUT(req:NextRequest){

    const body=await req.json();

    await updateNews(body.id,body);

    return NextResponse.json({

        success:true

    });

}

export async function DELETE(req:NextRequest){

    const {searchParams}=new URL(req.url);

    const id=searchParams.get("id");

    if(!id){

        return NextResponse.json({

            success:false

        },{status:400});

    }

    await deleteNews(id);

    return NextResponse.json({

        success:true

    });

}

