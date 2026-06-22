"use client";

interface Props {
  communicationStatus: string;
  signalStrength: number;
  mainCapacity: number;
  mainPercentage: number;
  mainFloat: string;
  mainWaterLevel: string;
  sumpCapacity: number;
  sumpPercentage: number;
  sumpWaterLevel: string;
  sumpMotorStatus: string;
  mainUpdatedDate?: string;
  mainUpdatedTime?: string;
  sumpUpdatedDate?: string;
  sumpUpdatedTime?: string;
}

export default function WaterSystemCard({
  communicationStatus,
  signalStrength,
  mainCapacity,
  mainPercentage,
  mainFloat,
  mainWaterLevel,
  sumpCapacity,
  sumpPercentage,
  sumpWaterLevel,
  sumpMotorStatus,
  mainUpdatedDate,
  mainUpdatedTime,
  sumpUpdatedDate,
  sumpUpdatedTime,
}: Props) {
  const isConnected = communicationStatus === "Connected";
  const isMainLow = mainFloat === "LOW";

  return (
    <div className="tank-system-container">
      <h2>💧 Water Monitoring System</h2>

      {/* Status Bar */}
      <div className="top-status">
        <span className={isConnected ? "status-green ml-3" : "status-red ml-3"}>
          ● {communicationStatus}
        </span>
        <span>📡 {signalStrength} dBm</span>
      </div>

      <div className="tank-row">
        {/* SUMP TANK */}
        <div className="tank-block">
          <div className="tank-body small">
            <div
              className="tank-water"
              style={{ height: "100%" }}
            />
          </div>
          <p>Sump Tank</p>
          {/* <p>{sumpCapacity.toFixed(0)} L</p> */}
          {/* <p className="text-xs text-slate-400">{sumpWaterLevel} · {sumpPercentage}%</p> */}
          <p className="text-xs text-slate-400">{sumpWaterLevel}</p>
          {sumpUpdatedDate && sumpUpdatedTime && (
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
             Last Updated: {sumpUpdatedDate} {sumpUpdatedTime}
            </p>
          )}
          {/* <p className="text-xs font-bold mt-1">
            Motor:{" "}
            <span className={sumpMotorStatus === "ON" ? "text-green-400" : "text-slate-400"}>
              {sumpMotorStatus}
            </span>
          </p> */}
        </div>

        {/* MAIN TANK */}
        <div className="tank-block">
          <div className="tank-body large">
            <div
              className="tank-water"
              style={{ height: "100%" }}
            />
            {isMainLow && (
              <div className="float-indicator">⚠ LOW</div>
            )}
          </div>
          <p>Main Tank</p>
          {/* <p>{mainCapacity.toFixed(0)} L</p> */}
          {/* <p className="text-xs text-slate-400">{mainWaterLevel} · {mainPercentage}%</p> */}
          <p className="text-xs text-slate-400">{mainWaterLevel}</p>
          {mainUpdatedDate && mainUpdatedTime && (
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Last Updated: {mainUpdatedDate} {mainUpdatedTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}