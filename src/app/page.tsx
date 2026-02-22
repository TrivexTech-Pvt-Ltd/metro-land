"use client";
import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
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

  const handleTogglePump = async (newValue: string) => {
    try {
      const pumpRef = ref(database, "control/vfd_command");
      await set(pumpRef, newValue);
    } catch (error) {
      console.error("Error updating pump status:", error);
    }
  };

  console.log("data", data)

  if (!data) return <Spinner fullPage />;

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
                {data.control.firmware_update ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-green-600">UPDATE AVAILABLE</span>
                    <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1 rounded">V2.0.4</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                    UP TO DATE
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold uppercase text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                System Active
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="hidden sm:block w-28">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl">

          {/* Main Monitoring Block - Left (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="w-full h-full flex justify-center lg:justify-start">
              <WaterSystemCard
                communication={data.water_system.communication}
                mainLevel={data.water_system.main_level}
                sumpLevel={data.water_system.sump_level}
                floatingSwitch={data.water_system.floating_switch}
                signalStrength={data.water_system.signal_strength}
              />
            </div>

          </div>

          {/* Side Monitoring Block - Right (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="w-full flex-1 min-h-[220px]">
              <BatteryCard
                soc={data.battery.soc}
                chargingMode={data.battery.charging_mode}
                current={data.battery.current}
              />
            </div>

            <div className="w-full flex-1 min-h-[220px]">
              <WaterPumpCard
                vfdCommand={data.control.vfd_command}
                onToggle={handleTogglePump}
              />
            </div>
          </div>




        </div>


      </main>
    </div>
  );
}


