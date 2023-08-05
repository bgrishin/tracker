export interface DataObjectInterface {
  platform: string;
  ip: string;
  languages: readonly string[];
  screenResolution: string;
  timezone: string;
  cpuCores: number;
  ram: number;
  // batteryInfo: any;
  browserVersion: string;
  webcamPhoto: any | null;
  position: {
    latidute: number | null;
    longitude: number | null;
    googleMaps: string | null;
    accuracy: number | null;
  };
}
