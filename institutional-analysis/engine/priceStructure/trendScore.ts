export function trendScore(
    structure:any,
    integrity:any,
    phase:any,
    strength:any
){

    let score=0;

    if(structure?.structure==="HH_HL") score+=30;
    else if(structure?.structure==="LH_LL") score+=10;
    else score+=20;

    if(integrity?.status==="INTACT") score+=20;

    if(phase?.phase==="EARLY_UPTREND") score+=15;
    else if(phase?.phase==="MATURE_UPTREND") score+=20;
    else if(phase?.phase==="DISTRIBUTION") score+=5;

    score+=Math.min(30,strength?.score??0);

    return Math.max(0,Math.min(100,score));

}
