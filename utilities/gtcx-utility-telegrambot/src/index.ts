/**
 * GTCX Telegram Bot - Main Entry Point
 * 
 * This is the main entry point for the GTCX Telegram Bot,
 * which provides real-time notifications for the entire
 * GTCX commodity trading ecosystem.
 */

import dotenv from 'dotenv'
import GTCXBot from './bot/gtcx-bot'

// Load environment variables
dotenv.config()

// Bot configuration
const botConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  gtcxApiUrl: process.env.GTCX_API_URL || 'http://localhost:3000',
  environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development'
}

// Validate required configuration
if (!botConfig.botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required')
  process.exit(1)
}

// Create and start the bot
async function main() {
  try {
    console.log('🚀 Starting GTCX Telegram Bot...')
    console.log('🌍 Environment:', botConfig.environment)
    console.log('🔗 GTCX API URL:', botConfig.gtcxApiUrl)
    
    const bot = new GTCXBot(botConfig)
    await bot.start()
    
    console.log('✅ GTCX Telegram Bot started successfully!')
    console.log('🤖 Bot is now listening for messages...')
    
  } catch (error) {
    console.error('❌ Failed to start GTCX Telegram Bot:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Start the bot
main()
