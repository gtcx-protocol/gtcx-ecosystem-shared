// ============================================================================
// CUSTOM JEST MATCHERS - GPS & Mining-Specific Test Utilities
// Intelligent test assertions for mining operations
// ============================================================================

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGPSCoordinate(type: 'latitude' | 'longitude'): R;
      toBeWithinDistance(target: { latitude: number; longitude: number }, maxDistance: number): R;
      toBeValidMiningLocation(): R;
      toHaveValidAccuracy(minAccuracy?: number): R;
    }
  }
}

// ============================================================================
// GPS COORDINATE MATCHERS
// ============================================================================

expect.extend({
  toBeValidGPSCoordinate(received: number, type: 'latitude' | 'longitude') {
    const isLatitude = type === 'latitude';
    const min = isLatitude ? -90 : -180;
    const max = isLatitude ? 90 : 180;
    
    const pass = typeof received === 'number' && 
                  !isNaN(received) && 
                  received >= min && 
                  received <= max;

    return {
      message: () => 
        pass 
          ? `Expected ${received} not to be a valid ${type}`
          : `Expected ${received} to be a valid ${type} (between ${min} and ${max})`,
      pass,
    };
  },

  toBeWithinDistance(
    received: { latitude: number; longitude: number },
    target: { latitude: number; longitude: number },
    maxDistance: number
  ) {
    const distance = calculateDistance(received, target);
    const pass = distance <= maxDistance;

    return {
      message: () =>
        pass
          ? `Expected distance ${distance}m not to be within ${maxDistance}m`
          : `Expected distance ${distance}m to be within ${maxDistance}m`,
      pass,
    };
  },

  toBeValidMiningLocation(received: { latitude: number; longitude: number }) {
    // Ghana bounding box (approximate)
    const ghanaBox = {
      north: 11.2,
      south: 4.5,
      east: 1.4,
      west: -3.5
    };

    const pass = received.latitude >= ghanaBox.south &&
                 received.latitude <= ghanaBox.north &&
                 received.longitude >= ghanaBox.west &&
                 received.longitude <= ghanaBox.east;

    return {
      message: () =>
        pass
          ? `Expected coordinates not to be within Ghana mining regions`
          : `Expected coordinates (${received.latitude}, ${received.longitude}) to be within Ghana mining regions`,
      pass,
    };
  },

  toHaveValidAccuracy(received: any, minAccuracy: number = 10) {
    const accuracy = received?.accuracy || received?.coords?.accuracy;
    const pass = typeof accuracy === 'number' && accuracy > 0 && accuracy <= minAccuracy;

    return {
      message: () =>
        pass
          ? `Expected accuracy ${accuracy} not to meet mining standards (<= ${minAccuracy}m)`
          : `Expected accuracy ${accuracy} to meet mining standards (<= ${minAccuracy}m)`,
      pass,
    };
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateDistance(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1.latitude * Math.PI/180;
  const φ2 = point2.latitude * Math.PI/180;
  const Δφ = (point2.latitude-point1.latitude) * Math.PI/180;
  const Δλ = (point2.longitude-point1.longitude) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}