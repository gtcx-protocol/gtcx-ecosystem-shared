/**
 * Gold Lot Registration Domain Service
 * Business logic for registering gold discoveries in Ghana's mining industry
 */

import { Location, GoldLot } from '../index';

export interface GoldLotRegistrationData {
  discoveryDate: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
  };
  goldDetails: {
    estimatedQuantity: number;
    purity: number;
    color: string;
    form: 'nugget' | 'dust' | 'mixed';
  };
  photos: string[];
  notes: string;
  minerId: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  isRequired: boolean;
  isCompleted: boolean;
}

export class GoldLotRegistrationService {
  private cryptoService: any; // Will be injected
  private locationService: any; // Will be injected
  private storageService: any; // Will be injected

  constructor(dependencies: {
    cryptoService: any;
    locationService: any;
    storageService: any;
  }) {
    this.cryptoService = dependencies.cryptoService;
    this.locationService = dependencies.locationService;
    this.storageService = dependencies.storageService;
  }

  /**
   * Get registration workflow steps
   */
  getWorkflowSteps(): WorkflowStep[] {
    return [
      {
        id: 'location',
        title: 'GPS Location Capture',
        description: 'Precise location with sub-meter accuracy',
        icon: 'location',
        color: '#22c55e',
        duration: '2-3 minutes',
        isRequired: true,
        isCompleted: false,
      },
      {
        id: 'photos',
        title: 'Photo Documentation',
        description: 'Multiple angles of gold discovery',
        icon: 'camera',
        color: '#3b82f6',
        duration: '3-5 minutes',
        isRequired: true,
        isCompleted: false,
      },
      {
        id: 'details',
        title: 'Gold Characteristics',
        description: 'Quantity, purity, and physical properties',
        icon: 'analytics',
        color: '#f59e0b',
        duration: '5-7 minutes',
        isRequired: true,
        isCompleted: false,
      },
      {
        id: 'verification',
        title: 'Cryptographic Proof',
        description: 'Generate blockchain-ready certificate',
        icon: 'shield-checkmark',
        color: '#8b5cf6',
        duration: '1-2 minutes',
        isRequired: true,
        isCompleted: false,
      },
    ];
  }

  /**
   * Validate gold lot registration data
   */
  validateRegistrationData(data: Partial<GoldLotRegistrationData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Location validation
    if (!data.location) {
      errors.push('GPS location is required');
    } else {
      if (!data.location.latitude || !data.location.longitude) {
        errors.push('Valid GPS coordinates are required');
      }
      if (!data.location.accuracy || data.location.accuracy > 10) {
        errors.push('GPS accuracy must be better than 10 meters');
      }
      if (!data.location.address) {
        errors.push('Location address is required');
      }
    }

    // Gold details validation
    if (!data.goldDetails) {
      errors.push('Gold characteristics are required');
    } else {
      if (!data.goldDetails.estimatedQuantity || data.goldDetails.estimatedQuantity <= 0) {
        errors.push('Estimated quantity must be greater than 0');
      }
      if (!data.goldDetails.purity || data.goldDetails.purity <= 0 || data.goldDetails.purity > 100) {
        errors.push('Gold purity must be between 1-100%');
      }
      if (!data.goldDetails.form) {
        errors.push('Gold form classification is required');
      }
      if (!data.goldDetails.color) {
        errors.push('Gold color description is required');
      }
    }

    // Photo validation
    if (!data.photos || data.photos.length < 2) {
      errors.push('At least 2 photos are required for documentation');
    }

    // Date validation
    if (!data.discoveryDate) {
      errors.push('Discovery date is required');
    } else {
      const discoveryTime = new Date(data.discoveryDate).getTime();
      const now = Date.now();
      if (discoveryTime > now) {
        errors.push('Discovery date cannot be in the future');
      }
      if (now - discoveryTime > 30 * 24 * 60 * 60 * 1000) { // 30 days
        errors.push('Discovery date cannot be older than 30 days');
      }
    }

    // Miner ID validation
    if (!data.minerId) {
      errors.push('Miner identification is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate registration progress
   */
  calculateProgress(data: Partial<GoldLotRegistrationData>): {
    percentage: number;
    completedSteps: string[];
    nextStep: string | null;
  } {
    const steps = this.getWorkflowSteps();
    const completedSteps: string[] = [];

    // Check location step
    if (data.location?.latitude && data.location?.longitude && data.location?.accuracy && data.location.accuracy <= 10) {
      completedSteps.push('location');
    }

    // Check photos step
    if (data.photos && data.photos.length >= 2) {
      completedSteps.push('photos');
    }

    // Check details step
    if (data.goldDetails?.estimatedQuantity && data.goldDetails?.purity && data.goldDetails?.form && data.goldDetails?.color) {
      completedSteps.push('details');
    }

    // Check verification step (requires all other steps)
    if (completedSteps.length === 3 && data.discoveryDate && data.minerId) {
      completedSteps.push('verification');
    }

    const percentage = (completedSteps.length / steps.length) * 100;
    
    // Find next incomplete step
    const nextStep = steps.find(step => !completedSteps.includes(step.id))?.id || null;

    return {
      percentage,
      completedSteps,
      nextStep,
    };
  }

  /**
   * Generate lot ID based on location and time
   */
  generateLotId(location: { latitude: number; longitude: number }, timestamp: number): string {
    const lat = Math.abs(location.latitude).toFixed(6);
    const lng = Math.abs(location.longitude).toFixed(6);
    const time = timestamp.toString(36).toUpperCase();
    return `GL-${lat.slice(-6)}-${lng.slice(-6)}-${time}`;
  }

  /**
   * Create cryptographic proof for gold lot
   */
  async createCryptographicProof(data: GoldLotRegistrationData): Promise<{
    hash: string;
    signature: string;
    certificate: any;
  }> {
    try {
      // Create data hash
      const dataString = JSON.stringify({
        location: data.location,
        goldDetails: data.goldDetails,
        discoveryDate: data.discoveryDate,
        photos: data.photos.map(photo => this.hashPhoto(photo)),
        minerId: data.minerId,
      });

      const hash = await this.cryptoService.createHash(dataString);
      const signature = await this.cryptoService.sign(hash);
      
      // Generate certificate
      const certificate = {
        id: this.generateCertificateId(),
        lotId: this.generateLotId(data.location, Date.now()),
        hash,
        signature,
        timestamp: new Date().toISOString(),
        minerLicense: data.minerId,
        location: data.location,
        goldCharacteristics: data.goldDetails,
        verificationLevel: 'preliminary',
      };

      return { hash, signature, certificate };
    } catch (error) {
      throw new Error(`Failed to create cryptographic proof: ${error}`);
    }
  }

  /**
   * Register complete gold lot
   */
  async registerGoldLot(data: GoldLotRegistrationData): Promise<GoldLot> {
    // Validate data
    const validation = this.validateRegistrationData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check GPS accuracy requirements
    if (data.location.accuracy > 10) {
      throw new Error('GPS accuracy must be better than 10 meters for registration');
    }

    try {
      // Generate cryptographic proof
      const proof = await this.createCryptographicProof(data);
      
      // Create gold lot entity
      const goldLot: GoldLot = {
        id: proof.certificate.lotId,
        discoveryLocation: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          accuracy: data.location.accuracy,
          altitude: 0, // Could be enhanced with altitude data
          timestamp: Date.now(),
        },
        discoveryDate: data.discoveryDate,
        minerId: data.minerId,
        weight: data.goldDetails.estimatedQuantity,
        purity: data.goldDetails.purity,
        cryptoProof: proof.hash,
        certificateId: proof.certificate.id,
        status: 'discovered',
      };

      // Store the gold lot
      await this.storageService.saveGoldLot(goldLot);
      
      // Store the certificate
      await this.storageService.saveCertificate(proof.certificate);

      return goldLot;
    } catch (error) {
      throw new Error(`Failed to register gold lot: ${error}`);
    }
  }

  /**
   * Get current location with high accuracy
   */
  async captureHighAccuracyLocation(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
  }> {
    try {
      const location = await this.locationService.getCurrentLocation({
        accuracy: 'high',
        timeout: 30000,
        maximumAge: 0,
      });

      const address = await this.locationService.reverseGeocode(
        location.latitude,
        location.longitude
      );

      return {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        address: address.formattedAddress,
      };
    } catch (error) {
      throw new Error(`Failed to capture location: ${error}`);
    }
  }

  /**
   * Private helper methods
   */
  private hashPhoto(photoUri: string): string {
    // This would normally create a hash of the photo content
    return `photo_${Date.now()}_${Math.random().toString(36)}`;
  }

  private generateCertificateId(): string {
    return `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
}

export default GoldLotRegistrationService;