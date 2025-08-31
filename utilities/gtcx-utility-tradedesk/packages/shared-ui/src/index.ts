// Shared UI Components and Design System
// Exports for both GeoTag and TradeDesk applications

// Theme System
export * from './theme/theme';
export { DARK_THEME, LIGHT_THEME, getTheme, type Theme } from './theme/theme';
export * from './components/ThemeProvider';

// Layout Components
export { Layout } from './components/layout/Layout';
export { Header } from './components/layout/Header';
export { Footer } from './components/layout/Footer';

// Enterprise Components
export * from './components/EnterpriseComponents';

// Design System Types
export interface DesignSystemConfig {
  appName: 'GeoTag' | 'TradeDesk';
  primaryColor: string;
  brandColors: {
    gold: string;
    green: string;
    red: string;
    blue: string;
  };
  features: {
    mining: boolean;
    trading: boolean;
    compliance: boolean;
    analytics: boolean;
  };
}

// Ghana Colors Constant for both apps
export const GHANA_COLORS = {
  red: '#CE1126',
  gold: '#FCD116', 
  green: '#006B3F',
  black: '#000000',
  white: '#FFFFFF',
  darkGreen: '#004D2E',
  lightGold: '#FFE55C',
};

// App-specific configurations
export const geoTagConfig: DesignSystemConfig = {
  appName: 'GeoTag',
  primaryColor: GHANA_COLORS.gold,
  brandColors: {
    gold: GHANA_COLORS.gold,
    green: GHANA_COLORS.green,
    red: GHANA_COLORS.red,
    blue: '#1d4ed8',
  },
  features: {
    mining: true,
    trading: false,
    compliance: true,
    analytics: true,
  },
};

export const tradeDeskConfig: DesignSystemConfig = {
  appName: 'TradeDesk',
  primaryColor: '#a855f7', // Purple for trading
  brandColors: {
    gold: GHANA_COLORS.gold,
    green: GHANA_COLORS.green,
    red: GHANA_COLORS.red,
    blue: '#1d4ed8',
  },
  features: {
    mining: false,
    trading: true,
    compliance: true,
    analytics: true,
  },
};

// Component Variants for Different Apps
export interface ComponentConfig {
  variant: 'mining' | 'trading' | 'compliance';
  size: 'compact' | 'normal' | 'large';
  theme: 'ghana' | 'professional' | 'modern';
}

// Utility Functions
export const getAppConfig = (appName: 'GeoTag' | 'TradeDesk'): DesignSystemConfig => {
  return appName === 'GeoTag' ? geoTagConfig : tradeDeskConfig;
};

export const getComponentVariant = (appName: 'GeoTag' | 'TradeDesk'): ComponentConfig => {
  return {
    variant: appName === 'GeoTag' ? 'mining' : 'trading',
    size: 'normal',
    theme: 'ghana',
  };
};