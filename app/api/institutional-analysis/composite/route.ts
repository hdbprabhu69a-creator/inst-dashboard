import { NextResponse } from "next/server";

import { getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";


export async function GET(
    req:Request
){

    try{


        const {searchParams}=new URL(req.url);


        const symbol =
            searchParams.get("symbol");


        if(!symbol){

            return NextResponse.json({

                success:false,

                error:"symbol required"

            },{
                status:400
            });

        }



        const ms:any =
            await getMarketStructure(
                symbol.toUpperCase()
            );



        if(!ms){

            return NextResponse.json({

                success:false,

                error:"Market structure not found"

            },{
                status:404
            });

        }



        return NextResponse.json({

            success:true,

            symbol:symbol.toUpperCase(),


            data:{

                cmp: ms.cmp ?? ms.dailyOHLC?.close ?? null,


                pivot:
                    ms.pivot ?? null,


                cpr:
                    ms.cpr ?? null


            }


        });



    }catch(e:any){


        return NextResponse.json({

            success:false,

            error:e.message

        },{
            status:500
        });


    }

}

