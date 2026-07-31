export function getInstitutionalBasePivot(
  marketStructure:any,
  structure:string
){

  const order=[

    marketStructure.oneYearSwing,

    marketStructure.sixMonthSwing,

    marketStructure.threeMonthSwing,

    marketStructure.oneMonthSwing,

    marketStructure.twoWeekSwing,

    marketStructure.oneWeekSwing

  ];

  for(const swing of order){

    if(!swing){
      continue;
    }

    if(
      structure==="HH_HL"
      &&
      swing.low!=null
    ){

      return{

        type:"LOW",

        price:swing.low,

        time:String(swing.lowDate)

      };

    }

    if(
      structure==="LH_LL"
      &&
      swing.high!=null
    ){

      return{

        type:"HIGH",

        price:swing.high,

        time:String(swing.highDate)

      };

    }

  }

  return null;

}

