export interface DashboardData {
  battery: {
    charging_mode: string;
    current: number;
    soc: number;
  };
  control: {
    firmware_update: boolean;
    vfd_command: string;
  };
  water_system: {
    communication: string;
    floating_switch: string;
    main_level: number;
    signal_strength: number;
    sump_level: number;
  };
}