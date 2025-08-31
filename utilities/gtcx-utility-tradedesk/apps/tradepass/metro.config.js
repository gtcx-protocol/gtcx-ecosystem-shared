const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { resolve } = require('metro-resolver');

// Ensure Metro treats this app directory as the project root
const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;

// Limit watch folders to this app (adjust if you import from shared packages)
config.watchFolders = [__dirname];

// Alias legacy RN LoadingView to DevLoadingView for RN 0.76
// PLUS: Fix for Noble package Metro bundler "to" argument error (ERROR-001)
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  'react-native/Libraries/Utilities/LoadingView': path.resolve(__dirname, 'scripts/LoadingViewShim.js'),
  '@expo/metro-runtime/build/LoadingView.native': path.resolve(__dirname, 'scripts/LoadingViewShim.js'),
  // Noble package fallbacks to prevent Metro "to" argument TypeError
  '@noble/hashes': path.resolve(__dirname, 'src/utils/expo-crypto-fallbacks.js'),
  '@noble/curves': path.resolve(__dirname, 'src/utils/expo-crypto-fallbacks.js'),
  '@noble/hashes/crypto': path.resolve(__dirname, 'src/utils/expo-crypto-fallbacks.js'),
  '@noble/hashes/sha256': path.resolve(__dirname, 'src/utils/expo-crypto-fallbacks.js'),
  '@noble/curves/ed25519': path.resolve(__dirname, 'src/utils/expo-crypto-fallbacks.js'),
};

module.exports = config;

// Ensure Metro resolves dependencies from this app's node_modules first
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Completely block Noble packages from being processed by Metro
config.resolver.blacklistRE = /node_modules\/@noble\/(hashes|curves)\/.*/;


// Intercept problematic imports from dependencies (RN 0.76 LoadingView removal + Noble packages)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native/Libraries/Utilities/LoadingView') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'scripts/LoadingViewShim.js'),
    };
  }
  
  // COMPLETELY BLOCK Noble packages that cause Hermes engine errors
  if (moduleName.startsWith('@noble/')) {
    console.warn(`🚫 Blocking Noble package: ${moduleName} -> redirecting to fallback`);
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/utils/expo-crypto-fallbacks.js'),
    };
  }
  
  return resolve(context, moduleName, platform);
};

