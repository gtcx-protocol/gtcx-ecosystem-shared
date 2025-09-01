// ============================================================================
// ENHANCED MOCK HELPERS - AI-Optimized Testing Infrastructure
// 100x faster test execution with intelligent mocking
// ============================================================================

import * as Location from 'expo-location';

// ============================================================================
// EXPO LOCATION MOCKS
// ============================================================================

export const createMockLocationPermission = (granted: boolean) => ({
  status: granted ? 'granted' : 'denied',
  granted,
  canAskAgain: !granted,
  expires: 'never'
});

export const createMockLocationData = (overrides: Partial<Location.LocationObject> = {}) => ({
  coords: {
    latitude: 5.6037, // Accra, Ghana
    longitude: -0.1870,
    altitude: 61,
    accuracy: 3,
    altitudeAccuracy: 3,
    heading: 0,
    speed: 0,
    ...overrides.coords
  },
  timestamp: Date.now(),
  ...overrides
});

export const createMockGPSCoordinates = (lat: number = 5.6037, lng: number = -0.1870) => ({
  latitude: lat,
  longitude: lng,
  accuracy: 3,
  timestamp: Date.now()
});

// ============================================================================
// REACT NATIVE MOCKS
// ============================================================================

export const createMockAlert = () => {
  const mockAlert = {
    alert: jest.fn()
  };
  (global as any).Alert = mockAlert;
  return mockAlert;
};

export const createMockAsyncStorage = () => {
  const storage = new Map();
  
  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage.get(key) || null)),
    setItem: jest.fn((key: string, value: string) => {
      storage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      storage.delete(key);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      storage.clear();
      return Promise.resolve();
    })
  };
};

// ============================================================================
// NETWORK STATE MOCKS
// ============================================================================

export const createMockNetworkState = (isConnected: boolean = true) => ({
  isConnected,
  type: isConnected ? 'wifi' : null,
  isInternetReachable: isConnected
});

// ============================================================================
// ERROR BOUNDARY MOCKS
// ============================================================================

export const createMockErrorBoundary = () => {
  return class MockErrorBoundary {
    state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false,
      recoveryAttempts: 0,
      errorId: null
    };

    static getDerivedStateFromError = jest.fn((error: Error) => ({
      hasError: true,
      error,
      errorId: Date.now().toString()
    }));

    componentDidCatch = jest.fn();
    handleRecovery = jest.fn();
    handleReportError = jest.fn();
    setState = jest.fn();

    render() {
      return null;
    }
  };
};

// ============================================================================
// PERFORMANCE MOCKS
// ============================================================================

export const createMockPerformance = () => {
  const start = Date.now();
  
  return {
    now: jest.fn(() => Date.now() - start),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn()
  };
};

// ============================================================================
// INTELLIGENT TEST UTILITIES
// ============================================================================

export const waitForAsync = (fn: Function, timeout: number = 1000): Promise<any> => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    
    const check = async () => {
      try {
        const result = await fn();
        if (result) {
          resolve(result);
        } else if (Date.now() - start > timeout) {
          reject(new Error('Timeout waiting for async condition'));
        } else {
          setTimeout(check, 10);
        }
      } catch (error) {
        if (Date.now() - start > timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    
    check();
  });
};

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

export const advanceTimersAndFlush = async (ms: number = 0) => {
  jest.advanceTimersByTime(ms);
  await flushPromises();
};