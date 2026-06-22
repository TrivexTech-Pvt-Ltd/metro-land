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
  const isSumpMotorOn = sumpMotorStatus === "ON";

  return (
    <div className="tank-system-container">
      {/* Status Bar */}
      <h2>💧 Water Monitoring System</h2>

      {/* Status Bar */}
      <div className="top-status">
        <span className={isConnected ? "status-green ml-3" : "status-red ml-3"}>
          ● {communicationStatus}
        </span>
        <span>📡 {signalStrength}</span>
      </div>

      <div className="tank-row">
        {/* SUMP TANK */}
        <div className="tank-body large">
          <div
            className="tank-water"
            style={{ height: "100%" }}
          />
        </div>

        {/* CONNECTOR ARROW */}
        <div className="tank-connector">
          <svg
            className={`connector-arrow ${isSumpMotorOn ? "active" : ""}`}
            width="80"
            height="40"
            viewBox="0 0 80 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0,20 L 80,20"
              className="arrow-track"
              stroke="#334155"
              strokeWidth="6"
            />
            <path
              d="M 45,10 L 55,20 L 45,30"
              className="arrow-head"
              stroke={isSumpMotorOn ? "#38bdf8" : "#94a3b8"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {isSumpMotorOn && (
              <path
                d="M 0,20 L 75,20"
                className="arrow-flow"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
              />
            )}
          </svg>
        </div>

        {/* MAIN TANK */}
        <div className="tank-body large">
          <div
            className="tank-water"
            style={{ height: "100%" }}
          />
          {isMainLow && (
            <div className="float-indicator">⚠ LOW</div>
          )}
        </div>
      </div>

      {/* TANK LABELS & INFO */}
      <div className="tank-info-row">
        <div className="tank-info-block">
          <p className="tank-label">Sump Tank</p>
          <p className="text-xs text-slate-400">{sumpWaterLevel}</p>
          {sumpUpdatedDate && sumpUpdatedTime && (
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Last Updated: {sumpUpdatedDate} {sumpUpdatedTime}
            </p>
          )}
        </div>

        <div className="info-spacer" />

        <div className="tank-info-block">
          <p className="tank-label">Main Tank</p>
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