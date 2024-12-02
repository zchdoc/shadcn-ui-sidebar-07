// 定义客户端信息接口
interface ClientInfo {
  // 系统和浏览器信息
  userAgent: string;
  browserInfo: {
    name: string;
    version: string;
    language: string;
    cookiesEnabled: boolean;
    jsEnabled: boolean;
  };
  operatingSystem: string;
  
  // 时间和地区信息
  systemTime: string;
  timeZone: string;
  
  // 设备信息
  screenInfo: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  windowSize: {
    width: number;
    height: number;
  };
  
  // 存储信息
  storageAvailable: {
    localStorage: boolean;
    sessionStorage: boolean;
    cookiesEnabled: boolean;
  };
  storageContent: {
    localStorage: Record<string, string>;
    sessionStorage: Record<string, string>;
  };
  
  // 硬件信息
  hardwareInfo: {
    cpuCores: number;
    deviceMemory: number;
    maxTouchPoints: number;
    batteryStatus?: {
      charging: boolean;
      level: number;
      chargingTime?: number;
      dischargingTime?: number;
    };
  };
  
  // 网络信息
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

// 添加 Battery API 的类型声明
interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
  mozGetBattery?: () => Promise<BatteryManager>;
  webkitGetBattery?: () => Promise<BatteryManager>;
}

export async function getClientInfoV2(): Promise<ClientInfo> {
  // 检查是否在客户端环境
  const isClient = typeof window !== 'undefined';
  
  if (!isClient) {
    return getServerSideDefaultInfo();
  }

  try {
    // 基本浏览器信息
    const ua = navigator.userAgent;
    const browserInfo = {
      name: getBrowserName(ua),
      version: getBrowserVersion(ua),
      language: navigator.language || 'unknown',
      cookiesEnabled: navigator.cookieEnabled,
      jsEnabled: true
    };

    // 系统信息
    const operatingSystem = getOperatingSystem(ua);

    // 时间信息
    const systemTime = new Date().toISOString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 屏幕和窗口信息
    const screenInfo = {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio
    };

    const windowSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // 存储可用性和内容
    const storageAvailable = {
      localStorage: isStorageAvailable('localStorage'),
      sessionStorage: isStorageAvailable('sessionStorage'),
      cookiesEnabled: navigator.cookieEnabled
    };

    const storageContent = {
      localStorage: storageAvailable.localStorage ? getStorageContent('localStorage') : {},
      sessionStorage: storageAvailable.sessionStorage ? getStorageContent('sessionStorage') : {}
    };

    // 获取电池信息
    let batteryStatus;
    if (typeof navigator !== 'undefined') {
      try {
        console.log('Checking battery API availability...');
        
        const nav = navigator as NavigatorWithBattery;
        // 检查不同的 Battery API 实现
        const getBatteryMethod = nav.getBattery || nav.mozGetBattery || nav.webkitGetBattery;

        if (getBatteryMethod) {
          console.log('Battery API found, attempting to get battery info...');
          const battery = await getBatteryMethod.call(nav);
          console.log('Raw battery info:', battery);

          if (battery) {
            batteryStatus = {
              charging: battery.charging,
              level: Math.round(battery.level * 100), // 转换为百分比
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime
            };

            // 添加电池事件监听器
            battery.addEventListener('chargingchange', () => {
              console.log('Battery charging changed:', battery.charging);
            });

            battery.addEventListener('levelchange', () => {
              console.log('Battery level changed:', battery.level);
            });

            console.log('Processed battery status:', batteryStatus);
          } else {
            console.log('Battery object is null or undefined');
          }
        } else {
          console.log('No Battery API implementation found');
        }
      } catch (e) {
        console.warn('Battery API error:', e);
      }
    } else {
      console.log('Navigator not available (server-side rendering)');
    }

    // 构建硬件信息对象
    const hardwareInfo = {
      cpuCores: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      batteryStatus // 如果获取失败，这里会是 undefined
    };

    console.log('Final hardware info:', hardwareInfo);

    // 网络信息
    let connection;
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      connection = {
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0
      };
    }

    return {
      userAgent: ua,
      browserInfo,
      operatingSystem,
      systemTime,
      timeZone,
      screenInfo,
      windowSize,
      storageAvailable,
      storageContent,
      hardwareInfo,
      connection
    };
  } catch (error) {
    console.error('Error getting client info:', error);
    return getServerSideDefaultInfo();
  }
}

// 辅助函数
function getBrowserName(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getBrowserVersion(ua: string): string {
  const match = ua.match(/(firefox|chrome|safari|opera|edge)[/\s](\d+(\.\d+)?)/i);
  return match ? match[2] : 'unknown';
}

function getOperatingSystem(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
}

function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

// 获取存储内容
function getStorageContent(type: 'localStorage' | 'sessionStorage'): Record<string, string> {
  try {
    const storage = window[type];
    const content: Record<string, string> = {};
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        const value = storage.getItem(key);
        if (value) {
          content[key] = value;
        }
      }
    }
    
    return content;
  } catch (error) {
    console.error(`Error getting ${type} content:`, error);
    return {};
  }
}

// 服务器端默认信息
function getServerSideDefaultInfo(): ClientInfo {
  return {
    userAgent: 'server-side',
    browserInfo: {
      name: 'server-side',
      version: 'server-side',
      language: 'server-side',
      cookiesEnabled: false,
      jsEnabled: false
    },
    operatingSystem: 'server-side',
    systemTime: new Date().toISOString(),
    timeZone: 'UTC',
    screenInfo: {
      width: 0,
      height: 0,
      colorDepth: 0,
      pixelRatio: 1
    },
    windowSize: {
      width: 0,
      height: 0
    },
    storageAvailable: {
      localStorage: false,
      sessionStorage: false,
      cookiesEnabled: false
    },
    storageContent: {
      localStorage: {},
      sessionStorage: {}
    },
    hardwareInfo: {
      cpuCores: 0,
      deviceMemory: 0,
      maxTouchPoints: 0
    }
  };
}