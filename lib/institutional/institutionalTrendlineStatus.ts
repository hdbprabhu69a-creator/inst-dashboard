export function getInstitutionalTrendlineStatus(
  cmp:number,
  trendline:any
){

  const price =
    trendline.end.price;

  return {

    price,

    status:
      cmp > price
        ? "ABOVE"
        : cmp < price
          ? "BELOW"
          : "TOUCHING"

  };

}

