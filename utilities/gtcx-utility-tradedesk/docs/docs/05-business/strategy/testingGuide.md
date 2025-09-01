# 🧪 GeoTag App Testing Framework

## Overview

This document outlines the comprehensive testing framework implemented for the GeoTag app to ensure robust Quality Assurance going forward.

## 🏗️ Testing Architecture

### 1. **Multi-Layer Testing Strategy**

```
┌─────────────────────────────────────┐
│           E2E Testing               │
│        (Detox/Maestro)              │
├─────────────────────────────────────┤
│        Integration Testing          │
│     (Component + Service)           │
├─────────────────────────────────────┤
│         Unit Testing                │
│    (Services, Hooks, Utils)         │
└─────────────────────────────────────┘
```

### 2. **Test Categories**

- **Unit Tests**: Individual functions, services, and hooks
- **Component Tests**: React Native components with mocked dependencies
- **Integration Tests**: Multiple services working together
- **E2E Tests**: Full user workflows (planned)

## 🛠️ Framework Setup

### Core Testing Libraries

- **Jest**: Test runner and framework
- **@testing-library/react-native**: Component testing utilities
- **jest-expo**: Expo-specific Jest preset
- **Detox**: End-to-end testing (future implementation)

### Custom Testing Utilities

#### GPS-Specific Matchers

```typescript
// Custom matchers for GPS testing
expect(latitude).toBeValidGPSCoordinate('latitude');
expect(longitude).toBeValidGPSCoordinate('longitude');
expect(location1).toBeWithinDistance(location2, maxDistanceInMeters);
```

#### Mock Helpers

```typescript
// Pre-configured mock data
global.mockLocationData
global.mockSatelliteInfo
global.createMockLocation(overrides)
global.createMockLocationPermission(granted)
```

## 📁 Test Structure

```
src/
├── services/
│   ├── __tests__/
│   │   ├── location.test.ts       ✅ GPS location service tests
│   │   ├── offline.test.ts        ✅ Offline queue management tests
│   │   └── initialization.test.ts (planned)
│   └── ...
├── components/
│   ├── gps/
│   │   ├── __tests__/
│   │   │   └── GPSComponents.test.tsx ✅ GPS UI component tests
│   │   └── ...
│   └── ...
├── hooks/
│   ├── __tests__/
│   │   ├── useGPSTracking.test.ts (planned)
│   │   └── ...
│   └── ...
└── test/
    ├── setup.ts              ✅ Basic test setup
    ├── setupTests.ts         ✅ Enhanced mocks and matchers
    ├── types.d.ts           ✅ TypeScript definitions
    └── setupFiles.ts        ✅ Global test configuration
```

## 🧪 Test Categories & Examples

### 1. Unit Tests - Location Service

```typescript
describe('Location Service', () => {
  it('should return valid GPS coordinates', async () => {
    const location = await getCurrentLocation();
    
    expect(location?.latitude).toBeValidGPSCoordinate('latitude');
    expect(location?.longitude).toBeValidGPSCoordinate('longitude');
    expect(location?.accuracy).toBeGreaterThan(0);
  });

  it('should handle permission denied gracefully', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue(
      createMockLocationPermission(false)
    );

    const result = await requestLocationPermissions();
    expect(result).toBe(false);
  });
});
```

### 2. Unit Tests - Offline Service

```typescript
describe('Offline Service', () => {
  it('should queue data when offline', async () => {
    await addToOfflineQueue({ 
      data: { location: testLocation }, 
      type: 'gps' 
    });

    const queue = await getOfflineQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('gps');
  });

  it('should process queue when back online', async () => {
    // Test network state changes and queue processing
  });
});
```

### 3. Component Tests - GPS Tracker

```typescript
describe('GPSTracker Component', () => {
  it('should display location data correctly', () => {
    mockUseGPSTracking.useGPSTracking.mockReturnValue({
      location: mockLocationData,
      isTracking: false,
      // ... other props
    });

    const { getByText } = render(<GPSTracker />);
    
    expect(getByText('37.7749°')).toBeTruthy();
    expect(getByText('-122.4194°')).toBeTruthy();
  });

  it('should handle start/stop tracking', () => {
    const { getByText } = render(<GPSTracker />);
    
    fireEvent.press(getByText('Start Tracking'));
    expect(mockStartTracking).toHaveBeenCalled();
  });
});
```

### 4. Integration Tests

```typescript
describe('GPS Integration', () => {
  it('should handle complete GPS workflow', async () => {
    // Test: Permission request → Location fetch → UI update → Offline queue
    
    // 1. Request permissions
    const hasPermission = await requestLocationPermissions();
    expect(hasPermission).toBe(true);

    // 2. Get location
    const location = await getCurrentLocation();
    expect(location).toBeDefined();

    // 3. Verify offline handling when network is down
    await addToOfflineQueue({ data: location, type: 'location' });
    
    // 4. Verify processing when back online
    await processOfflineQueue();
  });
});
```

## 🚀 Running Tests

### Available Test Commands

```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run E2E tests (when implemented)
npm run test:e2e

# Run all test types in sequence
npm run test:all
```

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🎯 GPS-Specific Testing Features

### 1. **Location Validation**

```typescript
// Validates GPS coordinate ranges
expect(37.7749).toBeValidGPSCoordinate('latitude');   // -90 to 90
expect(-122.4194).toBeValidGPSCoordinate('longitude'); // -180 to 180
```

### 2. **Distance Calculations**

```typescript
// Tests geographic distance calculations
const sf = { lat: 37.7749, lng: -122.4194 };
const oakland = { lat: 37.8044, lng: -122.2712 };

expect(sf).toBeWithinDistance(oakland, 15000); // Within 15km
```

### 3. **Accuracy Testing**

```typescript
// Tests GPS accuracy levels and color coding
const accuracyInfo = getAccuracyLevel(5); // 5 meter accuracy
expect(accuracyInfo.level).toBe('high');
expect(accuracyInfo.color).toBe('#4CAF50');
```

### 4. **Permission Handling**

```typescript
// Tests various permission states
const granted = createMockLocationPermission(true);
const denied = createMockLocationPermission(false);

expect(granted.status).toBe('granted');
expect(denied.canAskAgain).toBe(true);
```

## 🔧 Mock Configuration

### Expo Modules Mocked

- `expo-location`: GPS functionality
- `expo-device`: Device information
- `expo-application`: App metadata
- `expo-secure-store`: Secure storage
- `expo-crypto`: Cryptographic functions
- `@react-native-community/netinfo`: Network state
- `@react-native-async-storage/async-storage`: Local storage

### Navigation Mocked

- `expo-router`: Navigation and routing
- Route parameters and navigation functions

## 📊 Testing Best Practices

### 1. **Test Structure**
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach` for setup
- Clean up mocks between tests

### 2. **GPS Testing Guidelines**
- Always test permission scenarios
- Test both success and error cases
- Validate coordinate ranges
- Test accuracy levels
- Mock satellite data appropriately

### 3. **Async Testing**
- Use `async/await` for promises
- Use `waitFor` for UI updates
- Mock network delays appropriately
- Test timeout scenarios

### 4. **Component Testing**
- Test user interactions
- Verify state changes
- Test error boundaries
- Mock external dependencies

## 🚦 Continuous Integration

### Pre-commit Hooks (Recommended)
```bash
npm run test:unit && npm run lint && npm run type-check
```

### CI Pipeline Steps
1. Install dependencies
2. Run linting
3. Run type checking
4. Run unit tests with coverage
5. Run integration tests
6. Generate coverage reports
7. Run E2E tests (in CI environment)

## 🔮 Future Enhancements

### Planned Testing Features

1. **Visual Regression Testing**
   - Screenshot comparisons for GPS UI components
   - Map rendering validation

2. **Performance Testing**
   - GPS tracking battery usage
   - Memory usage monitoring
   - Location update frequency testing

3. **Device-Specific Testing**
   - iOS vs Android GPS behavior
   - Different device capabilities
   - Various permission models

4. **E2E Testing with Detox**
   - Full user journey testing
   - Real GPS simulation
   - Cross-platform validation

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Testing Guide](https://docs.expo.dev/guides/testing/)
- [GPS Testing Best Practices](https://developer.android.com/guide/topics/location/testing)

---

## ✅ Testing Checklist

- [x] Jest configuration with Expo preset
- [x] Custom GPS matchers and utilities
- [x] Location service unit tests
- [x] Offline service unit tests
- [x] GPS component tests
- [x] Mock setup for all Expo modules
- [x] TypeScript support for tests
- [x] Coverage reporting
- [ ] Integration tests implementation
- [ ] E2E testing setup
- [ ] CI/CD integration
- [ ] Performance testing
- [ ] Visual regression testing

This testing framework provides a solid foundation for maintaining high code quality and catching GPS-related bugs early in the development process. 