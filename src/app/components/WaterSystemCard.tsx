"use client";

interface Props {
  communication: string;
  mainLevel: number;
  sumpLevel: number;
  floatingSwitch: string;
  signalStrength: number;
}

export default function WaterSystemCard({
  communication,
  mainLevel,
  sumpLevel,
  floatingSwitch,
  signalStrength,
}: Props) {
  const isConnected = communication === "Connected";
  const isLow = floatingSwitch === "LOW";

  const mainPercent = Math.min((mainLevel / 200) * 100, 100);
  const sumpPercent = Math.min((sumpLevel / 200) * 100, 100);

  return (
    <div className="tank-system-container">
      <h2>💧 Water Monitoring System</h2>

      {/* Status Bar */}
      <div className="top-status">
        <span className={isConnected ? "status-green ml-3" : "status-red ml-3"}>
          ● {communication}
        </span>
        <span>📡 {signalStrength} dBm</span>
      </div>

      <div className="tank-row">
        {/* MAIN TANK */}
        <div className="tank-block">
          <div className="tank-body large">
            <div
              className="tank-water"
              style={{ height: `${mainPercent}%` }}
            />
            {isLow && (
              <div className="float-indicator">⚠ LOW</div>
            )}
          </div>
          <p>Main Tank</p>
          <p>{mainLevel} L</p>
        </div>

        {/* SUMP TANK */}
        <div className="tank-block">
          <div className="tank-body small">
            <div
              className="tank-water"
              style={{ height: `${sumpPercent}%` }}
            />
          </div>
          <p>Sump Tank</p>
          <p>{sumpLevel} L</p>
        </div>
      </div>
    </div>
  );
}