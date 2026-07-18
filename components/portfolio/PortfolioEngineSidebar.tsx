"use client";

import {useState} from "react";

import {PORTFOLIO_ENGINE_MENU} from "./PortfolioEngineMenu";

interface Props{
selected:string;
onSelect:(id:string)=>void;
}

export default function PortfolioEngineSidebar({
selected,
onSelect
}:Props){

const [open,setOpen]=useState(false);

return(

<>

<button
onClick={()=>setOpen(!open)}
className="w-full flex items-center justify-between px-6 py-3 text-left text-[#d7c9a7] hover:bg-[#141c24]"
>

<span className="font-semibold">
Portfolio Engine
</span>

{open ? "?" : "?"}

</button>

{open&&(

<div className="flex flex-col">

{PORTFOLIO_ENGINE_MENU.map(item=>(

<button
key={item.id}
onClick={()=>onSelect(item.id)}
className={`text-left pl-10 pr-4 py-2 text-sm transition ${
selected===item.id
?"bg-[#14222d] text-[#38f2d6]"
:"text-[#c4b89a] hover:bg-[#11181f]"
}`}
>

{item.title}

</button>

))}

</div>

)}

</>

);

}

