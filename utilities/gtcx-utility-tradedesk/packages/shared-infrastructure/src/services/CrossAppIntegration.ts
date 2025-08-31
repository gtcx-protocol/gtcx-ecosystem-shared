/**
 * Cross-App Integration Service
 * Deep integration between GeoTag™ and TradeDesk™ applications
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoldLot, Transaction, Trader } from '@geotag/shared-core';

export interface CrossAppMessage {
  id: string;
  fromApp: 'geotag' | 'tradedesk';
  toApp: 'geotag' | 'tradedesk';
  type: 'gold_lot_available' | 'trade_completed' | 'compliance_update' | 'user_notification';
  payload: any;
  timestamp: string;
  processed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface GoldLotNotification {
  goldLotId: string;
  minerId: string;
  discoveryLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  estimatedValue: number;
  purity: number;
  weight: number;
  availableForTrading: boolean;
  urgency: 'new_discovery' | 'quality_update' | 'availability_change';
}

export interface TradeNotification {
  transactionId: string;
  goldLotId: string;
  buyerId: string;
  sellerId: string;
  tradeValue: number;
  status: 'pending' | 'completed' | 'failed';
  complianceRequired: boolean;
}

export interface SharedUserSession {
  userId: string;
  primaryApp: 'geotag' | 'tradedesk';
  activeInBoth: boolean;
  permissions: {
    geotag: string[];
    tradedesk: string[];
  };
  crossAppData: {
    goldLots: string[];
    transactions: string[];
    compliance: any[];
  };
  lastSync: string;
}

export class CrossAppIntegrationService {
  private messageQueue: CrossAppMessage[] = [];
  private syncInterval: NodeJS.Timeout | null = null;
  private currentApp: 'geotag' | 'tradedesk';
  private listeners: Map<string, ((message: CrossAppMessage) => void)[]> = new Map();

  constructor(currentApp: 'geotag' | 'tradedesk') {
    this.currentApp = currentApp;
    this.initializeIntegration();
  }

  /**
   * Initialize cross-app integration
   */
  private async initializeIntegration(): Promise<void> {
    try {
      // Load pending messages
      await this.loadPendingMessages();
      
      // Start sync interval
      this.startSyncProcess();
      
      // Register for app state changes
      this.setupAppStateHandling();
      
      console.log(`🔗 Cross-app integration initialized for ${this.currentApp}`);
    } catch (error) {
      console.error('Failed to initialize cross-app integration:', error);
    }
  }

  /**
   * Send message to other app
   */
  async sendMessage(
    toApp: 'geotag' | 'tradedesk',
    type: CrossAppMessage['type'],
    payload: any,
    priority: CrossAppMessage['priority'] = 'medium'
  ): Promise<string> {
    const message: CrossAppMessage = {
      id: this.generateMessageId(),
      fromApp: this.currentApp,
      toApp,
      type,
      payload,
      timestamp: new Date().toISOString(),
      processed: false,
      priority,
    };

    // Add to local queue
    this.messageQueue.push(message);
    
    // Store persistently
    await this.persistMessage(message);
    
    // Attempt immediate delivery if other app is active
    await this.attemptImmediateDelivery(message);
    
    return message.id;
  }

  /**
   * Register listener for specific message types
   */
  onMessage(
    messageType: CrossAppMessage['type'],
    callback: (message: CrossAppMessage) => void
  ): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, []);
    }
    
    const listeners = this.listeners.get(messageType)!;
    listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify TradeDesk about new gold lot availability
   */
  async notifyGoldLotAvailable(goldLot: GoldLot): Promise<void> {
    if (this.currentApp !== 'geotag') return;

    try {
      const notification: GoldLotNotification = {
        goldLotId: goldLot.id,
        minerId: goldLot.minerId,
        discoveryLocation: goldLot.discoveryLocation,
        estimatedValue: goldLot.weight * goldLot.purity * 150, // Rough estimate
        purity: goldLot.purity,
        weight: goldLot.weight,
        availableForTrading: goldLot.status === 'verified',
        urgency: 'new_discovery',
      };

      await this.sendMessage('tradedesk', 'gold_lot_available', notification, 'high');
    } catch (error) {
      // Gracefully handle notification failures
      console.warn('Failed to notify TradeDesk about gold lot:', error);
      // Don't throw - this shouldn't block gold lot registration
    }
  }

  /**
   * Notify GeoTag about completed trade
   */
  async notifyTradeCompleted(transaction: Transaction): Promise<void> {
    if (this.currentApp !== 'tradedesk') return;

    const notification: TradeNotification = {
      transactionId: transaction.id,
      goldLotId: transaction.goldLotId,
      buyerId: transaction.toTraderId,
      sellerId: transaction.fromTraderId,
      tradeValue: transaction.price,
      status: 'completed',
      complianceRequired: true,
    };

    await this.sendMessage('geotag', 'trade_completed', notification, 'high');
  }

  /**
   * Sync user session across apps
   */
  async syncUserSession(userId: string): Promise<SharedUserSession> {
    try {
      const existingSession = await this.getSharedUserSession(userId);
      
      const session: SharedUserSession = {
        userId,
        primaryApp: this.currentApp,
        activeInBoth: true,
        permissions: {
          geotag: existingSession?.permissions.geotag || ['basic', 'mining'],
          tradedesk: existingSession?.permissions.tradedesk || ['basic', 'trading'],
        },
        crossAppData: {
          goldLots: await this.getUserGoldLots(userId),
          transactions: await this.getUserTransactions(userId),
          compliance: await this.getUserCompliance(userId),
        },
        lastSync: new Date().toISOString(),
      };

      await this.storeSharedUserSession(session);
      
      // Notify other app about session sync
      await this.sendMessage(
        this.currentApp === 'geotag' ? 'tradedesk' : 'geotag',
        'user_notification',
        { type: 'session_sync', userId, session },
        'medium'
      );

      return session;
    } catch (error) {
      throw new Error(`Failed to sync user session: ${error}`);
    }
  }

  /**
   * Get real-time gold lot feed for TradeDesk
   */
  async getAvailableGoldLots(filters?: {
    minPurity?: number;
    maxDistance?: number;
    userLocation?: { latitude: number; longitude: number };
  }): Promise<GoldLot[]> {
    try {
      // Get all verified gold lots from GeoTag
      const allGoldLots = await this.queryGeoTagGoldLots();
      
      let filteredLots = allGoldLots.filter(lot => lot.status === 'verified');

      // Apply filters
      if (filters?.minPurity) {
        filteredLots = filteredLots.filter(lot => lot.purity >= filters.minPurity!);
      }

      if (filters?.maxDistance && filters?.userLocation) {
        filteredLots = filteredLots.filter(lot => {
          const distance = this.calculateDistance(
            filters.userLocation!,
            lot.discoveryLocation
          );
          return distance <= filters.maxDistance!;
        });
      }

      return filteredLots;
    } catch (error) {
      throw new Error(`Failed to get available gold lots: ${error}`);
    }
  }

  /**
   * Real-time data synchronization
   */
  async startRealtimeSync(): Promise<void> {
    // This would integrate with WebSocket or Server-Sent Events
    // For now, we'll use polling with AsyncStorage
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.processPendingMessages();
        await this.syncCrossAppData();
      } catch (error) {
        console.error('Sync error:', error);
      }
    }, 5000); // Sync every 5 seconds
  }

  /**
   * Stop real-time synchronization
   */
  stopRealtimeSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Get cross-app analytics
   */
  async getCrossAppAnalytics(): Promise<{
    totalGoldLots: number;
    totalTrades: number;
    averageTradeValue: number;
    topTradingRegions: any[];
    integrationHealth: 'excellent' | 'good' | 'fair' | 'poor';
  }> {
    try {
      const goldLots = await this.queryGeoTagGoldLots();
      const transactions = await this.queryTradeDeskTransactions();
      
      const totalTradeValue = transactions.reduce((sum, tx) => sum + tx.price, 0);
      const averageTradeValue = transactions.length > 0 ? totalTradeValue / transactions.length : 0;

      // Calculate integration health based on message success rate
      const messages = await this.getAllMessages();
      const processedMessages = messages.filter(m => m.processed);
      const successRate = messages.length > 0 ? processedMessages.length / messages.length : 1;
      
      let integrationHealth: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
      if (successRate < 0.95) integrationHealth = 'good';
      if (successRate < 0.85) integrationHealth = 'fair';
      if (successRate < 0.70) integrationHealth = 'poor';

      return {
        totalGoldLots: goldLots.length,
        totalTrades: transactions.length,
        averageTradeValue,
        topTradingRegions: await this.getTopTradingRegions(),
        integrationHealth,
      };
    } catch (error) {
      throw new Error(`Failed to get cross-app analytics: ${error}`);
    }
  }

  // Private helper methods
  private async loadPendingMessages(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(`cross_app_messages_${this.currentApp}`);
      if (stored) {
        const messages: CrossAppMessage[] = JSON.parse(stored);
        this.messageQueue = messages.filter(m => !m.processed);
      }
    } catch (error) {
      console.error('Failed to load pending messages:', error);
    }
  }

  private async persistMessage(message: CrossAppMessage): Promise<void> {
    try {
      const key = `cross_app_messages_${message.toApp}`;
      const existing = await AsyncStorage.getItem(key);
      const messages: CrossAppMessage[] = existing ? JSON.parse(existing) : [];
      
      messages.push(message);
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to persist message:', error);
    }
  }

  private async processPendingMessages(): Promise<void> {
    const messages = await this.getPendingMessages();
    
    for (const message of messages) {
      try {
        await this.processMessage(message);
        message.processed = true;
        await this.updateMessageStatus(message);
      } catch (error) {
        console.error('Failed to process message:', message.id, error);
      }
    }
  }

  private async processMessage(message: CrossAppMessage): Promise<void> {
    const listeners = this.listeners.get(message.type) || [];
    
    for (const listener of listeners) {
      try {
        listener(message);
      } catch (error) {
        console.error('Message listener error:', error);
      }
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  private calculateDistance(point1: any, point2: any): number {
    // Haversine formula implementation
    const R = 6371; // Earth's radius in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Placeholder methods for data access
  private async queryGeoTagGoldLots(): Promise<GoldLot[]> {
    // This would query the GeoTag gold lot registry
    return [];
  }

  private async queryTradeDeskTransactions(): Promise<Transaction[]> {
    // This would query the TradeDesk transaction history
    return [];
  }

  private async getSharedUserSession(userId: string): Promise<SharedUserSession | null> {
    try {
      const stored = await AsyncStorage.getItem(`shared_session_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  private async storeSharedUserSession(session: SharedUserSession): Promise<void> {
    await AsyncStorage.setItem(`shared_session_${session.userId}`, JSON.stringify(session));
  }

  private async getUserGoldLots(userId: string): Promise<string[]> {
    // Get user's gold lots from storage
    return [];
  }

  private async getUserTransactions(userId: string): Promise<string[]> {
    // Get user's transactions from storage
    return [];
  }

  private async getUserCompliance(userId: string): Promise<any[]> {
    // Get user's compliance records
    return [];
  }

  private async getPendingMessages(): Promise<CrossAppMessage[]> {
    return this.messageQueue.filter(m => !m.processed);
  }

  private async updateMessageStatus(message: CrossAppMessage): Promise<void> {
    // Update message status in storage
  }

  private async getAllMessages(): Promise<CrossAppMessage[]> {
    // Get all messages for analytics
    return this.messageQueue;
  }

  private async getTopTradingRegions(): Promise<any[]> {
    // Calculate top trading regions
    return [];
  }

  private startSyncProcess(): void {
    this.startRealtimeSync();
  }

  private setupAppStateHandling(): void {
    // Handle app state changes for optimal sync
  }

  private async attemptImmediateDelivery(message: CrossAppMessage): Promise<void> {
    // Try to deliver message immediately if other app is running
  }

  private async syncCrossAppData(): Promise<void> {
    // Sync shared data between apps
  }
}

export default CrossAppIntegrationService;