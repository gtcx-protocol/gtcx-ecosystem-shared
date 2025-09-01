import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TradePass™',
  slug: 'tradepass-app',
  version: '1.0.0',
  jsEngine: 'jsc',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#10b981'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.gtcx.tradepass',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'TradePass™ needs camera access to scan government ID documents and verify biometric data.',
      NSFaceIDUsageDescription: 'TradePass™ uses Face ID for secure biometric authentication.',
      NSMicrophoneUsageDescription: 'TradePass™ uses microphone access for voice recognition and verification.',
      NSLocationWhenInUseUsageDescription: 'TradePass™ uses location data for government compliance and verification.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'TradePass™ uses location data for government compliance and verification.',
      NSPhotoLibraryUsageDescription: 'TradePass™ needs photo library access to store and manage identity documents.',
      NSPhotoLibraryAddUsageDescription: 'TradePass™ needs photo library access to store and manage identity documents.',
      NSContactsUsageDescription: 'TradePass™ uses contacts for government official verification.',
      NSLocalNetworkUsageDescription: 'TradePass™ uses local network for secure government communication.',
      NSBluetoothAlwaysUsageDescription: 'TradePass™ uses Bluetooth for secure device communication.',
      NSBluetoothPeripheralUsageDescription: 'TradePass™ uses Bluetooth for secure device communication.',
      NSLocationTemporaryUsageDescriptionDictionary: {
        'PurposeKey': 'TradePass™ uses location data for government compliance and verification.',
        'UsageDescription': 'TradePass™ uses location data for government compliance and verification.'
      }
    },
    entitlements: {
      'com.apple.developer.associated-domains': [
        'applinks:tradepass.gtcx.com',
        'applinks:api.tradepass.gtcx.com'
      ],
      'com.apple.developer.usernotifications.time-sensitive': true,
      'com.apple.developer.icloud-container-identifiers': [
        'iCloud.com.gtcx.tradepass'
      ],
      'com.apple.developer.icloud-services': [
        'CloudKit'
      ],
      'com.apple.developer.ubiquity-kvstore-identifier': '$(TeamIdentifierPrefix)$(CFBundleIdentifier)',
      'com.apple.developer.ubiquity-container-identifiers': [
        'iCloud.com.gtcx.tradepass'
      ]
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#10b981'
    },
    package: 'com.gtcx.tradepass',
    versionCode: 1,
    permissions: [
      'android.permission.CAMERA',
      'android.permission.USE_FINGERPRINT',
      'android.permission.USE_BIOMETRIC',
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_BACKGROUND_LOCATION',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_CONTACTS',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.VIBRATE',
      'android.permission.WAKE_LOCK',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
      'android.permission.USE_FULL_SCREEN_INTENT',
      'android.permission.POST_NOTIFICATIONS'
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'tradepass',
            host: 'verify',
            pathPrefix: '/'
          },
          {
            scheme: 'https',
            host: 'tradepass.gtcx.com',
            pathPrefix: '/verify'
          },
          {
            scheme: 'https',
            host: 'api.tradepass.gtcx.com',
            pathPrefix: '/verify'
          }
        ],
        category: ['BROWSABLE', 'DEFAULT']
      },
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'gtcx',
            host: 'tradepass'
          }
        ],
        category: ['BROWSABLE', 'DEFAULT']
      }
    ]
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  plugins: [
    'expo-router',
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'TradePass™ uses Face ID for secure biometric authentication.',
        fingerprintPermission: 'TradePass™ uses fingerprint authentication for secure access.'
      }
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'TradePass™ needs camera access to scan government ID documents and verify biometric data.'
      }
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'TradePass™ needs photo library access to store and manage identity documents.',
        savePhotosPermission: 'TradePass™ needs photo library access to store and manage identity documents.',
        isAccessMediaLocationEnabled: true
      }
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'TradePass™ uses location data for government compliance and verification.',
        locationAlwaysPermission: 'TradePass™ uses location data for government compliance and verification.',
        locationWhenInUsePermission: 'TradePass™ uses location data for government compliance and verification.',
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true
      }
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#10b981'
      }
    ],
    [
      'expo-dev-client',
      {
        developmentBuild: {
          developmentClient: true,
          distribution: 'internal'
        }
      }
    ]
  ],
  extra: {
    eas: {
      projectId: 'your-project-id-here'
    },
    apiUrl: process.env['API_URL'] || 'https://api.tradepass.gtcx.com',
    environment: process.env['NODE_ENV'] || 'development',
    sentryDsn: process.env['SENTRY_DSN'],
    bugsnagApiKey: process.env['BUGSNAG_API_KEY']
  },
  owner: 'gtcx',
  // Bare workflow requires explicit runtimeVersion
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/your-project-id-here'
  }
}); 