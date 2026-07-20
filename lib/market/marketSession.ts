export function isMarketOpen(
    now:Date=new Date()
):boolean{

    const ist=new Date(
        now.toLocaleString(
            "en-US",
            {
                timeZone:"Asia/Kolkata"
            }
        )
    );

    const day=ist.getDay();

    if(day===0||day===6){

        return false;

    }

    const minutes=
        ist.getHours()*60+
        ist.getMinutes();

    const open=9*60+15;

    const close=15*60+30;

    return minutes>=open&&minutes<close;

}

export function getPortfolioCmp(
    structure:any
):number{

    if(!structure){

        return 0;

    }

    return Number(
        structure.cmp ??
        structure.close ??
        0
    );

}
