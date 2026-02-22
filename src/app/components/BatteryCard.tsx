"use client";

interface Props {
  soc: number;
  chargingMode: string;
  current: number;
}

export default function BatteryCard({
  soc,
  chargingMode,
  current,
}: Props) {
  const isCharging = chargingMode.toLowerCase() === "charging";

  const getColor = () => {
    if (soc > 70) return "green";
    if (soc > 30) return "yellow";
    return "red";
  };

  return (
    <div className="battery-container">
      <h2>🔋 Battery Health</h2>

      <div className="battery-wrapper">
        <div className="battery-body">
          <div
            className={`battery-level ${getColor()} ${isCharging ? "charging-wave" : ""
              }`}
            style={{ width: `${soc}%` }}
          />

          {isCharging && <div className="lightning">⚡</div>}
        </div>

        <div className="battery-cap" />
      </div>

      <div className="battery-info">
        <p><strong>SOC:</strong> {soc}%</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={isCharging ? "charging-text" : "not-charging"}>
            {chargingMode}
          </span>
        </p>
        <p><strong>Current:</strong> {current} A</p>
      </div>
    </div>
  );
}