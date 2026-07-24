"use client";

import { useEffect,useMemo,useRef,useState } from "react";
import { STOCK_UNIVERSE } from "@/lib/universe";
import { INDEX_SYMBOLS } from "@/lib/index/indexSymbols";



type Item={
 symbol:string;
 type:"STOCK"|"INDEX";
};

const DATA: Item[] = [

...STOCK_UNIVERSE.map((s:string)=>({

symbol:s,

type:"STOCK" as const

})),

...Object.keys(INDEX_SYMBOLS).map((s:string)=>({

symbol:s,

type:"INDEX" as const

}))

];

export default function SymbolSearch({

value,
setValue,
onSelect

}:{

value:string;
setValue:(v:string)=>void;
onSelect:(v:string)=>void;

}){

const[listOpen,setListOpen]=useState(false);

const[selected,setSelected]=useState(0);

const boxRef=useRef<HTMLDivElement>(null);

const filtered=useMemo(()=>{

if(value.length<2) return [];

return DATA.filter(x=>

x.symbol
.toUpperCase()
.includes(
value.toUpperCase()
)

).slice(0,20);

},[value]);

useEffect(()=>{

const fn=(e:any)=>{

if(!boxRef.current?.contains(e.target))
setListOpen(false);

};

window.addEventListener("mousedown",fn);

return()=>window.removeEventListener("mousedown",fn);

},[]);

useEffect(()=>{

setListOpen(

value.length>=2 &&
filtered.length>0

);

},[value,filtered]);

return(

<div className="relative w-80" ref={boxRef}>

<input

value={value}

placeholder="SBIN / NIFTY / BANKNIFTY"

className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2"

onChange={e=>{

setValue(
e.target.value.toUpperCase()
);

setSelected(0);

}}

onKeyDown={e=>{

if(!listOpen){

if(e.key==="Enter")
onSelect(value);

return;

}

if(e.key==="ArrowDown"){

e.preventDefault();

setSelected(v=>

Math.min(
v+1,
filtered.length-1
)

);

}

if(e.key==="ArrowUp"){

e.preventDefault();

setSelected(v=>

Math.max(
v-1,
0
)

);

}

if(e.key==="Enter"){

e.preventDefault();

onSelect(
filtered[selected].symbol
);

setListOpen(false);

}

if(e.key==="Escape")
setListOpen(false);

}}

/>

{

listOpen &&

<div className="absolute top-full left-0 right-0 bg-black border border-gray-700 rounded mt-1 z-50 max-h-72 overflow-auto">

<div className="px-3 py-2 text-cyan-400 text-xs font-bold">
STOCKS
</div>

{

filtered

.filter(x=>x.type==="STOCK")

.map(x=>

<div

key={x.symbol}

className="px-3 py-2 hover:bg-gray-800 cursor-pointer"

onClick={()=>{

onSelect(x.symbol);

setListOpen(false);

}}

>

{x.symbol}

</div>

)

}

<div className="px-3 py-2 text-orange-400 text-xs font-bold">
INDICES
</div>

{

filtered

.filter(x=>x.type==="INDEX")

.map(x=>

<div

key={x.symbol}

className="px-3 py-2 hover:bg-gray-800 cursor-pointer"

onClick={()=>{

onSelect(x.symbol);

setListOpen(false);

}}

>

{x.symbol}

</div>

)

}

</div>

}

</div>

);

}



