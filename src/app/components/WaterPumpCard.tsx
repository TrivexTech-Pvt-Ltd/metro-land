"use client";
import { useState, useEffect } from "react";

interface Props {
  control: {
    firmware_update: boolean;
    motor_off: boolean;
    motor_on: boolean;
  };
  sumpMotorStatus: string;
  onToggle: (control: {
    firmware_update: boolean;
    motor_off: boolean;
    motor_on: boolean;
  }) => void;
  userRole: string;
}

export default function WaterPumpCard({
  control,
  sumpMotorStatus,
  onToggle,
  userRole,
}: Props) {
  const [pendingStatus, setPendingStatus] = useState<"ON" | "OFF" | null>(null);

  const isRunning = sumpMotorStatus.toUpperCase() === "ON";

  // Clear pending status when actual hardware state matches
  useEffect(() => {
    if (isRunning && pendingStatus === "ON") {
      setPendingStatus(null);
    } else if (!isRunning && pendingStatus === "OFF") {
      setPendingStatus(null);
    }
  }, [sumpMotorStatus, isRunning, pendingStatus]);

  // Timeout to clear pending state if hardware doesn't respond
  useEffect(() => {
    if (pendingStatus !== null) {
      const timer = setTimeout(() => {
        setPendingStatus(null);
      }, 10000); // 10s timeout
      return () => clearTimeout(timer);
    }
  }, [pendingStatus]);

  const handleToggle = (target: "ON" | "OFF", payload: typeof control) => {
    if ((target === "ON" && isRunning) || (target === "OFF" && !isRunning)) {
      return;
    }
    setPendingStatus(target);
    onToggle(payload);
  };

  const showOnHighlighted = pendingStatus === "ON" || (pendingStatus === null && isRunning);
  const showOffHighlighted = pendingStatus === "OFF" || (pendingStatus === null && !isRunning);

  console.log("control", control);
  console.log("sumpMotorStatus", sumpMotorStatus);
  console.log("isRunning", isRunning);
  console.log("pendingStatus", pendingStatus);

  return (
    <div className="pump-container">
      <div className="flex justify-between items-center">
        <h2>🚰 Water Pump</h2>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
          isRunning 
            ? "bg-green-950/60 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.15)]" 
            : "bg-rose-950/60 text-rose-400 border-rose-500/30"
        }`}>
          Status: {isRunning ? "ON" : "OFF"} {pendingStatus && <span className="text-[9px] lowercase font-normal italic opacity-75 ml-1">(pending...)</span>}
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

        {(userRole === "admin" || userRole === "user") && (
          <div className="flex flex-col gap-2">
            {/* Dual button manual control */}
            <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Water Pump Control
              </span>
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() =>
                    handleToggle("ON", {
                      firmware_update: false,
                      motor_off: false,
                      motor_on: true,
                    })
                  }
                  disabled={pendingStatus === "ON"}
                  className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs border transition-all duration-300 flex items-center justify-center gap-2 ${
                    showOnHighlighted
                      ? `bg-green-600 text-white border-green-400 shadow-[0_0_15px_rgba(22,163,74,0.5)] scale-[1.02] ${pendingStatus === "ON" ? "animate-pulse cursor-wait" : ""}`
                      : "bg-slate-800/40 hover:bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200 cursor-pointer"
                  }`}
                >
                  🟢 ON {pendingStatus === "ON" && (
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
                <button
                  onClick={() =>
                    handleToggle("OFF", {
                      firmware_update: false,
                      motor_off: true,
                      motor_on: false,
                    })
                  }
                  disabled={pendingStatus === "OFF"}
                  className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs border transition-all duration-300 flex items-center justify-center gap-2 ${
                    showOffHighlighted
                      ? `bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-[1.02] ${pendingStatus === "OFF" ? "animate-pulse cursor-wait" : ""}`
                      : "bg-slate-800/40 hover:bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200 cursor-pointer"
                  }`}
                >
                  🔴 OFF {pendingStatus === "OFF" && (
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}