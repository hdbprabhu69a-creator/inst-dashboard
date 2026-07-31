export function parseIndianDate(
  value:string
):Date{

  const [d,m,y]=value.split("/").map(Number);

  return new Date(y,m-1,d);

}

