// Shared Core Business Logic
// Platform-agnostic domain services and business rules

// Domain Types
export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: number;
}

export interface GoldLot {
  id: string;
  discoveryLocation: Location;
  discoveryDate: string;
  minerId: string;
  weight: number;
  purity: number;
  cryptoProof: string;
  certificateId: string;
  status: 'discovered' | 'verified' | 'traded' | 'exported';
}

export interface Trader {
  id: string;
  licenseNumber: string;
  name: string;
  location: Location;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
}

export interface Transaction {
  id: string;
  goldLotId: string;
  fromTraderId: string;
  toTraderId: string;
  price: number;
  currency: 'GHS' | 'USD' | 'EUR';
  timestamp: string;
  location: Location;
  cryptoSignature: string;
}

// Business Rules
export class BusinessRules {
  static isValidGoldLot(goldLot: Partial<GoldLot>): boolean {
    return !!(
      goldLot.id &&
      goldLot.discoveryLocation &&
      goldLot.weight &&
      goldLot.weight > 0 &&
      goldLot.purity &&
      goldLot.purity > 0 &&
      goldLot.purity <= 100 &&
      goldLot.cryptoProof
    );
  }

  static isValidTransaction(transaction: Partial<Transaction>): boolean {
    return !!(
      transaction.id &&
      transaction.goldLotId &&
      transaction.fromTraderId &&
      transaction.toTraderId &&
      transaction.price &&
      transaction.price > 0 &&
      transaction.cryptoSignature
    );
  }

  static canTraderAcceptGold(trader: Trader): boolean {
    return trader.verificationLevel !== 'basic';
  }

  static getMinimumLocationAccuracy(): number {
    return 10; // 10 meters
  }
}

// Shared Business Services
export interface MiningOperationsService {
  registerGoldLot(data: Omit<GoldLot, 'id' | 'status'>): Promise<GoldLot>;
  verifyGoldLot(goldLotId: string): Promise<boolean>;
  getGoldLotHistory(goldLotId: string): Promise<Transaction[]>;
}

export interface TradingService {
  createTransaction(transactionData: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction>;
  validateTrader(traderId: string): Promise<boolean>;
  getMarketPrice(purity: number, weight: number): Promise<number>;
}

export interface ComplianceService {
  generateComplianceReport(goldLotId: string): Promise<any>;
  checkRegulations(location: Location): Promise<any>;
  validateLicenses(traderId: string): Promise<boolean>;
}

// Domain Services
export { default as GoldLotRegistrationService } from './domain/GoldLotRegistrationService';
export type { GoldLotRegistrationData, WorkflowStep } from './domain/GoldLotRegistrationService';

export { default as TradingService } from './domain/TradingService';
export type { 
  MarketPrice, 
  TradingOpportunity, 
  TradeAnalytics 
} from './domain/TradingService';

export { default as UnifiedComplianceService } from './domain/UnifiedComplianceService';
export type {
  ComplianceRecord,
  ComplianceDashboard,
  GhanaRegulation
} from './domain/UnifiedComplianceService';

// ViewModels
export { default as useGoldLotRegistrationViewModel } from './viewmodels/GoldLotRegistrationViewModel';
export type { 
  GoldLotRegistrationState, 
  GoldLotRegistrationActions 
} from './viewmodels/GoldLotRegistrationViewModel';