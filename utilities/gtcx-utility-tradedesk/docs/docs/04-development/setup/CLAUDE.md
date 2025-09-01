# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GeoTag™ is a React Native Expo application for global mining field workers that provides precise GPS location verification with cryptographic proof generation. The app supports 25+ mining jurisdictions worldwide with comprehensive localization and is optimized for budget Android devices operating in remote areas with limited connectivity. Initial pilot deployment is planned for Ghana's mining sector.

## Development Commands

### Build & Development
```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios  
npm run web

# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Testing
```bash
# Run unit tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting & Type Checking
The project uses TypeScript with strict configuration. Run these commands after making changes:
```bash
# Type checking (check tsconfig.json for exact command)
npx tsc --noEmit

# Linting (if configured in package.json)
npm run lint
```

## Architecture Overview

### Tech Stack
- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript with strict configuration
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with persistence via AsyncStorage
- **Server State**: React Query (@tanstack/react-query)
- **Location Services**: Expo Location with high-precision GPS
- **Security**: Expo SecureStore for cryptographic key storage

### Project Structure
```
app/                    # Expo Router screens (file-based routing)
├── _layout.tsx        # Root layout with Stack navigation
├── index.tsx          # Main entry point
├── auth.tsx           # Authentication
├── dashboard.tsx      # Main dashboard
├── camera.tsx         # Photo capture
├── gps.tsx           # GPS tracking
├── settings.tsx       # App settings
└── history.tsx        # Location history

src/
├── components/        # Reusable UI components
│   ├── gps/          # GPS-specific components
│   └── ui/           # Base UI components (Button, Card)
├── services/         # Business logic and API services
│   ├── location.ts   # Core GPS location service
│   ├── offline.ts    # Offline queue management
│   ├── auth.ts       # Authentication service
│   └── database.ts   # Local data persistence
├── store/            # Zustand state stores
│   ├── location.ts   # Location state with persistence
│   ├── auth.ts       # Authentication state
│   └── offline.ts    # Offline queue state
├── hooks/            # Custom React hooks
└── constants/        # App constants and configuration
```

### State Management Architecture
- **Zustand stores** with AsyncStorage persistence for offline capability
- **Location store** (`src/store/location.ts`) manages GPS tracking state and history
- **Services layer** (`src/services/`) handles all business logic
- **React Query** for server state caching and synchronization

### Location Services & Interactive Mapping
The app's core functionality centers around high-precision GPS tracking with world-class Apple Maps-inspired interface:
- **Location Service** (`src/services/location.ts`): Core GPS functionality with permission handling
- **Location Store** (`src/store/location.ts`): State management with persistence
- **GPS Screen** (`app/gps.tsx`): World-class Apple-style interface with interactive map
- **Apple-Style Design Features**:
  - **Premium Visual Design**: Light theme with Apple's signature colors and typography
  - **Large 34pt Title**: Modern typography with proper letter spacing
  - **Elegant Card System**: White cards with sophisticated shadows and 20px radius
  - **Floating Map Controls**: iOS-style segmented control and zoom buttons with blur effects
  - **Professional Information Architecture**: Clean "Location Details" grid layout
- **Map Features**:
  - **Interactive Map**: Real map tiles using `react-native-maps` (360px prominence)
  - **Multiple Map Types**: Satellite (default), Hybrid, Map views with iOS-style selector
  - **Precision Zoom Controls**: 4 zoom levels from "Regional View" to "Precision Mining" (0.0001° precision)
  - **Real-time GPS Marker**: Custom marker with accuracy circle showing GPS precision
  - **Floating Overlays**: Translucent information panels with proper shadows
- **Accuracy thresholds**: Configurable GPS accuracy requirements (default: 3 meters)
- **Hybrid Location Strategy**: High-accuracy GPS (satellites) with WiFi/Cell fallback for indoor use

## Key Development Patterns

### Apple-Style Design Standards
- **Light Theme**: Use Apple's `#f2f2f7` background with white cards
- **Typography**: 34pt titles with 0.37 letter spacing, proper font weights (700, 600, 500)
- **Colors**: Apple system colors (#007AFF, #FF9500, #8E8E93 for secondary text)
- **Cards**: White backgrounds with realistic shadows (4pt main cards, 2pt controls)
- **Spacing**: Consistent 20px margins, proper hierarchy with gaps
- **Interactions**: iOS-style controls with blur effects and proper touch targets
- **Navigation**: iOS-style tab bar with 5 main screens and haptic feedback
- **Layout**: Unified header/footer system across all screens for consistency

### GPS Location Handling
- Always check permissions before location operations
- Use high-precision accuracy settings for mining compliance
- Implement proper error handling for location failures
- Store location history with cryptographic proof generation
- Design with Apple Maps quality for professional mining use

### Offline-First Architecture
- Use AsyncStorage for local data persistence
- Implement offline queues for data synchronization
- Handle network state changes gracefully
- Provide clear offline/online status indicators

### Performance Optimization
- Target budget Android devices ($50-200 range)
- Memory usage <512MB RAM
- App startup time <3 seconds
- Battery optimization for 8+ hour field work

### Security Requirements
- Use Expo SecureStore for sensitive data
- Implement cryptographic proof generation for location data
- Handle biometric authentication where available
- Never log or expose cryptographic keys

## Testing Framework

The project uses Jest with custom GPS-specific testing utilities:
- **Test setup**: `src/test/setup.ts` and related files
- **Custom matchers**: GPS coordinate validation and distance calculations
- **Coverage requirements**: 80% for branches, functions, lines, and statements
- **Mock configuration**: All Expo modules are properly mocked

Run tests frequently during development and ensure new code includes appropriate test coverage.

## Environment Configuration

Create `.env` file from `env.example` with required configuration for:
- API endpoints and authentication
- GPS accuracy thresholds and update intervals
- Offline sync configuration
- Security and encryption settings

## Common Issues & Solutions

### GPS Permission Handling & Map Integration
- Always request both foreground and background permissions
- Check if location services are enabled on device
- Provide clear error messages for permission failures
- **Map Configuration**: Ensure `react-native-maps` is properly configured for both iOS and Android
- **Map Performance**: Use appropriate zoom levels and map types for mining field work
- **Offline Considerations**: Map tiles cache automatically but initial load requires network

### Build Configuration
- Android: Targets SDK 33, minimum SDK 21
- iOS: Supports tablets, requires location permissions
- Use EAS Build for production builds

### Performance Considerations
- Implement lazy loading for non-critical components
- Optimize image loading and caching
- Use React.memo and useCallback appropriately
- Monitor memory usage during GPS tracking

The codebase follows strict TypeScript configuration and emphasizes security, performance, and offline capability for mining field workers in remote locations globally, with initial focus on Ghana's mining sector for pilot deployment.