// ============================================================================
// TRADEPASS™ TEST SETUP
// Jest configuration and global test setup for TradePass testing
// ============================================================================

import 'react-native-gesture-handler/jestSetup';

// Mock Expo modules
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  requestBackgroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  startLocationUpdatesAsync: jest.fn(),
  stopLocationUpdatesAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: {
    BestForNavigation: 6,
    Highest: 6,
    High: 5,
    Balanced: 4,
    Low: 3,
    Lowest: 1,
  },
  ActivityType: {
    Other: 1,
    AutomotiveNavigation: 2,
    Fitness: 3,
    OtherNavigation: 4,
    Airborne: 5,
  },
}));

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn(),
  unregisterTaskAsync: jest.fn(),
  getTaskOptionsAsync: jest.fn(),
}));

jest.mock('expo-background-fetch', () => ({
  registerTaskAsync: jest.fn(),
  unregisterTaskAsync: jest.fn(),
  getStatusAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: 'newData',
    NoData: 'noData',
    Failed: 'failed',
  },
  BackgroundFetchStatus: {
    Denied: 1,
    Restricted: 2,
    Available: 3,
  },
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  AndroidImportance: {
    MAX: 5,
    HIGH: 4,
    DEFAULT: 3,
    LOW: 2,
    MIN: 1,
  },
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
  openSettings: jest.fn(),
  canOpenURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(),
  }),
  usePathname: () => '/',
  useLocalSearchParams: () => ({}),
  Stack: ({ children }: { children: any }) => children,
  Tabs: ({ children }: { children: any }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  mergeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return Object.setPrototypeOf(
    {
      ...RN,
      Platform: {
        ...RN.Platform,
        OS: 'ios',
        select: ({ ios, android }: { ios?: any; android?: any }) => ios || android,
      },
      Alert: {
        alert: jest.fn(),
      },
      Linking: {
        openURL: jest.fn(),
        openSettings: jest.fn(),
        canOpenURL: jest.fn(),
      },
      Dimensions: {
        get: jest.fn(() => ({
          width: 375,
          height: 812,
        })),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      StatusBar: {
        setBarStyle: jest.fn(),
        setBackgroundColor: jest.fn(),
        setTranslucent: jest.fn(),
      },
      Animated: {
        ...RN.Animated,
        timing: jest.fn(() => ({
          start: jest.fn(),
          stop: jest.fn(),
          reset: jest.fn(),
        })),
        loop: jest.fn(() => ({
          start: jest.fn(),
          stop: jest.fn(),
          reset: jest.fn(),
        })),
        sequence: jest.fn(() => ({
          start: jest.fn(),
          stop: jest.fn(),
          reset: jest.fn(),
        })),
        Value: jest.fn(() => ({
          setValue: jest.fn(),
          setOffset: jest.fn(),
          flattenOffset: jest.fn(),
          extractOffset: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          removeAllListeners: jest.fn(),
        })),
      },
    },
    RN
  );
});

// Mock Zustand
jest.mock('zustand', () => ({
  create: jest.fn(() => ({
    getState: jest.fn(),
    setState: jest.fn(),
    subscribe: jest.fn(),
    destroy: jest.fn(),
  })),
}));

jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
  createJSONStorage: () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

// Global test configuration
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Suppress specific warnings
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

// Global test timeout
jest.setTimeout(30000);

// Custom matchers for GPS testing
expect.extend({
  toBeValidGPSCoordinates(received: { latitude: number; longitude: number }) {
    const { latitude, longitude } = received;
    
    const isValidLatitude = latitude >= -90 && latitude <= 90;
    const isValidLongitude = longitude >= -180 && longitude <= 180;
    
    const pass = isValidLatitude && isValidLongitude;
    
    if (pass) {
      return {
        message: () =>
          `expected coordinates (${latitude}, ${longitude}) not to be valid GPS coordinates`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected coordinates (${latitude}, ${longitude}) to be valid GPS coordinates (lat: -90 to 90, lon: -180 to 180)`,
        pass: false,
      };
    }
  },

  toBeWithinDistance(
    received: { latitude: number; longitude: number },
    expected: { latitude: number; longitude: number },
    maxDistance: number
  ) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (expected.latitude - received.latitude) * Math.PI / 180;
    const dLon = (expected.longitude - received.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(received.latitude * Math.PI / 180) * Math.cos(expected.latitude * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    const pass = distance <= maxDistance;
    
    if (pass) {
      return {
        message: () =>
          `expected distance ${distance.toFixed(2)}m to be greater than ${maxDistance}m`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected distance ${distance.toFixed(2)}m to be within ${maxDistance}m`,
        pass: false,
      };
    }
  },

  toHaveGovernmentGradeAccuracy(received: { accuracy: number }) {
    const pass = received.accuracy <= 10; // Government-grade: ≤ 10m
    
    if (pass) {
      return {
        message: () =>
          `expected accuracy ${received.accuracy}m not to meet government-grade standards (≤ 10m)`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected accuracy ${received.accuracy}m to meet government-grade standards (≤ 10m)`,
        pass: false,
      };
    }
  },

  toBeInGhana(received: { latitude: number; longitude: number }) {
    const { latitude, longitude } = received;
    
    // Ghana approximate bounds
    const isInGhana = 
      latitude >= 4.5 && latitude <= 11.5 &&
      longitude >= -3.5 && longitude <= 1.5;
    
    if (isInGhana) {
      return {
        message: () =>
          `expected coordinates (${latitude}, ${longitude}) not to be in Ghana`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected coordinates (${latitude}, ${longitude}) to be within Ghana bounds`,
        pass: false,
      };
    }
  },
});

// Extend Jest matchers type definitions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGPSCoordinates(): R;
      toBeWithinDistance(expected: { latitude: number; longitude: number }, maxDistance: number): R;
      toHaveGovernmentGradeAccuracy(): R;
      toBeInGhana(): R;
    }
  }
}