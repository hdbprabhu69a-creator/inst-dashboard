import {
  InstitutionalSwingPoint,
  InstitutionalTrendline,
} from "./types";





function isBull(
  structure:string
){
  return structure==="HH_HL";
}

function isBear(
  structure:string
){
  return structure==="LH_LL";
}

export function buildInstitutionalTrendline(
  marketStructure:any,
  structure:string
):InstitutionalTrendline|null{

  const points:InstitutionalSwingPoint[]=(

  isBull(structure)

  ? [

      marketStructure.oneYearSwing,
      marketStructure.sixMonthSwing,
      marketStructure.threeMonthSwing,
      marketStructure.oneMonthSwing,
      marketStructure.twoWeekSwing,
      marketStructure.oneWeekSwing

    ]

  : [

      marketStructure.oneYearSwing,
      marketStructure.sixMonthSwing,
      marketStructure.threeMonthSwing,
      marketStructure.oneMonthSwing,
      marketStructure.twoWeekSwing,
      marketStructure.oneWeekSwing

    ]

)

.filter(Boolean)

.map(

  s=>

    isBull(structure)

    ? {

        price:s.low,

        time:s.lowDate?.seconds

          ? new Date(
              s.lowDate.seconds*1000
            ).toISOString()

          : ""

      }

    : {

        price:s.high,

        time:s.highDate?.seconds

          ? new Date(
              s.highDate.seconds*1000
            ).toISOString()

          : ""

      }

);if(
    points.length<2
  ){
    return null;
  }

  let trendline:InstitutionalTrendline|null=null;

  let start=points[0];

for(

  let i=1;

  i<points.length;

  i++

){

  const next=points[i];

  if(

    isBull(structure)

    &&

    next.price>start.price

  ){

    trendline={

      start,

      end:next

    };

  }

  if(

    isBear(structure)

    &&

    next.price<start.price

  ){

    trendline={

      start,

      end:next

    };

  }

  start=next;

}

return trendline;

}

