/**
 * GTCX Telegram Bot - Core Implementation
 * 
 * This bot provides real-time notifications and interactive features
 * for the entire GTCX commodity trading ecosystem.
 */

import { Telegraf, Context } from 'telegraf'
import { message } from 'telegraf/filters'
import { GTCXNotificationService } from '../notifications/notification-service'
import { UserManager } from '../utils/user-manager'
import { LanguageManager } from '../utils/language-manager'
import { TradingCommands } from './commands/trading-commands'
import { VerificationCommands } from './commands/verification-commands'
import { UserCommands } from './commands/user-commands'

export interface GTCXBotConfig {
  botToken: string
  redisUrl: string
  gtcxApiUrl: string
  environment: 'development' | 'staging' | 'production'
}

export class GTCXBot {
  private bot: Telegraf
  private notificationService: GTCXNotificationService
  private userManager: UserManager
  private languageManager: LanguageManager
  private tradingCommands: TradingCommands
  private verificationCommands: VerificationCommands
  private userCommands: UserCommands

  constructor(config: GTCXBotConfig) {
    this.bot = new Telegraf(config.botToken)
    this.notificationService = new GTCXNotificationService(config.gtcxApiUrl)
    this.userManager = new UserManager(config.redisUrl)
    this.languageManager = new LanguageManager()
    
    // Initialize command handlers
    this.tradingCommands = new TradingCommands(this.notificationService, this.userManager)
    this.verificationCommands = new VerificationCommands(this.notificationService, this.userManager)
    this.userCommands = new UserCommands(this.userManager, this.languageManager)
    
    this.setupBot()
  }

  private setupBot() {
    // Start command
    this.bot.start(async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      const user = await this.userManager.getOrCreateUser(userId)
      const welcomeMessage = await this.languageManager.getLocalizedMessage(
        user.language || 'en',
        'welcome_message',
        { name: ctx.from?.first_name || 'User' }
      )

      await ctx.reply(welcomeMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌍 Set Language', callback_data: 'set_language' }],
            [{ text: '🔔 Notification Settings', callback_data: 'notifications' }],
            [{ text: '�� Help', callback_data: 'help' }]
          ]
        }
      })
    })

    // Help command
    this.bot.help(async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      const user = await this.userManager.getUser(userId)
      const helpMessage = await this.languageManager.getLocalizedMessage(
        user?.language || 'en',
        'help_message'
      )

      await ctx.reply(helpMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💰 Trading Commands', callback_data: 'trading_help' }],
            [{ text: '🔐 Verification Commands', callback_data: 'verification_help' }],
            [{ text: '⚙️ Settings', callback_data: 'settings' }]
          ]
        }
      })
    })

    // Setup command handlers
    this.setupTradingCommands()
    this.setupVerificationCommands()
    this.setupUserCommands()
    this.setupCallbacks()
  }

  private setupTradingCommands() {
    // Trade status command
    this.bot.command('trade', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.tradingCommands.handleTradeStatus(ctx, userId)
    })

    // Settlement status command
    this.bot.command('settlement', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.tradingCommands.handleSettlementStatus(ctx, userId)
    })

    // Quality verification command
    this.bot.command('quality', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.tradingCommands.handleQualityStatus(ctx, userId)
    })

    // Compliance status command
    this.bot.command('compliance', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.tradingCommands.handleComplianceStatus(ctx, userId)
    })

    // Risk assessment command
    this.bot.command('risk', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.tradingCommands.handleRiskAssessment(ctx, userId)
    })
  }

  private setupVerificationCommands() {
    // Verification workflow command
    this.bot.command('verify', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.verificationCommands.handleVerificationWorkflow(ctx, userId)
    })

    // Verification status command
    this.bot.command('status', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.verificationCommands.handleVerificationStatus(ctx, userId)
    })

    // Location verification command
    this.bot.command('location', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.verificationCommands.handleLocationVerification(ctx, userId)
    })

    // Quality check command
    this.bot.command('quality_check', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.verificationCommands.handleQualityCheck(ctx, userId)
    })

    // Compliance check command
    this.bot.command('compliance_check', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.verificationCommands.handleComplianceCheck(ctx, userId)
    })
  }

  private setupUserCommands() {
    // Settings command
    this.bot.command('settings', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.userCommands.handleSettings(ctx, userId)
    })

    // Language command
    this.bot.command('language', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.userCommands.handleLanguageSelection(ctx, userId)
    })

    // Subscriptions command
    this.bot.command('subscriptions', async (ctx) => {
      const userId = ctx.from?.id.toString()
      if (!userId) return

      await this.userCommands.handleSubscriptions(ctx, userId)
    })
  }

  private setupCallbacks() {
    // Handle callback queries
    this.bot.on('callback_query', async (ctx) => {
      const callbackData = ctx.callbackQuery?.data
      if (!callbackData) return

      const userId = ctx.from?.id.toString()
      if (!userId) return

      // Route callbacks to appropriate handlers
      if (callbackData.startsWith('trading_')) {
        await this.tradingCommands.handleCallback(ctx, callbackData, userId)
      } else if (callbackData.startsWith('verification_')) {
        await this.verificationCommands.handleCallback(ctx, callbackData, userId)
      } else if (callbackData.startsWith('user_')) {
        await this.userCommands.handleCallback(ctx, callbackData, userId)
      } else if (callbackData.startsWith('set_language')) {
        await this.userCommands.handleLanguageCallback(ctx, userId)
      } else if (callbackData.startsWith('notifications')) {
        await this.userCommands.handleNotificationCallback(ctx, userId)
      } else if (callbackData.startsWith('help')) {
        await this.userCommands.handleHelpCallback(ctx, userId)
      }
    })
  }

  // Public method to start the bot
  async start() {
    try {
      await this.bot.launch()
      console.log('🤖 GTCX Telegram Bot started successfully!')
      
      // Enable graceful stop
      process.once('SIGINT', () => this.bot.stop('SIGINT'))
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
    } catch (error) {
      console.error('❌ Failed to start GTCX Telegram Bot:', error)
      throw error
    }
  }

  // Public method to stop the bot
  async stop() {
    try {
      await this.bot.stop()
      console.log('🤖 GTCX Telegram Bot stopped successfully!')
    } catch (error) {
      console.error('❌ Failed to stop GTCX Telegram Bot:', error)
      throw error
    }
  }

  // Method to send notifications to users
  async sendNotification(userId: string, notification: any) {
    try {
      const user = await this.userManager.getUser(userId)
      if (!user) {
        console.warn(`⚠️ User ${userId} not found for notification`)
        return
      }

      const localizedMessage = await this.languageManager.getLocalizedMessage(
        user.language || 'en',
        notification.type,
        notification.data
      )

      await this.bot.telegram.sendMessage(userId, localizedMessage, {
        parse_mode: 'HTML',
        reply_markup: notification.keyboard || undefined
      })

      console.log(`✅ Notification sent to user ${userId}: ${notification.type}`)
    } catch (error) {
      console.error(`❌ Failed to send notification to user ${userId}:`, error)
    }
  }

  // Method to broadcast notifications to multiple users
  async broadcastNotification(userIds: string[], notification: any) {
    const promises = userIds.map(userId => this.sendNotification(userId, notification))
    await Promise.allSettled(promises)
    console.log(`📢 Broadcast notification sent to ${userIds.length} users`)
  }
}

export default GTCXBot
