"use client";

interface Props {
  voltage: number;
  chargingMode: string;
  current: number;
  soc: number;
}

export default function BatteryCard({
  voltage,
  chargingMode,
  current,
  soc,
}: Props) {
  const isCharging = chargingMode.toLowerCase() === "charging";

  // Use SOC directly for fillPercent
  const fillPercent = Math.min(100, Math.max(0, soc));

  const getColor = () => {
    if (fillPercent > 70) return "green";
    if (fillPercent > 30) return "yellow";
    return "red";
  };

  // Convert current from mA to A if current is a large value (typical mA reading from transmitter)
  const isMilliamps = current > 2;
  const currentVal = isMilliamps ? current / 1000 : current;
  const formattedCurrent = isMilliamps ? currentVal.toFixed(3) : currentVal.toFixed(2);

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
        <p><strong>State of Charge (SoC):</strong> {soc}%</p>
        <p><strong>Voltage:</strong> {voltage.toFixed(2)} V</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={isCharging ? "charging-text" : "not-charging"}>
            {chargingMode}
          </span>
        </p>
        <p><strong>Current:</strong> {formattedCurrent} A</p>
      </div>
    </div>
  );
}