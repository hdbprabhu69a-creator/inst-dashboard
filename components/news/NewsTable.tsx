interface Props{
    rows:any[];
}

export default function NewsTable({rows}:Props){

    return(

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">

            {rows.map((row:any,index:number)=>(

                <article
                    key={row.id}
                    className={`px-7 py-6 transition-all duration-200 hover:bg-zinc-800/20 ${
                        index!==rows.length-1
                        ?"border-b border-zinc-800"
                        :""
                    }`}
                >

                    {/* Headline */}

                    <h3 className="text-sky-400 font-medium text-[18px] tracking-[0.2px]">

                        {row.title || row.headline || row.category}

                    </h3>

                    {/* Institutional Summary */}

                    <p className="mt-2 text-[17px] leading-9 text-zinc-400 font-normal tracking-[0.15px]">

                        {row.summary}

                        {!!row.stocks?.filter((s:any)=>s.symbol).length && (

                            <>

                                <span className="text-zinc-600"> • </span>

                                <span className="text-amber-300 text-[15px] font-medium">

                                    {row.stocks
                                        .filter((s:any)=>s.symbol)
                                        .map((s:any)=>s.symbol)
                                        .join(" • ")}

                                </span>

                            </>

                        )}

                        {!!row.sectors?.length && (

                            <>

                                <span className="text-zinc-600"> • </span>

                                <span className="text-cyan-400 text-[15px]">

                                    {row.sectors.join(" • ")}

                                </span>

                            </>

                        )}

                        {row.verdict && (

                            <>

                                <span className="text-zinc-600"> • </span>

                                <span
                                    className={
                                        row.verdict==="Bullish"
                                        ?"text-emerald-300"
                                        :row.verdict==="Bearish"
                                        ?"text-rose-300"
                                        :"text-amber-300"
                                    }
                                >

                                    {row.verdict}

                                </span>

                            </>

                        )}

                    </p>

                </article>

            ))}

        </div>

    );

}






