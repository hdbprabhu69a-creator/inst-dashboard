export default function Header() {

  return (

    <header className="h-14 shrink-0 border-b border-[#2a313b] bg-[#11161d] flex items-center justify-between px-6">

      <div className="flex items-center gap-8">

        <h1 className="text-2xl font-bold tracking-wide">
          INSTITUTIONAL ANALYSIS
        </h1>

        <div className="text-green-400 font-semibold">
          ? LIVE
        </div>

        <div className="text-[#b8c1cc]">
          MARKET : BULL
        </div>

        <div className="text-[#b8c1cc]">
          UNIVERSE : 99
        </div>

      </div>

      <div className="text-[#b8c1cc]">
        LAST UPDATE : --
      </div>

    </header>

  );

}



