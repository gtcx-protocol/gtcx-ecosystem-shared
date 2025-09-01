// ============================================================================
// GCTX TELEGRAM BOT - GHANA MINING ECOSYSTEM INTEGRATION
// Military-grade onboarding and stakeholder management system
// ============================================================================

import { Telegraf, Context, session, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import dotenv from 'dotenv';
import Redis from 'redis';
import { createLogger, transports, format } from 'winston';
import { GCTXBotService } from './services/GCTXBotService';
import { StakeholderOnboarding } from './scenes/StakeholderOnboarding';
import { VerificationWizard } from './scenes/VerificationWizard';
import { DemoOrchestrator } from './scenes/DemoOrchestrator';
import { GovernmentDashboard } from './scenes/GovernmentDashboard';
import { DatabaseService } from './services/DatabaseService';
import { SecurityService } from './services/SecurityService';
import { IntegrationService } from './services/IntegrationService';

dotenv.config();

// ============================================================================
// CONFIGURATION AND SETUP
// ============================================================================

interface GCTXContext extends Context {
  scene: Scenes.SceneContextScene<GCTXContext>;
  session: {
    user?: {
      id: string;
      telegramId: number;
      stakeholderType?: 'miner' | 'trader' | 'inspector' | 'buyer' | 'demo';
      verificationLevel?: 'basic' | 'enhanced' | 'premium';
      onboardingStep?: number;
      preferences?: any;
    };
    demo?: {
      active: boolean;
      scenario?: string;
      startTime?: number;
      interactions?: any[];
    };
    verification?: {
      currentStep?: string;
      documents?: string[];
      status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
    };
  };
}

// Logger setup
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.simple()
    })
  ],
});

// Redis client for session management
const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// ============================================================================
// BOT INITIALIZATION
// ============================================================================

if (!process.env.TELEGRAM_BOT_TOKEN) {
  logger.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf<GCTXContext>(process.env.TELEGRAM_BOT_TOKEN);
const stage = new Scenes.Stage<GCTXContext>([
  new StakeholderOnboarding().scene,
  new VerificationWizard().scene,
  new DemoOrchestrator().scene,
  new GovernmentDashboard().scene,
]);

// Services initialization
const gctxService = new GCTXBotService(logger);
const dbService = new DatabaseService();
const securityService = new SecurityService();
const integrationService = new IntegrationService();

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Session middleware
bot.use(session({
  store: {
    get: async (key: string) => {
      try {
        const data = await redis.get(`session:${key}`);
        return data ? JSON.parse(data) : {};
      } catch (error) {
        logger.error('Redis get error:', error);
        return {};
      }
    },
    set: async (key: string, data: any) => {
      try {
        await redis.set(`session:${key}`, JSON.stringify(data), {
          EX: 7 * 24 * 60 * 60 // 7 days
        });
      } catch (error) {
        logger.error('Redis set error:', error);
      }
    },
    delete: async (key: string) => {
      try {
        await redis.del(`session:${key}`);
      } catch (error) {
        logger.error('Redis delete error:', error);
      }
    }
  }
}));

// Stage middleware
bot.use(stage.middleware());

// Security middleware
bot.use(async (ctx, next) => {
  const isSecure = await securityService.validateRequest(ctx);
  if (!isSecure) {
    logger.warn(`Security validation failed for user ${ctx.from?.id}`);
    return ctx.reply('⚠️ Security validation failed. Please try again later.');
  }
  return next();
});

// Logging middleware
bot.use(async (ctx, next) => {
  const start = Date.now();
  logger.info(`Incoming: ${ctx.updateType} from ${ctx.from?.id} (${ctx.from?.username})`);
  
  await next();
  
  const duration = Date.now() - start;
  logger.info(`Processed in ${duration}ms`);
});

// User initialization middleware
bot.use(async (ctx, next) => {
  if (!ctx.session.user && ctx.from) {
    ctx.session.user = {
      id: `tg_${ctx.from.id}`,
      telegramId: ctx.from.id,
    };
    
    // Register or update user in database
    await dbService.upsertUser({
      telegramId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      languageCode: ctx.from.language_code,
      lastSeen: new Date(),
    });
  }
  
  return next();
});

// ============================================================================
// BOT COMMANDS
// ============================================================================

// Start command with dynamic onboarding
bot.start(async (ctx) => {
  const startPayload = ctx.payload;
  
  logger.info(`Start command from ${ctx.from?.username} with payload: ${startPayload}`);
  
  // Check for deep link parameters
  if (startPayload === 'demo') {
    return ctx.scene.enter('demo-orchestrator');
  }
  
  if (startPayload === 'mobile_verified') {
    ctx.session.user!.verificationLevel = 'enhanced';
    return ctx.reply(
      '✅ *Mobile App Integration Verified*\n\n' +
      'Your GeoTag™ or TradePass™ mobile app has been linked successfully.\n\n' +
      'Available commands:\n' +
      '/dashboard - Access your personalized dashboard\n' +
      '/verify - Complete additional verification\n' +
      '/demo - Experience interactive demo\n' +
      '/help - Get assistance',
      { parse_mode: 'Markdown' }
    );
  }
  
  // Welcome message with stakeholder selection
  await ctx.replyWithPhoto(
    { source: './assets/gctx-logo.png' },
    {
      caption: 
        '🟡⚫🔴 *Welcome to GCTX - Ghana Gold Ecosystem*\n\n' +
        '🏆 *Transform Ghana\\'s mining industry with blockchain technology*\n\n' +
        '🎯 I\\'m your intelligent assistant for:\n' +
        '• 🔍 Mine site verification and onboarding\n' +
        '• 💎 Gold trading and market intelligence\n' +
        '• 🏛️ Government compliance and oversight\n' +
        '• 📊 Supply chain transparency\n' +
        '• 🎪 Interactive demonstrations\n\n' +
        'Let\\'s get started! What best describes you?',
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⛏️ Small-Scale Miner', callback_data: 'role_miner' },
            { text: '💰 Gold Trader', callback_data: 'role_trader' }
          ],
          [
            { text: '🏛️ Government Official', callback_data: 'role_inspector' },
            { text: '🌍 International Buyer', callback_data: 'role_buyer' }
          ],
          [
            { text: '🎪 Interactive Demo', callback_data: 'role_demo' },
            { text: '❓ Learn More', callback_data: 'learn_more' }
          ]
        ]
      }
    }
  );
});

// Help command
bot.help(async (ctx) => {
  const userRole = ctx.session.user?.stakeholderType || 'unknown';
  
  const helpText = gctxService.getContextualHelp(userRole);
  
  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📱 Mobile Apps', callback_data: 'help_mobile' },
          { text: '🔧 Technical Support', callback_data: 'help_technical' }
        ],
        [
          { text: '📚 Documentation', url: 'https://docs.gctx.ghana.gov.gh' },
          { text: '🎪 Interactive Demo', callback_data: 'start_demo' }
        ]
      ]
    }
  });
});

// Dashboard command
bot.command('dashboard', async (ctx) => {
  const user = ctx.session.user;
  if (!user?.stakeholderType) {
    return ctx.reply(
      '❓ Please complete onboarding first using /start',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🚀 Start Onboarding', callback_data: 'start_onboarding' }
          ]]
        }
      }
    );
  }
  
  if (user.stakeholderType === 'inspector') {
    return ctx.scene.enter('government-dashboard');
  }
  
  const dashboard = await gctxService.generateDashboard(user);
  
  await ctx.reply(dashboard.text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: dashboard.keyboard
    }
  });
});

// Verification command
bot.command('verify', async (ctx) => {
  return ctx.scene.enter('verification-wizard');
});

// Demo command
bot.command('demo', async (ctx) => {
  return ctx.scene.enter('demo-orchestrator');
});

// Status command
bot.command('status', async (ctx) => {
  const user = ctx.session.user;
  if (!user) {
    return ctx.reply('❓ User session not found. Please /start again.');
  }
  
  const status = await gctxService.getUserStatus(user);
  
  await ctx.reply(
    `📊 *Your GCTX Status*\n\n` +
    `🏷️ **Role**: ${status.role}\n` +
    `✅ **Verification**: ${status.verificationLevel}\n` +
    `📅 **Member Since**: ${status.memberSince}\n` +
    `🔄 **Last Activity**: ${status.lastActivity}\n\n` +
    `📈 **Statistics**:\n` +
    `• Total Interactions: ${status.stats.totalInteractions}\n` +
    `• Successful Verifications: ${status.stats.verifications}\n` +
    `• Demo Completions: ${status.stats.demoCompletions}`,
    { parse_mode: 'Markdown' }
  );
});

// ============================================================================
// CALLBACK HANDLERS
// ============================================================================

// Role selection callbacks
bot.action(/role_(\w+)/, async (ctx) => {
  const role = ctx.match[1] as 'miner' | 'trader' | 'inspector' | 'buyer' | 'demo';
  
  ctx.session.user!.stakeholderType = role;
  
  await ctx.answerCbQuery('Role selected! Starting personalized onboarding...');
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } });
  
  if (role === 'demo') {
    return ctx.scene.enter('demo-orchestrator');
  }
  
  return ctx.scene.enter('stakeholder-onboarding');
});

// Learn more callback
bot.action('learn_more', async (ctx) => {
  await ctx.answerCbQuery();
  
  await ctx.editMessageText(
    '📚 *About GCTX - Ghana Gold Ecosystem*\n\n' +
    '🎯 **Mission**: Transform Ghana\\'s artisanal mining sector through blockchain technology and digital verification.\n\n' +
    '🔧 **Core Technology**:\n' +
    '• 📱 GeoTag™ - GPS-verified mining registration\n' +
    '• 💎 TradePass™ - Secure gold trading platform\n' +
    '• 🏛️ Government oversight dashboard\n' +
    '• 🔐 Military-grade cryptographic verification\n\n' +
    '🌍 **Impact**:\n' +
    '• ✅ 100% traceable gold supply chain\n' +
    '• 💰 Fair pricing for small-scale miners\n' +
    '• 🏛️ Enhanced government revenue collection\n' +
    '• 🌱 Environmental compliance monitoring\n\n' +
    '🚀 Ready to be part of Ghana\\'s mining revolution?',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '⛏️ Join as Miner', callback_data: 'role_miner' },
            { text: '💰 Join as Trader', callback_data: 'role_trader' }
          ],
          [
            { text: '🏛️ Government Access', callback_data: 'role_inspector' },
            { text: '🎪 Try Demo First', callback_data: 'role_demo' }
          ],
          [
            { text: '🔙 Back to Start', callback_data: 'back_to_start' }
          ]
        ]
      }
    }
  );
});

// Back to start callback
bot.action('back_to_start', async (ctx) => {
  await ctx.answerCbQuery();
  
  // Reset session
  ctx.session.user = {
    id: `tg_${ctx.from.id}`,
    telegramId: ctx.from.id,
  };
  
  // Restart the bot
  return bot.handleUpdate({
    ...ctx.update,
    message: {
      ...ctx.update.callback_query?.message,
      text: '/start',
      entities: [{ type: 'bot_command', offset: 0, length: 6 }]
    }
  } as any);
});

// Generic help callbacks
bot.action('help_mobile', async (ctx) => {
  await ctx.answerCbQuery();
  
  await ctx.reply(
    '📱 *Mobile Applications*\n\n' +
    '🔍 **GeoTag™** - Mining Discovery & Registration\n' +
    '• GPS-verified location tracking\n' +
    '• Photo evidence capture\n' +
    '• Government compliance automation\n' +
    '• Digital certificate generation\n\n' +
    '💎 **TradePass™** - Gold Trading Platform\n' +
    '• Real-time market pricing\n' +
    '• Verified supplier network\n' +
    '• Automated compliance reporting\n' +
    '• Supply chain transparency\n\n' +
    '📲 **Download Links**:\n' +
    '• Android: [Google Play Store](https://play.google.com/store/apps/geotag)\n' +
    '• iOS: [App Store](https://apps.apple.com/app/geotag)\n\n' +
    '🔗 **Integration**: Use /link to connect your mobile app with this bot.',
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔗 Link Mobile App', callback_data: 'link_mobile' }]
        ]
      }
    }
  );
});

bot.action('help_technical', async (ctx) => {
  await ctx.answerCbQuery();
  
  await ctx.reply(
    '🔧 *Technical Support*\n\n' +
    '📞 **Contact Methods**:\n' +
    '• Email: support@gctx.ghana.gov.gh\n' +
    '• Phone: +233 30 123 4567\n' +
    '• WhatsApp: +233 20 987 6543\n\n' +
    '🕐 **Support Hours**:\n' +
    '• Monday - Friday: 8:00 AM - 6:00 PM GMT\n' +
    '• Saturday: 9:00 AM - 2:00 PM GMT\n' +
    '• Emergency: 24/7 for critical issues\n\n' +
    '🌐 **Self-Service**:\n' +
    '• Documentation: [docs.gctx.ghana.gov.gh](https://docs.gctx.ghana.gov.gh)\n' +
    '• FAQ: /faq\n' +
    '• Video Tutorials: /tutorials\n\n' +
    '🆘 **Emergency Support**: For critical mining safety issues, contact Ghana Minerals Commission directly at +233 30 664 2022',
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '❓ FAQ', callback_data: 'show_faq' },
            { text: '🎥 Tutorials', callback_data: 'show_tutorials' }
          ]
        ]
      }
    }
  );
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

bot.catch((err, ctx) => {
  logger.error('Bot error:', err);
  
  ctx.reply(
    '❌ An unexpected error occurred. Our team has been notified.\n\n' +
    'Please try again in a moment, or contact support if the issue persists.\n\n' +
    '📧 support@gctx.ghana.gov.gh',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔄 Try Again', callback_data: 'back_to_start' }]
        ]
      }
    }
  );
});

// ============================================================================
// STARTUP AND GRACEFUL SHUTDOWN
// ============================================================================

async function startup() {
  try {
    // Initialize Redis connection
    await redis.connect();
    logger.info('Redis connected successfully');
    
    // Initialize database connection
    await dbService.initialize();
    logger.info('Database connected successfully');
    
    // Start the bot
    await bot.launch();
    logger.info('GCTX Telegram Bot started successfully! 🚀');
    
    // Set bot commands for menu
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🚀 Begin GCTX onboarding journey' },
      { command: 'dashboard', description: '📊 Access your personalized dashboard' },
      { command: 'verify', description: '✅ Complete verification process' },
      { command: 'demo', description: '🎪 Experience interactive demo' },
      { command: 'status', description: '📈 Check your account status' },
      { command: 'help', description: '❓ Get help and support' }
    ]);
    
    logger.info('Bot commands menu set successfully');
    
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.once('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  
  try {
    await bot.stop('SIGINT');
    await redis.disconnect();
    await dbService.close();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.once('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  
  try {
    await bot.stop('SIGTERM');
    await redis.disconnect();
    await dbService.close();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the bot
startup();

export { bot, GCTXContext };