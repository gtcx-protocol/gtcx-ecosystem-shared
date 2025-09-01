import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'TradeDesk™',
  slug: 'tradedesk-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a1a'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.gtcx.tradedesk'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1a1a1a'
    },
    package: 'com.gtcx.tradedesk'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#1a1a1a',
        image: './assets/splash.png',
        dark: {
          image: './assets/splash.png',
          backgroundColor: '#1a1a1a'
        },
        imageWidth: 200
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  }
};

export default config;