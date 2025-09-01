# GeoTag™ Build Instructions

This document provides detailed instructions for building and deploying the GeoTag™ React Native Expo application.

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+**
   ```bash
   node --version
   # Should be 18.0.0 or higher
   ```

2. **npm or yarn**
   ```bash
   npm --version
   # or
   yarn --version
   ```

3. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   expo --version
   ```

4. **EAS CLI** (for builds)
   ```bash
   npm install -g @expo/eas-cli
   eas --version
   ```

### Initial Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd geotag-app
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## 📱 Development Builds

### Local Development

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run on web
npm run web
```

### Development Build with EAS

```bash
# Create development build
eas build --profile development --platform android
eas build --profile development --platform ios

# Install on device
eas build:run
```

## 🏗️ Production Builds

### Android Production Build

1. **Configure EAS**
   ```bash
   eas login
   eas build:configure
   ```

2. **Build for Android**
   ```bash
   eas build --platform android --profile production
   ```

3. **Download APK/AAB**
   - Build will be available in EAS dashboard
   - Download for distribution

### iOS Production Build

1. **Configure Apple Developer Account**
   ```bash
   # Add your Apple ID to eas.json
   eas build:configure
   ```

2. **Build for iOS**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

## 🔧 Build Configuration

### Android Optimization

The app is optimized for budget Android devices ($50-200 range):

- **Target SDK**: 33 (Android 13)
- **Min SDK**: 21 (Android 5.0)
- **Architecture**: arm64-v8a, armeabi-v7a
- **APK Size**: <50MB
- **Memory Usage**: <512MB RAM

### Performance Optimizations

1. **Hermes Engine**: Enabled for faster JavaScript execution
2. **ProGuard/R8**: Code shrinking and obfuscation
3. **Asset Optimization**: Compressed images and fonts
4. **Bundle Splitting**: Optimized for different architectures

### Battery Optimization

- **Background processing**: Limited to essential tasks
- **GPS optimization**: Adaptive accuracy based on movement
- **Sync intervals**: Configurable based on battery level
- **Wake locks**: Minimized usage

## 🛡️ Security Configuration

### Certificate Pinning

```typescript
// In app.config.ts
extra: {
  certificatePinning: process.env.CERTIFICATE_PINNING === 'true',
}
```

### Encryption Keys

```bash
# Generate encryption key
openssl rand -hex 32
# Add to .env
ENCRYPTION_KEY=your-generated-key
```

### API Security

- **HTTPS Only**: All API communications
- **Token Management**: Secure JWT handling
- **Biometric Support**: Fingerprint/Face ID

## 📊 Performance Monitoring

### Build Metrics

```bash
# Check bundle size
npx expo export --platform android
npx expo export --platform ios

# Analyze bundle
npx @expo/metro-config analyze
```

### Runtime Metrics

- **App startup time**: <3 seconds
- **GPS accuracy**: <3 meters
- **Battery usage**: 8+ hours
- **Memory usage**: <512MB

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

### Performance Tests

```bash
# Test startup time
npm run test:performance

# Test GPS accuracy
npm run test:gps

# Test battery usage
npm run test:battery
```

## 🚀 Deployment

### Staging Environment

```bash
# Build staging version
eas build --profile staging --platform android
eas build --profile staging --platform ios

# Deploy to internal testing
eas submit --profile staging
```

### Production Environment

```bash
# Build production version
eas build --profile production --platform android
eas build --profile production --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Over-the-Air Updates

```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# Rollback if needed
eas update --branch production --message "Rollback to previous version"
```

## 🔍 Troubleshooting

### Common Build Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Dependency conflicts**
   ```bash
   npm install --force
   # or
   yarn install --force
   ```

3. **Android build failures**
   ```bash
   # Clear Android build cache
   cd android && ./gradlew clean
   ```

4. **iOS build failures**
   ```bash
   # Clear iOS build cache
   cd ios && xcodebuild clean
   ```

### Performance Issues

1. **High memory usage**
   - Check for memory leaks in components
   - Optimize image loading
   - Reduce bundle size

2. **Slow startup**
   - Enable Hermes engine
   - Optimize initial bundle
   - Use lazy loading

3. **GPS accuracy issues**
   - Check device GPS hardware
   - Verify location permissions
   - Test in open sky conditions

### Security Issues

1. **Certificate pinning failures**
   - Verify API certificate
   - Check network configuration
   - Test with different networks

2. **Encryption issues**
   - Verify encryption key
   - Check SecureStore implementation
   - Test on different devices

## 📈 Monitoring

### Build Analytics

- **Build time**: Track and optimize
- **Bundle size**: Monitor for increases
- **Success rate**: Track build failures

### Runtime Analytics

- **Crash reporting**: Automatic error collection
- **Performance metrics**: User experience tracking
- **Usage analytics**: Feature adoption

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/build.yml
name: Build and Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run type-check
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm install -g @expo/eas-cli
      - run: eas build --platform android --non-interactive
```

### Automated Deployment

```bash
# Deploy on successful build
eas build --auto-submit --platform android
eas build --auto-submit --platform ios
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🆘 Support

For build issues or questions:

- **Email**: dev@geotag.com
- **Slack**: #geotag-dev
- **Documentation**: [docs.geotag.com](https://docs.geotag.com)
- **Issues**: [GitHub Issues](https://github.com/geotag/app/issues)

---

**GeoTag™** - Building secure, reliable location verification for mining field workers. 