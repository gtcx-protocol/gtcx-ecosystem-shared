// ============================================================================
// SHARED BUSINESS LOGIC LAYER - CROSS-APP INTEGRATION
// Centralized business rules, validation, and data processing for all GTCX apps
// ============================================================================

import { sha256 } from '@noble/hashes/sha256';

import { ed25519 } from '@noble/curves/ed25519';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// ============================================================================
// SHARED TYPES & INTERFACES
// ============================================================================

export interface CrossAppIdentity {
  did: string;
  publicKey: string;
  role: 'miner' | 'government_official' | 'inspector' | 'trader' | 'buyer';
  verified: boolean;
  biometricEnrolled: boolean;
  governmentIdVerified: boolean;
  lastVerified: number;
  appPermissions: {
    tradepass: boolean;
    geotag: boolean;
    tradedesk: boolean;
  };
}

export interface CrossAppLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  verified: boolean;
  cryptographicProof: string;
  identityDid: string;
}

export interface CrossAppTransaction {
  id: string;
  type: 'gold_lot' | 'mining_license' | 'inspection_report' | 'compliance_verification';
  identityDid: string;
  locationProof?: CrossAppLocation;
  cryptographicProof: string;
  timestamp: number;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  governmentApproved: boolean;
}

export interface CrossAppCredential {
  id: string;
  type: 'mining_license' | 'inspection_certificate' | 'trading_permit' | 'government_id';
  issuerDid: string;
  holderDid: string;
  data: Record<string, any>;
  validFrom: number;
  validUntil: number;
  revoked: boolean;
  cryptographicProof: string;
}

// ============================================================================
// SHARED BUSINESS RULES
// ============================================================================

export class SharedBusinessLogic {
  private static instance: SharedBusinessLogic;

  private constructor() {}

  static getInstance(): SharedBusinessLogic {
    if (!SharedBusinessLogic.instance) {
      SharedBusinessLogic.instance = new SharedBusinessLogic();
    }
    return SharedBusinessLogic.instance;
  }

  // ============================================================================
  // IDENTITY VALIDATION RULES
  // ============================================================================

  validateIdentityForApp(identity: CrossAppIdentity, appName: 'tradepass' | 'geotag' | 'tradedesk'): boolean {
    // Check if identity has permission for the app
    if (!identity.appPermissions[appName]) {
      return false;
    }

    // Check if identity is verified
    if (!identity.verified) {
      return false;
    }

    // Check if biometric is enrolled (required for all apps)
    if (!identity.biometricEnrolled) {
      return false;
    }

    // App-specific validation rules
    switch (appName) {
      case 'tradepass':
        return identity.governmentIdVerified;
      case 'geotag':
        return identity.role === 'miner' || identity.role === 'inspector' || identity.role === 'government_official';
      case 'tradedesk':
        return identity.role === 'trader' || identity.role === 'buyer' || identity.role === 'government_official';
      default:
        return false;
    }
  }

  // ============================================================================
  // LOCATION VERIFICATION RULES
  // ============================================================================

  validateLocationProof(location: CrossAppLocation, requiredAccuracy: number = 10): boolean {
    // Check if location has required accuracy
    if (location.accuracy > requiredAccuracy) {
      return false;
    }

    // Check if location is recent (within last 24 hours)
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    if (location.timestamp < twentyFourHoursAgo) {
      return false;
    }

    // Check if location is verified
    if (!location.verified) {
      return false;
    }

    // Check if cryptographic proof is valid
    return this.verifyCryptographicProof(location.cryptographicProof);
  }

  // ============================================================================
  // TRANSACTION VALIDATION RULES
  // ============================================================================

  validateTransaction(transaction: CrossAppTransaction): boolean {
    // Check if transaction has valid identity
    if (!transaction.identityDid) {
      return false;
    }

    // Check if transaction has valid cryptographic proof
    if (!this.verifyCryptographicProof(transaction.cryptographicProof)) {
      return false;
    }

    // Check if transaction is not expired
    const now = Date.now();
    if (transaction.timestamp < (now - (30 * 24 * 60 * 60 * 1000))) { // 30 days
      return false;
    }

    // Check if transaction is not revoked
    if (transaction.status === 'rejected' || transaction.status === 'expired') {
      return false;
    }

    return true;
  }

  // ============================================================================
  // CREDENTIAL VALIDATION RULES
  // ============================================================================

  validateCredential(credential: CrossAppCredential): boolean {
    const now = Date.now();

    // Check if credential is within valid period
    if (now < credential.validFrom || now > credential.validUntil) {
      return false;
    }

    // Check if credential is not revoked
    if (credential.revoked) {
      return false;
    }

    // Check if cryptographic proof is valid
    if (!this.verifyCryptographicProof(credential.cryptographicProof)) {
      return false;
    }

    return true;
  }

  // ============================================================================
  // CRYPTOGRAPHIC VERIFICATION
  // ============================================================================

  private verifyCryptographicProof(proof: string): boolean {
    try {
      // Verify the cryptographic proof using Ed25519
      const proofData = JSON.parse(proof);
      const signature = hexToBytes(proofData.signature);
      const publicKey = hexToBytes(proofData.publicKey);
      const message = proofData.message;

      return ed25519.verify(signature, sha256(message), publicKey);
    } catch (error) {
      console.error('Cryptographic proof verification failed:', error);
      return false;
    }
  }

  // ============================================================================
  // CROSS-APP DATA SHARING
  // ============================================================================

  async shareIdentityAcrossApps(identity: CrossAppIdentity): Promise<void> {
    try {
      // Store identity in secure storage for cross-app access
      await SecureStore.setItemAsync('cross_app_identity', JSON.stringify(identity));
      
      // Update app permissions based on role
      await this.updateAppPermissions(identity);
    } catch (error) {
      console.error('Failed to share identity across apps:', error);
      throw error;
    }
  }

  async getSharedIdentity(): Promise<CrossAppIdentity | null> {
    try {
      const identityData = await SecureStore.getItemAsync('cross_app_identity');
      return identityData ? JSON.parse(identityData) : null;
    } catch (error) {
      console.error('Failed to get shared identity:', error);
      return null;
    }
  }

  private async updateAppPermissions(identity: CrossAppIdentity): Promise<void> {
    // Update app permissions based on role and verification status
    const permissions = {
      tradepass: true, // All verified users can use TradePass
      geotag: ['miner', 'inspector', 'government_official'].includes(identity.role),
      tradedesk: ['trader', 'buyer', 'government_official'].includes(identity.role)
    };

    identity.appPermissions = permissions;
    await SecureStore.setItemAsync('cross_app_identity', JSON.stringify(identity));
  }

  // ============================================================================
  // GOVERNMENT COMPLIANCE RULES
  // ============================================================================

  validateGovernmentCompliance(transaction: CrossAppTransaction): boolean {
    // Check if transaction requires government approval
    if (transaction.type === 'mining_license' || transaction.type === 'inspection_report') {
      return transaction.governmentApproved;
    }

    // For other transaction types, basic validation is sufficient
    return this.validateTransaction(transaction);
  }

  // ============================================================================
  // AUDIT LOGGING
  // ============================================================================

  async logCrossAppActivity(
    appName: 'tradepass' | 'geotag' | 'tradedesk',
    action: string,
    data: any
  ): Promise<void> {
    const auditLog = {
      timestamp: Date.now(),
      appName,
      action,
      data,
      deviceId: await this.getDeviceId(),
      sessionId: await this.getSessionId()
    };

    try {
      // Store audit log locally
      const existingLogs = await AsyncStorage.getItem('audit_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(auditLog);
      await AsyncStorage.setItem('audit_logs', JSON.stringify(logs.slice(-1000))); // Keep last 1000 entries
    } catch (error) {
      console.error('Failed to log cross-app activity:', error);
    }
  }

  private async getDeviceId(): Promise<string> {
    try {
      const deviceId = await SecureStore.getItemAsync('device_id');
      if (deviceId) return deviceId;
      
      // Generate new device ID
      const newDeviceId = bytesToHex(sha256(Date.now().toString()));
      await SecureStore.setItemAsync('device_id', newDeviceId);
      return newDeviceId;
    } catch (error) {
      return 'unknown';
    }
  }

  private async getSessionId(): Promise<string> {
    try {
      const sessionId = await SecureStore.getItemAsync('session_id');
      if (sessionId) return sessionId;
      
      // Generate new session ID
      const newSessionId = bytesToHex(sha256(Date.now().toString()));
      await SecureStore.setItemAsync('session_id', newSessionId);
      return newSessionId;
    } catch (error) {
      return 'unknown';
    }
  }
}

export const SharedBusinessLogicService = SharedBusinessLogic.getInstance(); 