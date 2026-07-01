"use client";

type Props = {
  value: string;
  onClick: () => void;
};

export default function StockSearch({
  value,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        items-center
        gap-2
        h-11
        px-4
        rounded-md
        bg-[#131722]
        border
        border-[#2A2E39]
        hover:border-[#4A90E2]
        transition-colors
        text-white
        min-w-[170px]
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <span className="font-semibold">
        {value || "Select Stock"}
      </span>

      <span className="ml-auto text-xs text-zinc-400">
        ▼
      </span>
    </button>
  );
}