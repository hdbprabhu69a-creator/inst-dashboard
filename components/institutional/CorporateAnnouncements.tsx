export default function CorporateAnnouncements() {

  const announcements = [

    "TCS wins large international deal",

    "Infosys board meeting announced",

    "SBI raises deposit rates",

    "Reliance expands renewable capacity",

    "L&T receives major order",

  ];

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-[600px]">

      <h2 className="text-white font-bold mb-4">
        Corporate Announcements
      </h2>

      <div className="space-y-3">

        {announcements.map((item, index) => (

          <div
            key={index}
            className="border-b border-zinc-800 pb-2"
          >

            <p className="text-zinc-300 text-sm">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}