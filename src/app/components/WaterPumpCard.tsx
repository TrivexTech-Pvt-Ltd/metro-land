"use client";

interface Props {
  motorOn: boolean;
  motorOff: boolean;
  onToggle: (motorOn: boolean, motorOff: boolean) => void;
}

export default function WaterPumpCard({ motorOn, motorOff, onToggle }: Props) {
  // motor is running when motorOn is true AND motorOff is false
  const isRunning = !!(motorOn && !motorOff);

  console.log("motorOn", motorOn);
  console.log("motorOff", motorOff);
  console.log("isRunning", isRunning);

  return (
    <div className="pump-container">
      <div className="flex justify-between items-center">
        <h2>🚰 Water Pump</h2>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
          isRunning 
            ? "bg-green-950/60 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.15)]" 
            : "bg-rose-950/60 text-rose-400 border-rose-500/30"
        }`}>
          Status: {isRunning ? "ON" : "OFF"}
        </div>
      </div>

      {/* Centered content block to prevent controls from bottom-aligning too aggressively */}
      <div className="flex flex-col gap-4 my-auto">
        <div className="pump-wrapper">
          {/* Pump Body */}
          <div className="pump-body">
            <div className={`pump-fan ${isRunning ? "spin" : ""}`} />
          </div>

          {/* Water Pipe */}
          <div className="pipe">
            {isRunning && <div className="water-flow" />}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Dual button manual control */}
          <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Water Pump Control
            </span>
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => onToggle(true, false)}
                className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs border transition-all duration-300 ${
                  motorOn
                    ? "bg-green-600 text-white border-green-400 shadow-[0_0_15px_rgba(22,163,74,0.5)] scale-[1.02]"
                    : "bg-slate-800/40 hover:bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200 cursor-pointer"
                }`}
              >
                🟢 ON
              </button>
              <button
                onClick={() => onToggle(false, true)}
                className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs border transition-all duration-300 ${
                  motorOff
                    ? "bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-[1.02]"
                    : "bg-slate-800/40 hover:bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200 cursor-pointer"
                }`}
              >
                🔴 OFF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}