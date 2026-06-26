"use client";
import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "./lib/firebase";
import { DashboardData } from "./types/dashboard.types";
import BatteryCard from "./components/BatteryCard";
import WaterPumpCard from "./components/WaterPumpCard";
import WaterSystemCard from "./components/WaterSystemCard";
import Spinner from "./components/Spinner";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manage body scroll and key listeners for the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Protect dashboard - redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

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

  const handleTogglePump = async (control: {
    firmware_update: boolean;
    motor_off: boolean;
    motor_on: boolean;
  }) => {
    if (user?.role !== "admin") {
      console.warn("Unauthorized attempt to control pump");
      return;
    }
    try {
      const dbRef = ref(database, "control");
      await update(dbRef, control);
    } catch (error) {
      console.error("Error updating pump status:", error);
    }
  };

  console.log("data", data);

  if (authLoading || !user) return <Spinner fullPage />;
  if (!data) return <Spinner fullPage />;

  // Calculate Main Tank Percentage assuming 5000L tank capacity
  const mainPercentage = Math.round(Math.min(100, Math.max(0, (data.transmitter.WaterVolume / 5000) * 100)));
  const mainFloat = data.transmitter.WaterLevel.toUpperCase() === "EMPTY" ? "LOW" : "NORMAL";

  // Sump Tank calculations based on Receiver WaterLevel status ("NotEmpty" | "Empty")
  const isSumpNotEmpty = data.Receiver.WaterLevel === "NotEmpty";
  const sumpPercentage = isSumpNotEmpty ? 100 : 0;
  const sumpCapacity = isSumpNotEmpty ? 2000 : 0; // Using 2000L capacity placeholder when water is present

  // Firebase Data Table mapping for Admin
  interface DataRow {
    path: string;
    category: "Transmitter" | "Receiver" | "Control";
    parameter: string;
    value: string | number | boolean;
    unit?: string;
    type: "string" | "number" | "boolean";
    description: string;
  }

  const tableData: DataRow[] = data ? [
    // Transmitter
    {
      path: "transmitter.WaterVolume",
      category: "Transmitter",
      parameter: "Water Volume",
      value: data.transmitter.WaterVolume,
      unit: "L",
      type: "number",
      description: "Current volume of water in the transmitter tank"
    },
    {
      path: "transmitter.WaterLevel",
      category: "Transmitter",
      parameter: "Water Level Status",
      value: data.transmitter.WaterLevel,
      type: "string",
      description: "Discrete water level status (e.g., EMPTY, NORMAL)"
    },
    {
      path: "transmitter.Distance",
      category: "Transmitter",
      parameter: "Water Distance",
      value: data.transmitter.Distance,
      unit: "cm",
      type: "number",
      description: "Measured distance from sensor to water surface"
    },
    {
      path: "transmitter.BatteryVoltage",
      category: "Transmitter",
      parameter: "Battery Voltage",
      value: data.transmitter.BatteryVoltage,
      unit: "V",
      type: "number",
      description: "Transmitter battery terminal voltage"
    },
    {
      path: "transmitter.BatteryCurrent",
      category: "Transmitter",
      parameter: "Battery Current",
      value: data.transmitter.BatteryCurrent,
      unit: "A",
      type: "number",
      description: "Current draw (positive) or charge current (negative)"
    },
    {
      path: "transmitter.BatterySOC",
      category: "Transmitter",
      parameter: "Battery State of Charge",
      value: data.transmitter.BatterySOC,
      unit: "%",
      type: "number",
      description: "Remaining battery percentage"
    },
    {
      path: "transmitter.BatteryChargingStatus",
      category: "Transmitter",
      parameter: "Battery Charging Status",
      value: data.transmitter.BatteryChargingStatus,
      type: "string",
      description: "Current battery charging state"
    },
    {
      path: "transmitter.NetworkStrength",
      category: "Transmitter",
      parameter: "Network Strength",
      value: data.transmitter.NetworkStrength,
      unit: "",
      type: "number",
      description: "Network Strength"
    },
    {
      path: "transmitter.FirmwareVersion",
      category: "Transmitter",
      parameter: "Firmware Version",
      value: data.transmitter.FirmwareVersion,
      type: "string",
      description: "Current active firmware version"
    },
    {
      path: "transmitter.Date",
      category: "Transmitter",
      parameter: "Last Updated Date",
      value: data.transmitter.Date,
      type: "string",
      description: "Date of the last payload transmission"
    },
    {
      path: "transmitter.Time",
      category: "Transmitter",
      parameter: "Last Updated Time",
      value: data.transmitter.Time,
      type: "string",
      description: "Time of the last payload transmission"
    },

    // Receiver
    {
      path: "Receiver.WaterLevel",
      category: "Receiver",
      parameter: "Sump Water Level",
      value: data.Receiver.WaterLevel,
      type: "string",
      description: "Water level status of the receiver/sump tank"
    },
    {
      path: "Receiver.MotorStatus",
      category: "Receiver",
      parameter: "Motor Status",
      value: data.Receiver.MotorStatus,
      type: "string",
      description: "Current status of the water pump motor"
    },
    {
      path: "Receiver.TransmitterCommunication",
      category: "Receiver",
      parameter: "Transmitter Comm Status",
      value: data.Receiver.TransmitterCommunication,
      type: "string",
      description: "Communication link status with the transmitter"
    },
    {
      path: "Receiver.Date",
      category: "Receiver",
      parameter: "Last Updated Date",
      value: data.Receiver.Date,
      type: "string",
      description: "Date of the last receiver packet"
    },
    {
      path: "Receiver.Time",
      category: "Receiver",
      parameter: "Last Updated Time",
      value: data.Receiver.Time,
      type: "string",
      description: "Time of the last receiver packet"
    },

    // Control
    {
      path: "control.motor_on",
      category: "Control",
      parameter: "Force Motor On",
      value: data.control.motor_on,
      type: "boolean",
      description: "Command to manually force the motor ON"
    },
    {
      path: "control.motor_off",
      category: "Control",
      parameter: "Force Motor Off",
      value: data.control.motor_off,
      type: "boolean",
      description: "Command to manually force the motor OFF"
    },
    {
      path: "control.firmware_update",
      category: "Control",
      parameter: "Trigger Firmware Update",
      value: data.control.firmware_update,
      type: "boolean",
      description: "Flag indicating a pending firmware update"
    }
  ] : [];

  const filteredTableData = tableData.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      row.path.toLowerCase().includes(searchLower) ||
      row.category.toLowerCase().includes(searchLower) ||
      row.parameter.toLowerCase().includes(searchLower) ||
      String(row.value).toLowerCase().includes(searchLower)
    );
  });

  const renderValue = (row: DataRow) => {
    if (row.type === "boolean") {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${row.value
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
            : "bg-slate-100 text-slate-500 border-slate-200"
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.value ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
          {row.value ? "TRUE" : "FALSE"}
        </span>
      );
    }

    if (row.type === "number") {
      const val = row.value as number;
      const unit = row.unit || "";

      if (row.path === "transmitter.BatterySOC") {
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-700">{val}{unit}</span>
            <div className="w-16 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 hidden sm:block">
              <div
                className={`h-full rounded-full transition-all duration-500 ${val > 50 ? "bg-green-500" : val > 20 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        );
      }

      if (row.path === "transmitter.WaterVolume") {
        const pct = Math.round(Math.min(100, (val / 5000) * 100));
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-700">{val.toLocaleString()}{unit}</span>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              {pct}%
            </span>
          </div>
        );
      }

      return (
        <span className="font-mono font-bold text-slate-700">
          {val}
          {unit && <span className="text-slate-400 font-medium ml-0.5">{unit}</span>}
        </span>
      );
    }

    const strVal = String(row.value);

    if (row.path === "Receiver.MotorStatus" || strVal.toUpperCase() === "ON" || strVal.toUpperCase() === "OFF") {
      const isOn = strVal.toUpperCase() === "ON";
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${isOn
            ? "bg-green-50 text-green-700 border-green-200 shadow-xs"
            : "bg-rose-50 text-rose-700 border-rose-200 shadow-xs"
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOn ? "bg-green-500 animate-pulse" : "bg-rose-500"}`}></span>
          {strVal.toUpperCase()}
        </span>
      );
    }

    if (strVal.toUpperCase() === "EMPTY" || strVal.toUpperCase() === "LOW") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          ⚠️ {strVal}
        </span>
      );
    }

    if (strVal.toUpperCase() === "NOTEMPTY" || strVal.toUpperCase() === "NORMAL" || strVal.toUpperCase() === "FULL") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
          ✨ {strVal}
        </span>
      );
    }

    if (row.path === "Receiver.TransmitterCommunication") {
      const isOk = strVal.toLowerCase() === "ok" || strVal.toUpperCase() === "CONNECTED";
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all duration-300 whitespace-nowrap ${isOk
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
          {isOk ? "🟢 CONNECTED" : "🔴 DISCONNECTED"}
        </span>
      );
    }

    return <span className="font-bold text-slate-700">{strVal}</span>;
  };

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

          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-xs animate-fade-in">
              <span className="text-xs font-bold text-slate-500">
                Logged as <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${user?.role === "admin"
                    ? "bg-sky-100 text-sky-700 border border-sky-200"
                    : "bg-slate-200 text-slate-600 border border-slate-300"
                  }`}>{user?.role}</span>
              </span>
            </div>

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

            {/* System Status & Time */}
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

            {/* Firebase Data Modal Button (Admin only) */}
            {user?.role === "admin" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 hover:text-sky-800 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
                </svg>
                <span>Firebase Data</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95"
            >
              <span>Logout</span>
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
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
            <div className="w-full flex-1 min-h-[280px] lg:min-h-[220px]">
              <BatteryCard
                voltage={data.transmitter.BatteryVoltage}
                chargingMode={data.transmitter.BatteryChargingStatus}
                current={data.transmitter.BatteryCurrent}
                soc={data.transmitter.BatterySOC}
              />
            </div>

            <div className="w-full flex-1 min-h-[280px] lg:min-h-[220px]">
              <WaterPumpCard
                control={data.control}
                sumpMotorStatus={data.Receiver.MotorStatus}
                onToggle={handleTogglePump}
                userRole={user?.role || "user"}
              />
            </div>
          </div>

        </div>

        {/* Firebase Data Modal */}
        {isModalOpen && user?.role === "admin" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-fade-in">
            {/* Click outside to close */}
            <div
              className="absolute inset-0 cursor-default"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col overflow-hidden animate-scale-up z-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span className="bg-sky-500 text-white p-1.5 rounded-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </span>
                    Firebase Data
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Real-time database payload and parameter values
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Control */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search parameters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 font-black text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl transition-all duration-200 cursor-pointer text-sm font-black flex items-center justify-center"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-5">Path</th>
                        <th className="py-4 px-5">Category</th>
                        <th className="py-4 px-5">Parameter</th>
                        <th className="py-4 px-5">Value</th>
                        <th className="py-4 px-5 hidden md:table-cell">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60">
                      {filteredTableData.length > 0 ? (
                        filteredTableData.map((row) => (
                          <tr
                            key={row.path}
                            className="group hover:bg-slate-50/40 transition-all duration-200 text-xs text-slate-600"
                          >
                            <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400 group-hover:text-slate-700 transition-colors">
                              <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">
                                {row.path}
                              </span>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${row.category === "Transmitter"
                                  ? "bg-sky-50 text-sky-700 border-sky-100"
                                  : row.category === "Receiver"
                                    ? "bg-violet-50 text-violet-700 border-violet-100"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                }`}>
                                {row.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 font-black text-slate-700">
                              {row.parameter}
                            </td>
                            <td className="py-3.5 px-5">
                              {renderValue(row)}
                            </td>
                            <td className="py-3.5 px-5 text-slate-400 font-medium hidden md:table-cell">
                              {row.description}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                            No matching parameters found for "{searchTerm}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6">
                <div>
                  Showing {filteredTableData.length} of {tableData.length} parameters
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                  <span>Live Feed Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
