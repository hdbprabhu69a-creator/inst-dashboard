export function trendVerdict(
    structure:any,
    phase:any,
    score:number,
    confidence:any
){

    const conf=confidence?.value??confidence??0;

    if(score>=80 && conf>=80)
        return "ACC";

    if(score>=60 && conf>=60)
        return "HOLD";

    if(score>=40)
        return "WATCH";

    return "AVOID";

}
