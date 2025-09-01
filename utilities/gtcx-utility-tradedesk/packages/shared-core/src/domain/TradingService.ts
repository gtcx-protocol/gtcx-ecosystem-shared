/**
 * Trading Service - TradeDesk Domain Logic
 * Business logic for gold trading operations and market analysis
 */

import { GoldLot, Transaction, Trader, Location } from '../index';

export interface MarketPrice {
  goldType: 'nugget' | 'dust' | 'mixed';
  purity: number;
  basePrice: number; // GHS per gram
  usdPrice: number; // USD per gram
  timestamp: string;
  source: 'london_fix' | 'ghana_market' | 'international';
  spread: number; // bid-ask spread percentage
}

export interface TradingOpportunity {
  id: string;
  goldLotId: string;
  goldLot: GoldLot;
  seller: Trader;
  askPrice: number;
  currency: 'GHS' | 'USD' | 'EUR';
  location: Location;
  availableUntil: string;
  minQuantity: number;
  maxQuantity: number;
  qualityGrade: 'A' | 'B' | 'C';
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  complianceStatus: 'pending' | 'verified' | 'approved';
}

export interface TradeAnalytics {
  totalVolume: number;
  averagePrice: number;
  priceChange24h: number;
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  liquidityScore: number;
  riskAssessment: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export class TradingService {
  private priceService: any;
  private complianceService: any;
  private cryptoService: any;
  private storageService: any;

  constructor(dependencies: {
    priceService: any;
    complianceService: any;
    cryptoService: any;
    storageService: any;
  }) {
    this.priceService = dependencies.priceService;
    this.complianceService = dependencies.complianceService;
    this.cryptoService = dependencies.cryptoService;
    this.storageService = dependencies.storageService;
  }

  /**
   * Get current market prices for different gold types
   */
  async getCurrentMarketPrices(): Promise<MarketPrice[]> {
    try {
      // This would integrate with real market data feeds
      const baseGoldPrice = await this.priceService.getLondonFixPrice();
      const ghanaMarketData = await this.priceService.getGhanaMarketRates();
      const usdToGhsRate = await this.priceService.getExchangeRate('USD', 'GHS');

      return [
        {
          goldType: 'nugget',
          purity: 85, // Average nugget purity
          basePrice: baseGoldPrice * 0.85 * usdToGhsRate,
          usdPrice: baseGoldPrice * 0.85,
          timestamp: new Date().toISOString(),
          source: 'ghana_market',
          spread: 2.5, // 2.5% spread
        },
        {
          goldType: 'dust',
          purity: 70, // Average dust purity
          basePrice: baseGoldPrice * 0.70 * usdToGhsRate,
          usdPrice: baseGoldPrice * 0.70,
          timestamp: new Date().toISOString(),
          source: 'ghana_market',
          spread: 3.0, // 3% spread for dust
        },
        {
          goldType: 'mixed',
          purity: 75, // Average mixed purity
          basePrice: baseGoldPrice * 0.75 * usdToGhsRate,
          usdPrice: baseGoldPrice * 0.75,
          timestamp: new Date().toISOString(),
          source: 'ghana_market',
          spread: 2.8,
        },
      ];
    } catch (error) {
      throw new Error(`Failed to get market prices: ${error}`);
    }
  }

  /**
   * Calculate fair trade price for a gold lot
   */
  async calculateFairPrice(goldLot: GoldLot): Promise<{
    fairPrice: number;
    currency: 'GHS';
    breakdown: {
      baseValue: number;
      purityAdjustment: number;
      qualityPremium: number;
      locationDiscount: number;
      finalPrice: number;
    };
  }> {
    try {
      const marketPrices = await this.getCurrentMarketPrices();
      const relevantPrice = marketPrices.find(p => 
        p.goldType === (goldLot as any).form || p.goldType === 'mixed'
      ) || marketPrices[2]; // Default to mixed

      const baseValue = goldLot.weight * (goldLot.purity / 100) * relevantPrice.basePrice;
      
      // Quality adjustments
      const qualityPremium = this.calculateQualityPremium(goldLot);
      const locationDiscount = await this.calculateLocationDiscount(goldLot.discoveryLocation);
      
      const finalPrice = baseValue + qualityPremium - locationDiscount;

      return {
        fairPrice: Math.round(finalPrice * 100) / 100,
        currency: 'GHS',
        breakdown: {
          baseValue: Math.round(baseValue * 100) / 100,
          purityAdjustment: Math.round((goldLot.purity / 100) * baseValue * 100) / 100,
          qualityPremium: Math.round(qualityPremium * 100) / 100,
          locationDiscount: Math.round(locationDiscount * 100) / 100,
          finalPrice: Math.round(finalPrice * 100) / 100,
        },
      };
    } catch (error) {
      throw new Error(`Failed to calculate fair price: ${error}`);
    }
  }

  /**
   * Find available trading opportunities
   */
  async findTradingOpportunities(filters?: {
    maxPrice?: number;
    minPurity?: number;
    location?: { radius: number; center: Location };
    goldType?: 'nugget' | 'dust' | 'mixed';
    verificationLevel?: 'basic' | 'enhanced' | 'premium';
  }): Promise<TradingOpportunity[]> {
    try {
      // Get available gold lots from GeoTag integration
      const availableGoldLots = await this.getAvailableGoldLots();
      
      const opportunities: TradingOpportunity[] = [];

      for (const goldLot of availableGoldLots) {
        // Check if lot meets filters
        if (filters?.minPurity && goldLot.purity < filters.minPurity) continue;
        if (filters?.goldType && (goldLot as any).form !== filters.goldType) continue;

        // Calculate suggested price
        const priceInfo = await this.calculateFairPrice(goldLot);
        
        if (filters?.maxPrice && priceInfo.fairPrice > filters.maxPrice) continue;

        // Check location filter
        if (filters?.location) {
          const distance = this.calculateDistance(
            filters.location.center,
            goldLot.discoveryLocation
          );
          if (distance > filters.location.radius) continue;
        }

        // Get seller information
        const seller = await this.getTraderInfo(goldLot.minerId);
        
        opportunities.push({
          id: `opp_${goldLot.id}_${Date.now()}`,
          goldLotId: goldLot.id,
          goldLot,
          seller,
          askPrice: priceInfo.fairPrice * 1.05, // 5% markup
          currency: 'GHS',
          location: goldLot.discoveryLocation,
          availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          minQuantity: Math.max(0.1, goldLot.weight * 0.1),
          maxQuantity: goldLot.weight,
          qualityGrade: this.assessQualityGrade(goldLot),
          verificationLevel: 'enhanced',
          complianceStatus: 'verified',
        });
      }

      return opportunities.sort((a, b) => b.seller.verificationLevel.localeCompare(a.seller.verificationLevel));
    } catch (error) {
      throw new Error(`Failed to find trading opportunities: ${error}`);
    }
  }

  /**
   * Execute a trade transaction
   */
  async executeTrade(request: {
    opportunityId: string;
    buyerId: string;
    quantity: number;
    agreedPrice: number;
    paymentMethod: 'mobile_money' | 'bank_transfer' | 'cash';
    deliveryLocation?: Location;
  }): Promise<Transaction> {
    try {
      // Validate trade request
      const opportunity = await this.getTradingOpportunity(request.opportunityId);
      if (!opportunity) {
        throw new Error('Trading opportunity not found');
      }

      if (request.quantity < opportunity.minQuantity || request.quantity > opportunity.maxQuantity) {
        throw new Error('Quantity outside allowed range');
      }

      // Verify buyer credentials
      const buyer = await this.getTraderInfo(request.buyerId);
      if (!buyer || !await this.complianceService.validateLicenses(request.buyerId)) {
        throw new Error('Buyer verification failed');
      }

      // Create transaction record
      const transaction: Transaction = {
        id: this.generateTransactionId(),
        goldLotId: opportunity.goldLotId,
        fromTraderId: opportunity.seller.id,
        toTraderId: request.buyerId,
        price: request.agreedPrice,
        currency: 'GHS',
        timestamp: new Date().toISOString(),
        location: request.deliveryLocation || opportunity.location,
        cryptoSignature: await this.cryptoService.signTransaction({
          goldLotId: opportunity.goldLotId,
          fromTraderId: opportunity.seller.id,
          toTraderId: request.buyerId,
          price: request.agreedPrice,
          quantity: request.quantity,
          timestamp: Date.now(),
        }),
      };

      // Store transaction
      await this.storageService.saveTransaction(transaction);
      
      // Update gold lot ownership
      await this.updateGoldLotOwnership(opportunity.goldLotId, request.buyerId);

      // Generate compliance documentation
      await this.generateTradeCompliance(transaction, opportunity, request);

      return transaction;
    } catch (error) {
      throw new Error(`Failed to execute trade: ${error}`);
    }
  }

  /**
   * Get trade analytics and market insights
   */
  async getTradeAnalytics(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<TradeAnalytics> {
    try {
      const transactions = await this.getRecentTransactions(timeframe);
      const marketPrices = await this.getCurrentMarketPrices();

      const totalVolume = transactions.reduce((sum, tx) => sum + (tx as any).quantity, 0);
      const averagePrice = transactions.reduce((sum, tx) => sum + tx.price, 0) / transactions.length;
      
      // Calculate price change
      const oldestTx = transactions[transactions.length - 1];
      const newestTx = transactions[0];
      const priceChange24h = oldestTx ? ((newestTx.price - oldestTx.price) / oldestTx.price) * 100 : 0;

      // Determine market trend
      let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      if (priceChange24h > 2) marketTrend = 'bullish';
      else if (priceChange24h < -2) marketTrend = 'bearish';

      // Calculate liquidity score (0-100)
      const liquidityScore = Math.min(100, (totalVolume / 10) * 100); // Normalized

      return {
        totalVolume,
        averagePrice,
        priceChange24h,
        marketTrend,
        liquidityScore,
        riskAssessment: liquidityScore > 70 ? 'low' : liquidityScore > 40 ? 'medium' : 'high',
        recommendations: this.generateTradingRecommendations(marketTrend, liquidityScore, priceChange24h),
      };
    } catch (error) {
      throw new Error(`Failed to get trade analytics: ${error}`);
    }
  }

  // Private helper methods
  private calculateQualityPremium(goldLot: GoldLot): number {
    // Premium based on purity and discovery location accuracy
    let premium = 0;
    
    if (goldLot.purity > 90) premium += 50; // High purity bonus
    if (goldLot.discoveryLocation.accuracy < 5) premium += 25; // High accuracy bonus
    
    return premium;
  }

  private async calculateLocationDiscount(location: Location): Promise<number> {
    // Discount based on distance from major trading centers
    // This would use real geographic data
    return 10; // Placeholder discount
  }

  private calculateDistance(point1: Location, point2: Location): number {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private assessQualityGrade(goldLot: GoldLot): 'A' | 'B' | 'C' {
    if (goldLot.purity > 85 && goldLot.discoveryLocation.accuracy < 5) return 'A';
    if (goldLot.purity > 70 && goldLot.discoveryLocation.accuracy < 10) return 'B';
    return 'C';
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  private generateTradingRecommendations(trend: string, liquidity: number, priceChange: number): string[] {
    const recommendations: string[] = [];
    
    if (trend === 'bullish' && liquidity > 50) {
      recommendations.push('Good time to sell - prices trending upward with good liquidity');
    }
    if (trend === 'bearish' && priceChange < -5) {
      recommendations.push('Consider buying opportunities - prices may be undervalued');
    }
    if (liquidity < 30) {
      recommendations.push('Low liquidity market - exercise caution with large trades');
    }
    
    recommendations.push('Always verify seller credentials and gold lot authenticity');
    recommendations.push('Consider market timing and regulatory compliance requirements');
    
    return recommendations;
  }

  // Placeholder methods that would integrate with real services
  private async getAvailableGoldLots(): Promise<GoldLot[]> {
    // This would integrate with GeoTag's gold lot registry
    return [];
  }

  private async getTraderInfo(traderId: string): Promise<Trader> {
    // This would get trader information from the trader registry
    return {
      id: traderId,
      licenseNumber: `LIC-${traderId}`,
      name: 'Sample Trader',
      location: { latitude: 5.6037, longitude: -0.1870, accuracy: 10, altitude: 0, timestamp: Date.now() },
      verificationLevel: 'enhanced',
    };
  }

  private async getTradingOpportunity(opportunityId: string): Promise<TradingOpportunity | null> {
    // This would get the trading opportunity from storage
    return null;
  }

  private async updateGoldLotOwnership(goldLotId: string, newOwnerId: string): Promise<void> {
    // This would update the gold lot ownership in the registry
  }

  private async generateTradeCompliance(transaction: Transaction, opportunity: TradingOpportunity, request: any): Promise<void> {
    // This would generate compliance documentation for the trade
  }

  private async getRecentTransactions(timeframe: string): Promise<Transaction[]> {
    // This would get recent transactions from storage
    return [];
  }
}

export default TradingService;