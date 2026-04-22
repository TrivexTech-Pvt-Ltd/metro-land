export interface DashboardData {
  battery: {
    charging_mode: string;
    current: number;
    voltage: number;
  };
  communication: {
    signal_strength: number;
    status: string;
  };
  control: {
    firmware_update: boolean;
    motor_off: boolean;
    motor_on: boolean;
  };
  main_tank: {
    capacity_l: number;
    distance_cm: number;
    float: string;
    percentage: number;
    water_level: string;
  };
  sump_tank: {
    capacity_l: number;
    distance_cm: number;
    float: string;
    motor_status: string;
    percentage: number;
    water_level: string;
  };
}