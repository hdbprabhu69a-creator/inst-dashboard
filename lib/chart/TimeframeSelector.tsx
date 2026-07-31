"use client";

type Interval = "D" | "W" | "M";

type Props = {
  interval: Interval;
  setInterval: (value: Interval) => void;
};

export default function TimeframeSelector({
  interval,
  setInterval,
}: Props) {
  const items: Interval[] = ["D", "W", "M"];

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setInterval(item)}
          className={`px-5 py-2 rounded-lg font-semibold transition-all ${
            interval === item
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
