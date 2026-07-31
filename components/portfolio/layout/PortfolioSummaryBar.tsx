"use client";

import {
  Wallet,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Landmark,
  CreditCard
} from "lucide-react";

const cards = [
  { title:"Net Worth", value:"--", icon:Wallet, color:"text-cyan-400" },
  { title:"Day P&L", value:"--", icon:TrendingUp, color:"text-green-400" },
  { title:"Total P&L", value:"--", icon:DollarSign, color:"text-emerald-400" },
  { title:"Unrealized", value:"--", icon:BarChart3, color:"text-yellow-400" },
  { title:"Realized", value:"--", icon:PieChart, color:"text-orange-400" },
  { title:"Cash", value:"--", icon:Landmark, color:"text-blue-400" },
  { title:"Buying Power", value:"--", icon:CreditCard, color:"text-violet-400" }
];

export default function PortfolioSummaryBar(){

  return(

    <section className="p-6">

      <div className="grid grid-cols-7 gap-5">

        {cards.map(card=>{

          const Icon=card.icon;

          return(

            <div
              key={card.title}
              className="
              rounded-2xl
              border
              border-[#223041]
              bg-[#121a24]
              p-5
              transition-all
              duration-300
              hover:border-cyan-500
              hover:shadow-[0_0_20px_rgba(34,211,238,.12)]
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <div className="text-[11px] uppercase tracking-wider text-slate-400">

                    {card.title}

                  </div>

                  <div className="mt-5 text-3xl font-bold text-white">

                    {card.value}

                  </div>

                </div>

                <div className="rounded-xl bg-[#1b2430] p-3">

                  <Icon
                    size={24}
                    className={card.color}
                  />

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}

