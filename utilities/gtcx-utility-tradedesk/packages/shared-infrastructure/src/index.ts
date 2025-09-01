// Shared Infrastructure Services
// Storage, networking, location services for both apps

export * from './location/location';
export * from './storage/offline';
export * from './services/logger';
export { default as CrossAppIntegrationService } from './services/CrossAppIntegration';
export { default as SharedAuthService } from './services/SharedAuthService';
export type {
  CrossAppMessage,
  GoldLotNotification,
  TradeNotification,
  SharedUserSession,
  UnifiedUser,
  AppSession,
  CrossAppNotification
} from './services/CrossAppIntegration';

// Infrastructure Configuration
export interface InfrastructureConfig {
  appId: string;
  storagePrefix: string;
  locationAccuracy: number;
  networkTimeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// App-specific infrastructure configurations
export const geoTagInfraConfig: InfrastructureConfig = {
  appId: 'geotag',
  storagePrefix: 'geotag_',
  locationAccuracy: 5, // 5 meter accuracy for mining
  networkTimeout: 10000,
  logLevel: __DEV__ ? 'debug' : 'info',
};

export const tradeDeskInfraConfig: InfrastructureConfig = {
  appId: 'tradedesk',
  storagePrefix: 'tradedesk_',
  locationAccuracy: 10, // 10 meter accuracy for trading
  networkTimeout: 8000,
  logLevel: __DEV__ ? 'debug' : 'info',
};