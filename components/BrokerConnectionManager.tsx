"use client";
console.log(
  "TOP ENV =",
  process.env.NEXT_PUBLIC_KITE_API_KEY
);

export default function BrokerConnectionManager() {

  const apiKey =
    process.env.NEXT_PUBLIC_KITE_API_KEY;

  const reconnect = () => {

    console.log(
      "API KEY =",
      apiKey
    );

    if (!apiKey) {

      alert(
        "NEXT_PUBLIC_KITE_API_KEY not loaded"
      );

      return;
    }

    window.location.href =
      `https://kite.trade/connect/login?api_key=${apiKey}&v=3`;

  };

  return (

    <div className="flex items-center gap-4">

      <div>

        <p className="text-green-400 font-semibold">
          🟢 Zerodha Connected
        </p>

        <p className="text-xs text-zinc-500">
          Live Feed Active
        </p>

        <p className="text-yellow-400 text-xs">
          API KEY = {apiKey || "UNDEFINED"}
        </p>

      </div>

      <button
        onClick={reconnect}
        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm"
      >
        Reconnect
      </button>

    </div>

  );

}