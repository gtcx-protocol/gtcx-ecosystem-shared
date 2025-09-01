/**
 * GTCX Notification Service
 * 
 * This service integrates with all GTCX protocols to provide
 * real-time notifications for the Telegram bot.
 */

import axios from 'axios'
import { TradingNotification, VerificationNotification, ComplianceNotification, SettlementNotification } from './types'

export interface GTCXNotificationServiceConfig {
  gtcxApiUrl: string
  apiKey?: string
  timeout: number
}

export class GTCXNotificationService {
  private config: GTCXNotificationServiceConfig
  private httpClient: any

  constructor(config: GTCXNotificationServiceConfig) {
    this.config = config
    this.httpClient = axios.create({
      baseURL: config.gtcxApiUrl,
      timeout: config.timeout,
      headers: config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}
    })
  }

  // ===== TRADING NOTIFICATIONS =====

  /**
   * Send trade execution notification
   */
  async sendTradeNotification(userId: string, trade: TradingNotification): Promise<void> {
    const notification = {
      type: 'trade_executed',
      userId,
      data: {
        tradeId: trade.tradeId,
        commodity: trade.commodity,
        quantity: trade.quantity,
        price: trade.price,
        currency: trade.currency,
        buyer: trade.buyer,
        seller: trade.seller,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '📊 View Trade Details', callback_data: `trade_details_${trade.tradeId}` }],
          [{ text: '📈 Market Analysis', callback_data: `market_analysis_${trade.commodity}` }],
          [{ text: '🔔 Trade Alerts', callback_data: `trade_alerts_${trade.commodity}` }]
        ]
      }
    }

    // In a real implementation, this would send to the bot
    console.log('💰 Trade notification prepared:', notification)
  }

  /**
   * Send settlement progress notification
   */
  async sendSettlementUpdate(userId: string, settlement: SettlementNotification): Promise<void> {
    const notification = {
      type: 'settlement_update',
      userId,
      data: {
        settlementId: settlement.settlementId,
        tradeId: settlement.tradeId,
        status: settlement.status,
        progress: settlement.progress,
        paymentStatus: settlement.paymentStatus,
        deliveryStatus: settlement.deliveryStatus,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '💱 View Settlement', callback_data: `settlement_${settlement.settlementId}` }],
          [{ text: '📦 Track Delivery', callback_data: `delivery_${settlement.settlementId}` }],
          [{ text: '💰 Payment Status', callback_data: `payment_${settlement.settlementId}` }]
        ]
      }
    }

    console.log('💱 Settlement notification prepared:', notification)
  }

  // ===== VERIFICATION NOTIFICATIONS =====

  /**
   * Send verification workflow update
   */
  async sendVerificationUpdate(userId: string, verification: VerificationNotification): Promise<void> {
    const notification = {
      type: 'verification_update',
      userId,
      data: {
        verificationId: verification.verificationId,
        type: verification.type,
        status: verification.status,
        progress: verification.progress,
        inspector: verification.inspector,
        commodity: verification.commodity,
        location: verification.location,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '🔐 View Verification', callback_data: `verification_${verification.verificationId}` }],
          [{ text: '📍 Location Details', callback_data: `location_${verification.verificationId}` }],
          [{ text: '🏷️ Quality Results', callback_data: `quality_${verification.verificationId}` }]
        ]
      }
    }

    console.log('🔐 Verification notification prepared:', notification)
  }

  /**
   * Send quality verification result
   */
  async sendQualityAlert(userId: string, quality: any): Promise<void> {
    const notification = {
      type: 'quality_verification',
      userId,
      data: {
        qualityId: quality.qualityId,
        commodity: quality.commodity,
        qualityScore: quality.qualityScore,
        standards: quality.standards,
        inspector: quality.inspector,
        location: quality.location,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '🏷️ Quality Report', callback_data: `quality_report_${quality.qualityId}` }],
          [{ text: '📊 Quality Metrics', callback_data: `quality_metrics_${quality.qualityId}` }],
          [{ text: '⚠️ Quality Alerts', callback_data: `quality_alerts_${quality.commodity}` }]
        ]
      }
    }

    console.log('🏷️ Quality notification prepared:', notification)
  }

  // ===== COMPLIANCE NOTIFICATIONS =====

  /**
   * Send compliance alert
   */
  async sendComplianceAlert(userId: string, compliance: ComplianceNotification): Promise<void> {
    const notification = {
      type: 'compliance_alert',
      userId,
      data: {
        complianceId: compliance.complianceId,
        type: compliance.type,
        severity: compliance.severity,
        description: compliance.description,
        affectedEntities: compliance.affectedEntities,
        recommendations: compliance.recommendations,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '🧠 Compliance Report', callback_data: `compliance_${compliance.complianceId}` }],
          [{ text: '⚠️ Risk Assessment', callback_data: `risk_${compliance.complianceId}` }],
          [{ text: '📋 Action Items', callback_data: `actions_${compliance.complianceId}` }]
        ]
      }
    }

    console.log('🧠 Compliance notification prepared:', notification)
  }

  /**
   * Send risk assessment notification
   */
  async sendRiskNotification(userId: string, risk: any): Promise<void> {
    const notification = {
      type: 'risk_assessment',
      userId,
      data: {
        riskId: risk.riskId,
        riskLevel: risk.riskLevel,
        riskScore: risk.riskScore,
        riskFactors: risk.riskFactors,
        affectedCommodity: risk.affectedCommodity,
        recommendations: risk.recommendations,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '⚠️ Risk Details', callback_data: `risk_details_${risk.riskId}` }],
          [{ text: '📊 Risk Metrics', callback_data: `risk_metrics_${risk.riskId}` }],
          [{ text: '🛡️ Mitigation', callback_data: `mitigation_${risk.riskId}` }]
        ]
      }
    }

    console.log('⚠️ Risk notification prepared:', notification)
  }

  // ===== SUPPLY CHAIN NOTIFICATIONS =====

  /**
   * Send location update notification
   */
  async sendLocationUpdate(userId: string, location: any): Promise<void> {
    const notification = {
      type: 'location_update',
      userId,
      data: {
        locationId: location.locationId,
        commodity: location.commodity,
        coordinates: location.coordinates,
        locationType: location.locationType,
        verificationStatus: location.verificationStatus,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '📍 View Location', callback_data: `location_${location.locationId}` }],
          [{ text: '🗺️ Map View', callback_data: `map_${location.locationId}` }],
          [{ text: '📊 Location Analytics', callback_data: `analytics_${location.locationId}` }]
        ]
      }
    }

    console.log('📍 Location notification prepared:', notification)
  }

  /**
   * Send supply chain alert
   */
  async sendSupplyChainAlert(userId: string, chain: any): Promise<void> {
    const notification = {
      type: 'supply_chain_alert',
      userId,
      data: {
        chainId: chain.chainId,
        commodity: chain.commodity,
        alertType: chain.alertType,
        severity: chain.severity,
        description: chain.description,
        affectedNodes: chain.affectedNodes,
        recommendations: chain.recommendations,
        timestamp: new Date().toISOString()
      },
      keyboard: {
        inline_keyboard: [
          [{ text: '🔗 Supply Chain View', callback_data: `chain_${chain.chainId}` }],
          [{ text: '⚠️ Alert Details', callback_data: `alert_${chain.chainId}` }],
          [{ text: '📊 Chain Analytics', callback_data: `analytics_${chain.chainId}` }]
        ]
      }
    }

    console.log('🔗 Supply chain notification prepared:', notification)
  }

  // ===== PROTOCOL INTEGRATION =====

  /**
   * Get trading data from GTCX protocols
   */
  async getTradingData(userId: string): Promise<any> {
    try {
      const response = await this.httpClient.get(`/api/trading/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('❌ Failed to get trading data:', error)
      return null
    }
  }

  /**
   * Get verification data from GTCX protocols
   */
  async getVerificationData(userId: string): Promise<any> {
    try {
      const response = await this.httpClient.get(`/api/verification/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('❌ Failed to get verification data:', error)
      return null
    }
  }

  /**
   * Get compliance data from GTCX protocols
   */
  async getComplianceData(userId: string): Promise<any> {
    try {
      const response = await this.httpClient.get(`/api/compliance/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('❌ Failed to get compliance data:', error)
      return null
    }
  }
}

export default GTCXNotificationService
