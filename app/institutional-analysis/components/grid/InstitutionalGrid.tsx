"use client";

import { useEffect, useRef, useState } from "react";
import { GridColumn } from "./GridTypes";
import { renderCell } from "./renderers/CellRenderer";

interface Props{
  columns:GridColumn[];
  rows:any[];
}

export default function InstitutionalGrid({columns,rows}:Props){

  const scrollRef=useRef<HTMLDivElement>(null);

  const [dragging,setDragging]=useState(false);
  const [canLeft,setCanLeft]=useState(false);
  const [canRight,setCanRight]=useState(true);

  const startX=useRef(0);
  const startScrollLeft=useRef(0);

  const firstWidth=columns[0]?.width??140;

  const checkScroll=()=>{

    const el=scrollRef.current;

    if(!el)return;

    setCanLeft(el.scrollLeft>0);
    setCanRight(el.scrollLeft+el.clientWidth<el.scrollWidth-2);

  };

  useEffect(()=>{

    const stop=()=>setDragging(false);

    window.addEventListener("mouseup",stop);

    checkScroll();

    window.addEventListener("resize",checkScroll);

    return()=>{

      window.removeEventListener("mouseup",stop);
      window.removeEventListener("resize",checkScroll);

    };

  },[]);

  const onWheel=(e:React.WheelEvent<HTMLDivElement>)=>{

    if(e.shiftKey)return;

    checkScroll();

  };

  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{

    if((e.buttons&1)!==1){
      setDragging(false);
      return;
    }

    if(!dragging||!scrollRef.current)return;

    e.preventDefault();

    const dx=e.clientX-startX.current;

    scrollRef.current.scrollLeft=startScrollLeft.current-dx;

    checkScroll();

  };

  return(

    <div className="relative h-full">

      {canLeft&&(
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0d131a] to-transparent z-40"/>
      )}

      {canRight&&(
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0d131a] to-transparent z-40"/>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onWheel={onWheel}
        onDragStart={(e)=>e.preventDefault()}
        onMouseDown={(e)=>{
          setDragging(true);
          startX.current=e.clientX;
          startScrollLeft.current=scrollRef.current?.scrollLeft??0;
        }}
        onMouseMove={onMove}
        onMouseUp={()=>setDragging(false)}
        onMouseLeave={()=>setDragging(false)}
        className={
          "h-full w-full overflow-x-auto overflow-y-auto hidescroll rounded-xl border border-[#26313c] bg-[#0d131a] select-none "+
          (dragging?"cursor-grabbing":"cursor-grab")
        }
      >

        <table className="min-w-max border-collapse">

          <thead className="sticky top-0 z-20">

            <tr>

              {columns.map((c,index)=>

                <th
                  key={c.key}
                  style={
                    index===0
                      ?{left:0,width:c.width}
                      :index===1
                      ?{left:firstWidth,width:c.width}
                      :{width:c.width}
                  }
                  className={
                    "top-0 z-20 bg-[#0b1016] text-[#3cf2df] text-[11px] font-bold px-3 py-3 border border-[#26313c] whitespace-nowrap "+
                    (index<2?"sticky z-30":"sticky")
                  }
                >
                  {c.title}
                </th>

              )}

            </tr>

          </thead>

          <tbody>

            {rows.map((row,i)=>

              <tr key={row.symbol??i} className="hover:bg-[#18222d] transition-colors">

                {columns.map((c,index)=>

                  <td
                    key={c.key}
                    style={
                      index===0
                        ?{left:0,width:c.width}
                        :index===1
                        ?{left:firstWidth,width:c.width}
                        :{width:c.width}
                    }
                    className={
                      "px-3 py-2 border border-[#1f2833] whitespace-nowrap text-center text-slate-200 "+
                      (index<2?"sticky bg-[#0d131a] z-20":"")
                    }
                  >
                    {renderCell(c,row)}
                  </td>

                )}

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

