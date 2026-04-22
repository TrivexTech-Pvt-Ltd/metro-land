"use client";

interface Props {
  motorOn: boolean;
  motorOff: boolean;
  onToggle: (newValue: boolean) => void;
}

export default function WaterPumpCard({ motorOn, motorOff, onToggle }: Props) {
  // motor is running when motorOn is true OR motorOff is false
  const isRunning = motorOn && !motorOff;

  return (
    <div className="pump-container">
      <div className="flex justify-between items-center">
        <h2>🚰 Water Pump</h2>
        <div className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-700">
          Manual Override
        </div>
      </div>

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

      <div className="flex flex-col">
        <p className={isRunning ? "pump-on font-bold" : "pump-off font-bold"}>
          Status: {isRunning ? "ON" : "OFF"}
        </p>

        <div className="toggle-group mb-3">
          <span className="toggle-label uppercase tracking-tighter">Water Pump Control</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isRunning}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}