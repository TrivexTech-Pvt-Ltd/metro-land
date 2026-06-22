export interface DashboardData {
  Receiver: {
    Date: string;
    MotorStatus: string;
    Time: string;
    TransmitterCommunication: string;
    WaterLevel: string;
  };
  control: {
    firmware_update: boolean;
    motor_off: boolean;
    motor_on: boolean;
  };
  transmitter: {
    BatteryChargingStatus: string;
    BatteryCurrent: number;
    BatterySOC: number;
    BatteryVoltage: number;
    Date: string;
    Distance: number;
    FirmwareVersion: string;
    NetworkStrength: number;
    Time: string;
    WaterLevel: string;
    WaterVolume: number;
  };
}