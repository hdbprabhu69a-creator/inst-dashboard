"use client";

import InstitutionalGrid from "../grid/InstitutionalGrid";
import type { GridColumn } from "../grid/GridTypes";

interface Props{
 rows:any[];
}

const columns:GridColumn[]=[

{key:"engine",title:"ENGINE",type:"text",width:100},

{key:"daily",title:"DAILY",type:"badge"},

{key:"weekly",title:"WEEKLY",type:"badge"},

{key:"monthly",title:"MONTHLY",type:"badge"},

{key:"position",title:"POSITION",type:"badge"},

{key:"bias",title:"BIAS",type:"bias"},

{key:"alignment",title:"ALIGN",type:"alignment"},

{key:"score",title:"SCORE",type:"score"},

{key:"verdict",title:"VERDICT",type:"verdict"},

{key:"deliveryPercent",title:"DEL%",type:"percent"},
{key:"deliveryGrowth",title:"D.GROW",type:"number"},
{key:"deliveryMomentum",title:"D.MOM",type:"number"},
{key:"smartMoneyEntry",title:"SM ENTRY",type:"badge"},
{key:"smartMoneyExit",title:"SM EXIT",type:"badge"}

];


export default function CompositeGrid({rows}:Props){

return(
<InstitutionalGrid
 columns={columns}
 rows={rows}
/>
);

}



