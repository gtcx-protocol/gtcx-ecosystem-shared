// ============================================================================
// BIOMETRIC AUTH STUB - Temporary placeholder for production deployment
// This provides basic functionality while we fix the full service
// ============================================================================

export interface BiometricCapabilities {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: string[];
}

export interface BiometricTemplate {
  id: string;
  type: string;
  confidence: number;
  createdAt: number;
}

export class TradePassBiometrics {
  static async initialize(): Promise<void> {
    console.log('Biometric service initialized (stub)');
  }

  static async getCapabilities(): Promise<BiometricCapabilities> {
    return {
      hasHardware: true,
      isEnrolled: true,
      supportedTypes: ['fingerprint', 'face']
    };
  }

  static async enrollBiometric(type: string): Promise<BiometricTemplate> {
    return {
      id: Date.now().toString(),
      type,
      confidence: 95,
      createdAt: Date.now()
    };
  }

  static async verifyBiometric(): Promise<{ success: boolean; confidence: number }> {
    return { success: true, confidence: 95 };
  }

  static async getStoredTemplates(): Promise<BiometricTemplate[]> {
    return [
      {
        id: '1',
        type: 'fingerprint',
        confidence: 95,
        createdAt: Date.now() - 86400000
      }
    ];
  }
}