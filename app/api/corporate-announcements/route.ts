import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { STOCK_UNIVERSE } from "@/lib/universe";

const monthMap: Record<string, number> = {
    Jan:0,
    Feb:1,
    Mar:2,
    Apr:3,
    May:4,
    Jun:5,
    Jul:6,
    Aug:7,
    Sep:8,
    Oct:9,
    Nov:10,
    Dec:11
};

function parseDate(value:string){

    if(!value)
        return 0;

    const [date,time="00:00:00"]=value.split(" ");

    const [day,month,year]=date.split("-");

    const [hour,minute,second]=time.split(":");

    return new Date(
        Number(year),
        monthMap[month],
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    ).getTime();

}

export async function GET(){

    const snapshot=
        await adminDb
            .collection("corporate_announcements")
            .get();

    const rows=
        snapshot.docs
            .map(doc=>({

                id:doc.id,

                ...doc.data()

            }))
            .filter((row:any)=>
                STOCK_UNIVERSE.includes(
                    String(row.symbol ?? "")
                        .toUpperCase()
                )
            )
            .sort(
                (a:any,b:any)=>
                    parseDate(b.announcementDate)-
                    parseDate(a.announcementDate)
            )
            .slice(0,1000);

    return NextResponse.json(rows);

}
