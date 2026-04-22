"use client";

interface Props {
  voltage: number;
  chargingMode: string;
  current: number;
}

export default function BatteryCard({
  voltage,
  chargingMode,
  current,
}: Props) {
  const isCharging = chargingMode.toLowerCase() === "charging";

  // Voltage range: 11.0V (empty) to 14.4V (full)
  const MIN_V = 11.0;
  const MAX_V = 14.4;
  const fillPercent = Math.min(
    100,
    Math.max(0, ((voltage - MIN_V) / (MAX_V - MIN_V)) * 100)
  );

  const getColor = () => {
    if (fillPercent > 70) return "green";
    if (fillPercent > 30) return "yellow";
    return "red";
  };

  return (
    <div className="battery-container">
      <h2>🔋 Battery Health</h2>

      <div className="battery-wrapper">
        <div className="battery-body">
          <div
            className={`battery-level ${getColor()} ${isCharging ? "charging-wave" : ""}`}
            style={{ width: `${fillPercent}%` }}
          />

          {isCharging && <div className="lightning">⚡</div>}
        </div>

        <div className="battery-cap" />
      </div>

      <div className="battery-info">
        <p><strong>Voltage:</strong> {voltage.toFixed(2)} V</p>
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