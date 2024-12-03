interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}

export interface ClientInfo {
  dnsInfo?: string;
  systemTime: string;
  timezone: string;
  browserInfo: string;
  operatingSystem: string;
  cookie: string;
  language: string;
  screenSize: {
    width: number;
    height: number;
  };
  javascriptEnabled: boolean;
  cookiesEnabled: boolean;
  storageAvailable: boolean;
  hardwareInfo: {
    cpuCores: number;
  };
  batteryInfo?: {
    charging: boolean;
    level: number;
  };
}

export async function getClientInfoV1(): Promise<ClientInfo> {
  const info: ClientInfo = {
    systemTime: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    browserInfo: navigator.userAgent,
    operatingSystem: navigator.platform,
    cookie: document.cookie,
    language: navigator.language,
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    javascriptEnabled: true,
    cookiesEnabled: navigator.cookieEnabled,
    storageAvailable: typeof localStorage !== 'undefined',
    hardwareInfo: {
      cpuCores: navigator.hardwareConcurrency || 1,
    },
  };

  // Get battery info if available
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery!();
      info.batteryInfo = {
        charging: battery.charging,
        level: battery.level,
      };
    }
  } catch (e) {
    // Battery API not available
    console.error(e);
  }

  return info;
}