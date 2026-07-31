import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}:{
  children: React.ReactNode;
}){

  return(

    <div className="flex h-screen bg-black text-white">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        <main className="flex-1 overflow-auto bg-zinc-950">

          {children}

        </main>

      </div>

    </div>

  );

}

