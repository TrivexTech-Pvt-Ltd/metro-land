"use client";
import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "./lib/firebase";
import { DashboardData } from "./types/dashboard.types";
import BatteryCard from "./components/BatteryCard";
import WaterPumpCard from "./components/WaterPumpCard";
import WaterSystemCard from "./components/WaterSystemCard";
import Spinner from "./components/Spinner";

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dbRef = ref(database, "/");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePump = async (motorOn: boolean, motorOff: boolean) => {
    try {
      const dbRef = ref(database, "control");
      await update(dbRef, {
        motor_on: motorOn,
        motor_off: motorOff,
      });
    } catch (error) {
      console.error("Error updating pump status:", error);
    }
  };

  console.log("data", data);

  if (!data) return <Spinner fullPage />;

  // Calculate Main Tank Percentage assuming 5000L tank capacity
  const mainPercentage = Math.round(Math.min(100, Math.max(0, (data.transmitter.WaterVolume / 5000) * 100)));
  const mainFloat = data.transmitter.WaterLevel.toUpperCase() === "EMPTY" ? "LOW" : "NORMAL";

  // Sump Tank calculations based on Receiver WaterLevel status ("NotEmpty" | "Empty")
  const isSumpNotEmpty = data.Receiver.WaterLevel === "NotEmpty";
  const sumpPercentage = isSumpNotEmpty ? 100 : 0;
  const sumpCapacity = isSumpNotEmpty ? 2000 : 0; // Using 2000L capacity placeholder when water is present

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col items-center">

        {/* Compact Header */}
        <header className="w-full mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span className="bg-sky-500 text-white px-2 py-0.5 rounded">METRO</span> LAND
            </h1>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">
              Live Monitoring System
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            {/* Firmware Status */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Firmware</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-700 font-mono">
                    {data.transmitter.FirmwareVersion || "N/A"}
                  </span>
                  {data.control.firmware_update ? (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded animate-pulse">
                      UPDATE AVAILABLE
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      LATEST
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold uppercase text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                System Active
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-2 font-mono tabular-nums">
                <span>{currentTime.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span className="text-slate-300">|</span>
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl">

          {/* Main Monitoring Block - Left (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="w-full h-full flex justify-center lg:justify-start">
              <WaterSystemCard
                communicationStatus={data.Receiver.TransmitterCommunication}
                signalStrength={data.transmitter.NetworkStrength}
                mainCapacity={data.transmitter.WaterVolume}
                mainPercentage={mainPercentage}
                mainFloat={mainFloat}
                mainWaterLevel={data.transmitter.WaterLevel}
                sumpCapacity={sumpCapacity}
                sumpPercentage={sumpPercentage}
                sumpWaterLevel={data.Receiver.WaterLevel}
                sumpMotorStatus={data.Receiver.MotorStatus.toUpperCase()}
                mainUpdatedDate={data.transmitter.Date}
                mainUpdatedTime={data.transmitter.Time}
                sumpUpdatedDate={data.Receiver.Date}
                sumpUpdatedTime={data.Receiver.Time}
              />
            </div>
          </div>

          {/* Side Monitoring Block - Right (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="w-full flex-1 min-h-[220px]">
              <BatteryCard
                voltage={data.transmitter.BatteryVoltage}
                chargingMode={data.transmitter.BatteryChargingStatus}
                current={data.transmitter.BatteryCurrent}
                soc={data.transmitter.BatterySOC}
              />
            </div>

            <div className="w-full flex-1 min-h-[220px]">
              <WaterPumpCard
                motorOn={data.control.motor_on}
                motorOff={data.control.motor_off}
                sumpMotorStatus={data.Receiver.MotorStatus}
                onToggle={handleTogglePump}
              />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
