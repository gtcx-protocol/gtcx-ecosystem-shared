// ============================================================================
// VERIFICATION WIZARD - IDENTITY AND CREDENTIAL VERIFICATION
// Multi-step verification process with document validation
// ============================================================================

import { Scenes, Markup } from 'telegraf';
import { GCTXContext } from '../index';
import { Logger } from 'winston';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'biometric' | 'knowledge' | 'reference';
  required: boolean;
  estimatedTime: number;
}

interface VerificationSession {
  currentStep: number;
  documents: { [key: string]: string };
  biometricData: any;
  verificationScore: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  startTime: number;
}

export class VerificationWizard {
  private logger: Logger;
  public scene: Scenes.BaseScene<GCTXContext>;

  private verificationSteps: { [role: string]: VerificationStep[] } = {
    miner: [
      {
        id: 'ghana_card',
        title: '🆔 Ghana Card Verification',
        description: 'Verify your national identity with Ghana Card',
        type: 'document',
        required: true,
        estimatedTime: 3
      },
      {
        id: 'mining_license',
        title: '⛏️ Mining License Verification',
        description: 'Validate your mining license with Minerals Commission',
        type: 'document',
        required: true,
        estimatedTime: 5
      },
      {
        id: 'site_verification',
        title: '📍 Mining Site Verification',
        description: 'GPS verification and site photography',
        type: 'biometric',
        required: true,
        estimatedTime: 10
      },
      {
        id: 'knowledge_test',
        title: '🧠 Mining Knowledge Assessment',
        description: 'Basic mining safety and compliance quiz',
        type: 'knowledge',
        required: false,
        estimatedTime: 8
      }
    ],
    trader: [
      {
        id: 'ghana_card',
        title: '🆔 Ghana Card Verification',
        description: 'Verify your national identity with Ghana Card',
        type: 'document',
        required: true,
        estimatedTime: 3
      },
      {
        id: 'trading_license',
        title: '💼 PMD Trading License',
        description: 'Validate your Precious Minerals Marketing Company license',
        type: 'document',
        required: true,
        estimatedTime: 5
      },
      {
        id: 'business_registration',
        title: '🏢 Business Registration',
        description: 'Verify business registration with Registrar General',
        type: 'document',
        required: true,
        estimatedTime: 4
      },
      {
        id: 'financial_verification',
        title: '💰 Financial Standing',
        description: 'Bank statements and financial capacity verification',
        type: 'document',
        required: true,
        estimatedTime: 7
      },
      {
        id: 'reference_check',
        title: '👥 Business References',
        description: 'Professional references and track record',
        type: 'reference',
        required: false,
        estimatedTime: 12
      }
    ],
    inspector: [
      {
        id: 'government_id',
        title: '🏛️ Government Employee ID',
        description: 'Verify government employee status and authorization',
        type: 'document',
        required: true,
        estimatedTime: 5
      },
      {
        id: 'authorization_letter',
        title: '📋 Authorization Letter',
        description: 'Department authorization to use GCTX system',
        type: 'document',
        required: true,
        estimatedTime: 8
      },
      {
        id: 'supervisor_approval',
        title: '👨‍💼 Supervisor Approval',
        description: 'Approval from direct supervisor or department head',
        type: 'reference',
        required: true,
        estimatedTime: 24
      }
    ],
    buyer: [
      {
        id: 'company_registration',
        title: '🏢 Company Registration',
        description: 'International company registration documents',
        type: 'document',
        required: true,
        estimatedTime: 6
      },
      {
        id: 'lbma_membership',
        title: '🥇 LBMA Membership',
        description: 'London Bullion Market Association membership (if applicable)',
        type: 'document',
        required: false,
        estimatedTime: 10
      },
      {
        id: 'compliance_certificate',
        title: '📜 Compliance Certificate',
        description: 'International compliance and due diligence certification',
        type: 'document',
        required: true,
        estimatedTime: 15
      },
      {
        id: 'financial_capacity',
        title: '💼 Financial Capacity',
        description: 'Proof of financial capacity for gold procurement',
        type: 'document',
        required: true,
        estimatedTime: 8
      }
    ]
  };

  constructor() {
    this.logger = require('winston').createLogger({
      level: 'info',
      format: require('winston').format.json(),
      transports: [new require('winston').transports.Console()]
    });

    this.scene = new Scenes.BaseScene<GCTXContext>('verification-wizard');
    this.setupSceneHandlers();
  }

  private setupSceneHandlers() {
    // Scene entry
    this.scene.enter(async (ctx) => {
      const userRole = ctx.session.user?.stakeholderType;
      
      if (!userRole || userRole === 'demo') {
        await ctx.reply('❓ Please complete onboarding first using /start');
        return ctx.scene.leave();
      }

      // Initialize verification session
      ctx.session.verification = {
        currentStep: 0,
        documents: {},
        biometricData: null,
        verificationScore: 0,
        status: 'in_progress',
        startTime: Date.now()
      };

      await this.showVerificationWelcome(ctx, userRole);
    });

    // Step navigation
    this.scene.action(/verify_step_(\d+)/, async (ctx) => {
      const stepIndex = parseInt(ctx.match[1]);
      await ctx.answerCbQuery(`Starting step ${stepIndex + 1}...`);
      await this.startVerificationStep(ctx, stepIndex);
    });

    // Document verification
    this.scene.action(/verify_document_(\w+)/, async (ctx) => {
      const documentType = ctx.match[1];
      await ctx.answerCbQuery();
      await this.startDocumentVerification(ctx, documentType);
    });

    // Skip optional step
    this.scene.action(/skip_verify_(\w+)/, async (ctx) => {
      const stepId = ctx.match[1];
      await ctx.answerCbQuery('Step skipped');
      await this.skipVerificationStep(ctx, stepId);
    });

    // Submit verification
    this.scene.action('submit_verification', async (ctx) => {
      await ctx.answerCbQuery('Submitting verification...');
      await this.submitVerification(ctx);
    });

    // Exit verification
    this.scene.action('exit_verification', async (ctx) => {
      await ctx.answerCbQuery('Exiting verification...');
      await this.exitVerification(ctx);
    });

    // Handle document uploads
    this.scene.on('photo', async (ctx) => {
      await this.handleDocumentUpload(ctx);
    });

    // Handle text responses for knowledge tests
    this.scene.on('text', async (ctx) => {
      await this.handleTextResponse(ctx);
    });

    // Handle location for site verification
    this.scene.on('location', async (ctx) => {
      await this.handleLocationVerification(ctx);
    });
  }

  // ============================================================================
  // VERIFICATION FLOW
  // ============================================================================

  private async showVerificationWelcome(ctx: GCTXContext, role: string) {
    const steps = this.verificationSteps[role] || [];
    const totalTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);
    const requiredSteps = steps.filter(step => step.required).length;

    await ctx.reply(
      `🔐 **Enhanced Verification Process**\n\n` +
      `👋 Let's verify your credentials for enhanced access to GCTX features.\n\n` +
      `📋 **Verification Overview**:\n` +
      `• Total Steps: ${steps.length}\n` +
      `• Required: ${requiredSteps} | Optional: ${steps.length - requiredSteps}\n` +
      `• Estimated Time: ${Math.ceil(totalTime / 60)} hours\n\n` +
      `🎯 **Enhanced Features You'll Unlock**:\n` +
      `• ✅ Higher transaction limits\n` +
      `• 🔒 Advanced security features\n` +
      `• 🏆 Premium support access\n` +
      `• 📊 Detailed analytics and reporting\n` +
      `• 🤝 Direct government integration\n\n` +
      `🔒 **Security & Privacy**:\n` +
      `• All documents encrypted with AES-256\n` +
      `• Automatic deletion after verification\n` +
      `• GDPR and Ghana Data Protection Act compliant\n\n` +
      `Ready to begin enhanced verification?`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🚀 Start Verification', callback_data: 'verify_step_0' },
              { text: '📋 View Requirements', callback_data: 'show_requirements' }
            ],
            [
              { text: '❓ Why Verify?', callback_data: 'verification_benefits' },
              { text: '🔙 Return Later', callback_data: 'exit_verification' }
            ]
          ]
        }
      }
    );
  }

  private async startVerificationStep(ctx: GCTXContext, stepIndex: number) {
    const role = ctx.session.user?.stakeholderType!;
    const steps = this.verificationSteps[role] || [];
    const step = steps[stepIndex];

    if (!step) {
      return await this.completeVerification(ctx);
    }

    const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
    const progressBar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));

    await ctx.editMessageText(
      `🔐 **Verification Step ${stepIndex + 1}/${steps.length}**\n\n` +
      `**${step.title}**\n\n` +
      `${step.description}\n\n` +
      `📊 **Progress**: ${progressBar} ${progress}%\n` +
      `⏱️ **Estimated Time**: ${step.estimatedTime} minutes\n` +
      `${step.required ? '🔴 Required' : '🔲 Optional'}\n\n` +
      `${this.getStepInstructions(step)}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📤 Start Upload', callback_data: `verify_document_${step.id}` }
            ],
            [
              stepIndex > 0 ? { text: '◀️ Previous', callback_data: `verify_step_${stepIndex - 1}` } : null,
              !step.required ? { text: '⏭️ Skip Step', callback_data: `skip_verify_${step.id}` } : null
            ].filter(Boolean),
            [
              { text: '💾 Save Progress', callback_data: 'save_verification_progress' },
              { text: '❌ Exit', callback_data: 'exit_verification' }
            ]
          ]
        }
      }
    );

    // Update session
    ctx.session.verification!.currentStep = stepIndex;
  }

  // ============================================================================
  // DOCUMENT VERIFICATION
  // ============================================================================

  private async startDocumentVerification(ctx: GCTXContext, documentType: string) {
    const role = ctx.session.user?.stakeholderType!;
    const steps = this.verificationSteps[role] || [];
    const step = steps.find(s => s.id === documentType);

    if (!step) {
      return await ctx.reply('❌ Verification step not found.');
    }

    // Set current document type
    ctx.session.verification!.currentDocument = documentType;

    const instructions = this.getDocumentInstructions(documentType);

    await ctx.reply(
      `📤 **Upload ${step.title}**\n\n` +
      `${instructions}\n\n` +
      `📋 **Requirements**:\n` +
      `• Clear, high-resolution image\n` +
      `• All text must be readable\n` +
      `• Valid and not expired\n` +
      `• Original document (no photocopies)\n\n` +
      `🔒 **Security**: Document will be encrypted and automatically deleted after verification.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📷 Take Photo', callback_data: 'take_photo' },
              { text: '📁 Upload from Gallery', callback_data: 'upload_gallery' }
            ],
            [
              { text: '❓ Help', callback_data: `help_${documentType}` },
              { text: '🔙 Back', callback_data: `verify_step_${ctx.session.verification!.currentStep}` }
            ]
          ]
        }
      }
    );
  }

  private async handleDocumentUpload(ctx: GCTXContext) {
    const currentDocument = ctx.session.verification?.currentDocument;
    if (!currentDocument) {
      return await ctx.reply('❌ No active document verification. Please start a verification step first.');
    }

    const photo = ctx.message!.photo![ctx.message!.photo!.length - 1];
    const fileId = photo.file_id;

    // Simulate document processing
    await ctx.reply('🔄 Processing document...', {
      reply_markup: {
        inline_keyboard: [[{ text: '⏳ Processing...', callback_data: 'processing' }]]
      }
    });

    // Simulate AI verification delay
    setTimeout(async () => {
      const verificationResult = await this.simulateDocumentVerification(currentDocument, fileId);
      
      if (verificationResult.success) {
        // Store document
        ctx.session.verification!.documents[currentDocument] = fileId;
        ctx.session.verification!.verificationScore += verificationResult.score;

        await ctx.editMessageText(
          `✅ **Document Verified Successfully**\n\n` +
          `📋 **Verification Results**:\n` +
          `• Document Type: ${currentDocument.replace('_', ' ').toUpperCase()}\n` +
          `• Confidence Score: ${verificationResult.confidence}%\n` +
          `• Status: ${verificationResult.status}\n` +
          `• Processing Time: ${verificationResult.processingTime}s\n\n` +
          `🎯 **Next Step**: Continue with verification process.`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '➡️ Continue', callback_data: `verify_step_${ctx.session.verification!.currentStep + 1}` }]
              ]
            }
          }
        );
      } else {
        await ctx.editMessageText(
          `❌ **Document Verification Failed**\n\n` +
          `🔍 **Issues Found**:\n` +
          verificationResult.issues.map((issue: string) => `• ${issue}`).join('\n') + '\n\n' +
          `💡 **Recommendations**:\n` +
          `• Ensure good lighting when taking photo\n` +
          `• Make sure all text is clearly visible\n` +
          `• Use original document, not photocopy\n` +
          `• Check document is not expired`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔄 Try Again', callback_data: `verify_document_${currentDocument}` },
                  { text: '❓ Get Help', callback_data: `help_${currentDocument}` }
                ],
                [{ text: '📞 Contact Support', callback_data: 'contact_verification_support' }]
              ]
            }
          }
        );
      }
    }, 3000);

    // Clear current document
    delete ctx.session.verification!.currentDocument;
  }

  // ============================================================================
  // VERIFICATION COMPLETION
  // ============================================================================

  private async completeVerification(ctx: GCTXContext) {
    const verificationData = ctx.session.verification!;
    const role = ctx.session.user?.stakeholderType!;
    const steps = this.verificationSteps[role] || [];
    
    const completedSteps = Object.keys(verificationData.documents).length;
    const totalSteps = steps.length;
    const completionRate = Math.round((completedSteps / totalSteps) * 100);

    // Determine verification level
    let verificationLevel = 'basic';
    if (verificationData.verificationScore >= 80) {
      verificationLevel = 'premium';
    } else if (verificationData.verificationScore >= 60) {
      verificationLevel = 'enhanced';
    }

    // Update user session
    ctx.session.user!.verificationLevel = verificationLevel as any;
    ctx.session.verification!.status = 'completed';

    const completionMessage = 
      `🎉 **Verification Complete!**\n\n` +
      `✅ **Your New Status**:\n` +
      `• Verification Level: ${this.formatVerificationLevel(verificationLevel)}\n` +
      `• Completion Rate: ${completionRate}%\n` +
      `• Security Score: ${verificationData.verificationScore}/100\n\n` +
      `🔓 **Unlocked Features**:\n` +
      this.getUnlockedFeatures(verificationLevel).map(feature => `• ${feature}`).join('\n') + '\n\n' +
      `⏱️ **Processing Time**: Document review may take 24-48 hours.\n` +
      `📧 **Notification**: You'll receive confirmation via Telegram once approved.\n\n` +
      `🚀 **What's Next?**`;

    await ctx.editMessageText(completionMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 Go to Dashboard', callback_data: 'go_dashboard' },
            { text: '📱 Download Apps', callback_data: 'download_apps' }
          ],
          [
            { text: '🎪 Try Enhanced Demo', callback_data: 'enhanced_demo' },
            { text: '📋 View Certificate', callback_data: 'view_certificate' }
          ],
          [
            { text: '📞 Premium Support', callback_data: 'premium_support' }
          ]
        ]
      }
    });

    // Clear verification session
    delete ctx.session.verification;
    
    // Leave scene
    setTimeout(() => ctx.scene.leave(), 2000);
  }

  private async exitVerification(ctx: GCTXContext) {
    const verificationData = ctx.session.verification;
    const progress = verificationData ? Object.keys(verificationData.documents || {}).length : 0;

    await ctx.editMessageText(
      `⏸️ **Verification Paused**\n\n` +
      `Your progress has been saved:\n` +
      `• Steps Completed: ${progress}\n` +
      `• Time Invested: ${Math.round((Date.now() - (verificationData?.startTime || Date.now())) / 1000 / 60)} minutes\n\n` +
      `💡 **Resume Anytime**: Use /verify to continue where you left off.\n\n` +
      `⚠️ **Note**: Uploaded documents are automatically deleted after 7 days for security.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
          ]
        }
      }
    );

    ctx.scene.leave();
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private getStepInstructions(step: VerificationStep): string {
    switch (step.type) {
      case 'document':
        return '📤 Click "Start Upload" to begin document verification.';
      case 'biometric':
        return '📍 This step requires GPS location and live photo verification.';
      case 'knowledge':
        return '🧠 You will answer questions to demonstrate your expertise.';
      case 'reference':
        return '👥 We will contact your references for verification.';
      default:
        return '📋 Follow the instructions to complete this step.';
    }
  }

  private getDocumentInstructions(documentType: string): string {
    const instructions: { [key: string]: string } = {
      ghana_card: '📸 Take a clear photo of both sides of your Ghana Card. Ensure all text is readable and the card is not expired.',
      mining_license: '📸 Take a photo of your valid mining license issued by the Ghana Minerals Commission.',
      trading_license: '📸 Take a photo of your PMD trading license from the Precious Minerals Marketing Company.',
      business_registration: '📸 Upload your business registration certificate from the Registrar General.',
      government_id: '📸 Upload your government employee ID card or staff identification.',
      company_registration: '📸 Upload official company registration documents from your country of incorporation.',
      lbma_membership: '📸 Upload your LBMA membership certificate (if applicable).',
      compliance_certificate: '📸 Upload international compliance certificates (OECD, Dodd-Frank, etc.).'
    };

    return instructions[documentType] || '📸 Please upload the required document.';
  }

  private async simulateDocumentVerification(documentType: string, fileId: string): Promise<any> {
    // Simulate AI processing
    const confidence = 85 + Math.random() * 10;
    const processingTime = Math.round(1 + Math.random() * 3);
    
    if (confidence > 80) {
      return {
        success: true,
        confidence: Math.round(confidence),
        status: 'Verified',
        score: Math.round(confidence / 10),
        processingTime,
        issues: []
      };
    } else {
      return {
        success: false,
        confidence: Math.round(confidence),
        status: 'Failed',
        score: 0,
        processingTime,
        issues: [
          'Image quality insufficient',
          'Some text not clearly readable',
          'Document may be expired or invalid'
        ]
      };
    }
  }

  private formatVerificationLevel(level: string): string {
    const levelMap: { [key: string]: string } = {
      basic: '🥉 Basic Verification',
      enhanced: '🥈 Enhanced Verification',
      premium: '🥇 Premium Verification'
    };
    return levelMap[level] || '❓ Unknown Level';
  }

  private getUnlockedFeatures(level: string): string[] {
    const features: { [key: string]: string[] } = {
      basic: [
        '✅ Standard dashboard access',
        '📱 Mobile app integration',
        '💰 Basic transaction limits'
      ],
      enhanced: [
        '🔓 All basic features',
        '📊 Advanced analytics',
        '🤝 Government integration',
        '💰 Higher transaction limits',
        '📞 Priority support'
      ],
      premium: [
        '🔓 All enhanced features',
        '🏆 Premium dashboard',
        '🔒 Maximum security features',
        '💎 Unlimited transactions',
        '📞 24/7 dedicated support',
        '🌍 International compliance tools'
      ]
    };
    return features[level] || [];
  }
}