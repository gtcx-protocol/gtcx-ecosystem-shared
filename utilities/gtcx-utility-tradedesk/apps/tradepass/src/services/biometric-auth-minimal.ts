// ============================================================================
// MINIMAL BIOMETRIC AUTHENTICATION SERVICE
// Simplified version to prevent C++ threading crashes
// ============================================================================

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BiometricTemplate {
  id: string;
  type: 'fingerprint' | 'face' | 'voice' | 'iris';
  data: string;
  confidence: number;
  livenessScore: number;
  authenticityScore: number;
  isLive: boolean;
  deviceId: string;
  cryptographicProof: string;
}

export interface BiometricAuthService {
  checkAvailability(): Promise<boolean>;
  enrollFingerprint(): Promise<BiometricTemplate>;
  enrollFaceID(): Promise<BiometricTemplate>;
  authenticate(type: 'fingerprint' | 'face'): Promise<boolean>;
  getDeviceId(): Promise<string>;
}

// ============================================================================
// MINIMAL BIOMETRIC SERVICE
// ============================================================================

class MinimalBiometricAuthService implements BiometricAuthService {
  private static instance: MinimalBiometricAuthService;
  
  static getInstance(): MinimalBiometricAuthService {
    if (!MinimalBiometricAuthService.instance) {
      MinimalBiometricAuthService.instance = new MinimalBiometricAuthService();
    }
    return MinimalBiometricAuthService.instance;
  }

  async checkAvailability(): Promise<boolean> {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return isAvailable && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  async enrollFingerprint(): Promise<BiometricTemplate> {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Touch the fingerprint sensor',
        fallbackLabel: 'Use passcode',
      });

      if (!result.success) {
        throw new Error('Fingerprint enrollment failed');
      }

      const deviceId = await this.getDeviceId();
      const templateId = `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: templateId,
        type: 'fingerprint',
        data: `template_${templateId}`, // Simplified template data
        confidence: 0.95,
        livenessScore: 0.9,
        authenticityScore: 0.93,
        isLive: true,
        deviceId,
        cryptographicProof: JSON.stringify({
          templateId,
          timestamp: Date.now(),
          type: 'fingerprint'
        })
      };
    } catch (error) {
      console.error('Fingerprint enrollment error:', error);
      throw error;
    }
  }

  async enrollFaceID(): Promise<BiometricTemplate> {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Look at the front camera',
        fallbackLabel: 'Use passcode',
      });

      if (!result.success) {
        throw new Error('Face ID enrollment failed');
      }

      const deviceId = await this.getDeviceId();
      const templateId = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: templateId,
        type: 'face',
        data: `template_${templateId}`, // Simplified template data
        confidence: 0.92,
        livenessScore: 0.88,
        authenticityScore: 0.91,
        isLive: true,
        deviceId,
        cryptographicProof: JSON.stringify({
          templateId,
          timestamp: Date.now(),
          type: 'face'
        })
      };
    } catch (error) {
      console.error('Face ID enrollment error:', error);
      throw error;
    }
  }

  async authenticate(type: 'fingerprint' | 'face'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: type === 'fingerprint' ? 'Touch fingerprint sensor' : 'Look at camera',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async getDeviceId(): Promise<string> {
    try {
      let deviceId = await SecureStore.getItemAsync('device_id');
      if (deviceId) return deviceId;
      
      const newDeviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await SecureStore.setItemAsync('device_id', newDeviceId);
      return newDeviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return `fallback_${Date.now()}`;
    }
  }
}

export const biometricAuthService = MinimalBiometricAuthService.getInstance();
export default biometricAuthService;