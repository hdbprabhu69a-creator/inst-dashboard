"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function StockSearchPopup({
  open,
  onClose,
}: Props) {

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[420px] bg-[#131722] border border-zinc-700 rounded-lg shadow-2xl z-50">

        <div className="p-3 border-b border-zinc-700">

          <input
            autoFocus
            placeholder="Search stock..."
            className="w-full rounded bg-[#0b0e11] border border-zinc-700 px-3 py-2 outline-none text-white"
          />

        </div>

        <div className="p-6 text-center text-zinc-500">

          Search results will appear here...

        </div>

      </div>
    </>
  );

}
