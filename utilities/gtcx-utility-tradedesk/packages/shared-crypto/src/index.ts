// Shared Cryptographic Services
// Digital signatures, verification, and certificate generation for both apps

export * from './services/crypto';

// Crypto Service Types
export interface CryptoConfig {
  keySize: number;
  algorithm: 'ECDSA' | 'RSA';
  hashAlgorithm: 'SHA256' | 'SHA512';
  storageKey: string;
}

// App-specific crypto configurations
export const geoTagCryptoConfig: CryptoConfig = {
  keySize: 256,
  algorithm: 'ECDSA',
  hashAlgorithm: 'SHA256',
  storageKey: 'geotag_crypto_keys',
};

export const tradeDeskCryptoConfig: CryptoConfig = {
  keySize: 256,
  algorithm: 'ECDSA',
  hashAlgorithm: 'SHA256',
  storageKey: 'tradedesk_crypto_keys',
};