"use client";

import { useCallback, useEffect, useState } from "react";
import EngineNavigator from "./components/EngineNavigator";
import EngineWorkspace from "./components/workspaces/EngineWorkspace";


const ENGINE_APIS: Record<string,{run:string;update:string}>={
  "Trend Analysis":{
    run:"/api/institutional/run-universe",
    update:"/api/institutional-analysis/trend/update"
  },
  "Pivot Analysis":{
    run:"/api/institutional-analysis/pivot",
    update:"/api/institutional-analysis/pivot/update"
  },
  "CPR Analysis":{
    run:"/api/institutional-analysis/cpr",
    update:"/api/institutional-analysis/cpr/update"
  }
};
export default function InstitutionalAnalysisPage() {

const [engine,setEngine]=useState("Trend Analysis");
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(false);
  const [updating,setUpdating]=useState(false);
  const [rows,setRows]=useState<any[]>([]);

  const runEngine = useCallback(async () => {

    setLoading(true);

    try{

      const endpoint=ENGINE_APIS[engine]?.run;

      if(!endpoint){
        setRows([]);
        return;
      }

      const r=await fetch(endpoint,{cache:"no-store"});
      if(!r.ok) throw new Error(await r.text());
      const j=await r.json();
      setRows(j.rows ?? j.data ?? []);

    }catch(e){console.error(e);}finally{
      setLoading(false);
    }

  }, [engine]);

  useEffect(()=>{
    runEngine();
  },[runEngine]);

  async function updateDatabase(){

    setUpdating(true);

    try{

      const endpoint=ENGINE_APIS[engine]?.update;

      if(!endpoint){
        alert("Update not available");
        setUpdating(false);
        return;
      }

      const r=await fetch(endpoint,{cache:"no-store"});

      if(!r.ok) throw new Error(await r.text());
      const j=await r.json();

      if(j.success){
        await runEngine();

      }else{
        alert("Update Failed");
      }

    }catch(e){console.error(e);}finally{
      setUpdating(false);
    }

  }

  return(

    <main className="w-screen h-screen bg-[#0A0E14] text-[#008487] flex overflow-hidden">

      <aside className="w-[220px] shrink-0 bg-[#11161C] border-r border-[#232B36]">
        <EngineNavigator
          selected={engine}
          setSelected={setEngine}
        />
      </aside>

      <section className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#0A0E14]">

        <div className="h-12 shrink-0 bg-[#11161C] border-b border-[#232B36] flex items-center gap-4 px-4">

          <div className="text-lg font-semibold text-[#008487]">
            {engine}
          </div>

          <div className="flex-1"/>

          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search Symbol..."
            className="w-72 h-9 rounded bg-[#0A0E14] border border-[#2D3746] px-3 text-sm text-[#008487] placeholder:text-zinc-500 outline-none"
          />

          <button
            onClick={updateDatabase}
            disabled={loading || updating}
            className={`h-9 px-4 rounded font-semibold transition-all duration-200 ${updating?"bg-amber-500 text-black cursor-wait":"bg-emerald-700 hover:bg-emerald-600 text-white"}`}
          >
            {updating?"Updating...":"Update Database"}
          </button>

        </div>

        <div className="flex-1 min-w-0 overflow-auto p-2 hidescroll">

          {loading ? (
            <div className="h-full flex items-center justify-center text-cyan-400 text-lg font-semibold">
              Loading {engine}...
            </div>
          ) : (
            <EngineWorkspace
              engine={engine}
              rows={rows.filter(r=>
                r.symbol?.toLowerCase().includes(search.toLowerCase())
              )}
              onSelect={()=>{}}
            />
          )}

        </div>

      </section>

    </main>

  );

}















