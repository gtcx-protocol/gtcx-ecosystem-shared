/**
 * GTCX Ecosystem Integration Example
 * 
 * This example demonstrates how to use TradeDesk with GTCX ecosystem
 * services like AI, compliance, and security.
 */

import { SimpleTradeDesk } from '../src/core/simple-tradedesk';
import { GTCXConfig } from '../src/integration/gtcx-ecosystem';

/**
 * Example of integrating TradeDesk with GTCX ecosystem services
 */
export async function gtcxEcosystemIntegrationExample(): Promise<void> {
  console.log('🚀 GTCX Ecosystem Integration Example\n');

  // Configure GTCX ecosystem integration
  const gtcxConfig: GTCXConfig = {
    ai: {
      enabled: true,
      endpoint: 'https://ai.gtcx.io',
      apiKey: 'your-ai-api-key'
    },
    compliance: {
      enabled: true,
      endpoint: 'https://compliance.gtcx.io',
      apiKey: 'your-compliance-api-key'
    },
    security: {
      enabled: true,
      endpoint: 'https://security.gTCX.io',
      apiKey: 'your-security-api-key'
    },
    globalSouth: {
      offlineMode: true,
      lowBandwidth: true,
      localCaching: true
    }
  };

  // Create TradeDesk with GTCX integration
  const tradeDesk = new SimpleTradeDesk(gtcxConfig);
  
  try {
    // Initialize the trading desk
    console.log('📡 Initializing TradeDesk with GTCX ecosystem...');
    await tradeDesk.initialize();
    
    // Check GTCX ecosystem status
    const gtcxStatus = tradeDesk.getGTCXStatus();
    console.log('🔗 GTCX Ecosystem Status:', gtcxStatus);
    
    // Create a user
    const userId = 'user-123';
    await tradeDesk.createUser(userId, 'John Doe', 'john@example.com');
    console.log('👤 User created:', userId);
    
    // Place some orders
    const order1 = await tradeDesk.placeOrder(userId, 'GOLD', 'buy', 100, 1950.50);
    const order2 = await tradeDesk.placeOrder(userId, 'SILVER', 'buy', 500, 24.75);
    console.log('📊 Orders placed:', { order1: order1.id, order2: order2.id });
    
    // Execute trades
    await tradeDesk.executeTrade(order1.id, 1950.50);
    await tradeDesk.executeTrade(order2.id, 24.75);
    console.log('✅ Trades executed');
    
    // Get portfolio
    const portfolio = tradeDesk.getPortfolio(userId);
    console.log('💼 Portfolio:', portfolio);
    
    // Use GTCX AI services
    console.log('\n🤖 Using GTCX AI Services...');
    
    // AI Risk Assessment
    const aiRisk = await tradeDesk.getAIRiskAssessment(userId);
    if (aiRisk) {
      console.log('📊 AI Risk Assessment:', {
        riskScore: aiRisk.riskScore,
        confidence: aiRisk.confidence,
        recommendations: aiRisk.recommendations
      });
    }
    
    // AI Trade Recommendations
    const aiRecommendations = await tradeDesk.getAITradeRecommendations(userId);
    if (aiRecommendations) {
      console.log('💡 AI Trade Recommendations:', aiRecommendations);
    }
    
    // Use GTCX Compliance Services
    console.log('\n🛡️ Using GTCX Compliance Services...');
    
    const compliance = await tradeDesk.performGuardianCompliance(userId);
    if (compliance) {
      console.log('✅ Compliance Check:', {
        compliant: compliance.compliant,
        checks: compliance.checks,
        warnings: compliance.warnings
      });
    }
    
    // Use GTCX Security Services
    console.log('\n🔐 Using GTCX Security Services...');
    
    const security = await tradeDesk.getSecurityStatus(userId);
    if (security) {
      console.log('🔒 Security Status:', {
        authenticated: security.authenticated,
        permissions: security.permissions,
        riskLevel: security.riskLevel
      });
    }
    
    // Check if GTCX features are available
    const isGTCXAvailable = tradeDesk.isGTCXAvailable();
    console.log('\n🌐 GTCX Features Available:', isGTCXAvailable);
    
    // Get comprehensive GTCX status
    const finalGTCXStatus = tradeDesk.getGTCXStatus();
    console.log('📋 Final GTCX Status:', finalGTCXStatus);
    
    console.log('\n🎉 GTCX Ecosystem Integration Example Completed!');
    
  } catch (error) {
    console.error('❌ Error in GTCX ecosystem integration:', error);
  }
}

/**
 * Example of progressive GTCX feature enhancement
 */
export async function progressiveGTCXEnhancementExample(): Promise<void> {
  console.log('\n🔄 Progressive GTCX Enhancement Example\n');
  
  // Phase 1: Basic TradeDesk without GTCX
  console.log('📱 Phase 1: Basic TradeDesk (No GTCX)');
  const basicTradeDesk = new SimpleTradeDesk();
  await basicTradeDesk.initialize();
  console.log('✅ Basic TradeDesk initialized');
  
  // Phase 2: Add GTCX AI services
  console.log('\n🤖 Phase 2: Adding GTCX AI Services');
  const aiConfig: GTCXConfig = {
    ai: { enabled: true },
    compliance: { enabled: false },
    security: { enabled: false }
  };
  const aiTradeDesk = new SimpleTradeDesk(aiConfig);
  await aiTradeDesk.initialize();
  console.log('✅ TradeDesk with AI services initialized');
  
  // Phase 3: Add GTCX compliance
  console.log('\n🛡️ Phase 3: Adding GTCX Compliance');
  const complianceConfig: GTCXConfig = {
    ai: { enabled: true },
    compliance: { enabled: true },
    security: { enabled: false }
  };
  const complianceTradeDesk = new SimpleTradeDesk(complianceConfig);
  await aiTradeDesk.initialize();
  console.log('✅ TradeDesk with AI + Compliance initialized');
  
  // Phase 4: Full GTCX integration
  console.log('\n🌐 Phase 4: Full GTCX Integration');
  const fullConfig: GTCXConfig = {
    ai: { enabled: true },
    compliance: { enabled: true },
    security: { enabled: true },
    globalSouth: {
      offlineMode: true,
      lowBandwidth: true,
      localCaching: true
    }
  };
  const fullTradeDesk = new SimpleTradeDesk(fullConfig);
  await fullTradeDesk.initialize();
  console.log('✅ TradeDesk with full GTCX integration initialized');
  
  // Show the progression
  console.log('\n📈 Progressive Enhancement Summary:');
  console.log('Phase 1: Basic trading ✅');
  console.log('Phase 2: + AI services ✅');
  console.log('Phase 3: + Compliance ✅');
  console.log('Phase 4: + Security + Global South ✅');
  
  console.log('\n🎯 This demonstrates how TradeDesk can be progressively enhanced');
  console.log('   with GTCX ecosystem services as your needs grow!');
}

// Export the examples
export { gtcxEcosystemIntegrationExample, progressiveGTCXEnhancementExample };
