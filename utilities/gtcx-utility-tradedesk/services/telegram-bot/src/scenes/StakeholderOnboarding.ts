// ============================================================================
// STAKEHOLDER ONBOARDING - ROLE-SPECIFIC USER REGISTRATION
// Comprehensive verification and setup workflow
// ============================================================================

import { Scenes, Markup } from 'telegraf';
import { GCTXContext } from '../index';
import { Logger } from 'winston';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  fields: OnboardingField[];
}

interface OnboardingField {
  key: string;
  label: string;
  type: 'text' | 'phone' | 'email' | 'file' | 'location' | 'select';
  required: boolean;
  options?: string[];
  validation?: RegExp;
}

interface OnboardingData {
  personalInfo: any;
  verification: any;
  businessInfo: any;
  preferences: any;
}

export class StakeholderOnboarding {
  private logger: Logger;
  public scene: Scenes.BaseScene<GCTXContext>;

  private onboardingSteps: { [role: string]: OnboardingStep[] } = {
    miner: [
      {
        id: 'personal_info',
        title: '👤 Personal Information',
        description: 'Basic identity and contact details',
        required: true,
        fields: [
          { key: 'fullName', label: 'Full Name', type: 'text', required: true },
          { key: 'ghanaCardId', label: 'Ghana Card ID', type: 'text', required: true, validation: /^GHA-\d{9}-\d$/ },
          { key: 'phoneNumber', label: 'Phone Number', type: 'phone', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: false },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'text', required: true }
        ]
      },
      {
        id: 'mining_info',
        title: '⛏️ Mining Operations',
        description: 'Details about your mining activities',
        required: true,
        fields: [
          { key: 'miningLicense', label: 'Mining License Number', type: 'text', required: true },
          { key: 'miningDistrict', label: 'Mining District', type: 'select', required: true, options: ['Obuasi', 'Tarkwa', 'Prestea', 'Bibiani', 'Konongo', 'Other'] },
          { key: 'yearsExperience', label: 'Years of Mining Experience', type: 'text', required: true },
          { key: 'estimatedMonthlyProduction', label: 'Monthly Production (grams)', type: 'text', required: true }
        ]
      },
      {
        id: 'verification_docs',
        title: '📋 Document Verification',
        description: 'Upload required documentation',
        required: true,
        fields: [
          { key: 'ghanaCardPhoto', label: 'Ghana Card Photo', type: 'file', required: true },
          { key: 'miningLicensePhoto', label: 'Mining License Photo', type: 'file', required: true },
          { key: 'sitePhoto', label: 'Mining Site Photo', type: 'file', required: true },
          { key: 'gpsLocation', label: 'Site GPS Coordinates', type: 'location', required: true }
        ]
      }
    ],
    trader: [
      {
        id: 'personal_info',
        title: '👤 Personal Information',
        description: 'Basic identity and contact details',
        required: true,
        fields: [
          { key: 'fullName', label: 'Full Name', type: 'text', required: true },
          { key: 'ghanaCardId', label: 'Ghana Card ID', type: 'text', required: true, validation: /^GHA-\d{9}-\d$/ },
          { key: 'phoneNumber', label: 'Phone Number', type: 'phone', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: true }
        ]
      },
      {
        id: 'business_info',
        title: '💼 Business Information',
        description: 'Trading business details and licensing',
        required: true,
        fields: [
          { key: 'businessName', label: 'Business Name', type: 'text', required: true },
          { key: 'tradingLicense', label: 'PMD Trading License', type: 'text', required: true },
          { key: 'tinNumber', label: 'TIN Number', type: 'text', required: true },
          { key: 'businessAddress', label: 'Business Address', type: 'text', required: true }
        ]
      },
      {
        id: 'verification_docs',
        title: '📋 Document Verification',
        description: 'Upload required business documentation',
        required: true,
        fields: [
          { key: 'ghanaCardPhoto', label: 'Ghana Card Photo', type: 'file', required: true },
          { key: 'tradingLicensePhoto', label: 'Trading License Photo', type: 'file', required: true },
          { key: 'businessCertificate', label: 'Business Registration Certificate', type: 'file', required: true },
          { key: 'bankStatement', label: 'Bank Statement (Last 3 months)', type: 'file', required: true }
        ]
      }
    ],
    inspector: [
      {
        id: 'personal_info',
        title: '👤 Personal Information',
        description: 'Government official identity verification',
        required: true,
        fields: [
          { key: 'fullName', label: 'Full Name', type: 'text', required: true },
          { key: 'staffId', label: 'Staff ID Number', type: 'text', required: true },
          { key: 'department', label: 'Department/Ministry', type: 'select', required: true, options: ['Minerals Commission', 'EPA', 'Internal Revenue Service', 'Ghana Police', 'District Assembly', 'Other'] },
          { key: 'position', label: 'Position/Rank', type: 'text', required: true },
          { key: 'phoneNumber', label: 'Official Phone Number', type: 'phone', required: true },
          { key: 'email', label: 'Official Email', type: 'email', required: true }
        ]
      },
      {
        id: 'authorization',
        title: '🏛️ Authorization Verification',
        description: 'Verify government authorization and access level',
        required: true,
        fields: [
          { key: 'authorizationLevel', label: 'Authorization Level', type: 'select', required: true, options: ['District', 'Regional', 'National', 'Special Operations'] },
          { key: 'jurisdictionArea', label: 'Jurisdiction Area', type: 'text', required: true },
          { key: 'supervisorContact', label: 'Supervisor Contact', type: 'text', required: true }
        ]
      }
    ],
    buyer: [
      {
        id: 'company_info',
        title: '🏢 Company Information',
        description: 'International buyer company details',
        required: true,
        fields: [
          { key: 'companyName', label: 'Company Name', type: 'text', required: true },
          { key: 'country', label: 'Country of Operation', type: 'text', required: true },
          { key: 'registrationNumber', label: 'Company Registration Number', type: 'text', required: true },
          { key: 'lbmaMembership', label: 'LBMA Membership Number', type: 'text', required: false }
        ]
      },
      {
        id: 'representative_info',
        title: '👤 Representative Information',
        description: 'Primary contact person details',
        required: true,
        fields: [
          { key: 'representativeName', label: 'Representative Name', type: 'text', required: true },
          { key: 'position', label: 'Position/Title', type: 'text', required: true },
          { key: 'phoneNumber', label: 'Phone Number', type: 'phone', required: true },
          { key: 'email', label: 'Email Address', type: 'email', required: true }
        ]
      },
      {
        id: 'compliance_info',
        title: '📋 Compliance Information',
        description: 'International compliance and due diligence',
        required: true,
        fields: [
          { key: 'complianceFramework', label: 'Compliance Framework', type: 'select', required: true, options: ['LBMA', 'OECD', 'Dodd-Frank', 'EU Conflict Minerals', 'Other'] },
          { key: 'volumeRequirement', label: 'Monthly Volume Requirement (kg)', type: 'text', required: true },
          { key: 'qualityRequirement', label: 'Gold Quality Requirement', type: 'select', required: true, options: ['22K+', '18K+', '14K+', 'Any Grade'] }
        ]
      }
    ]
  };

  constructor() {
    this.logger = require('winston').createLogger({
      level: 'info',
      format: require('winston').format.json(),
      transports: [new require('winston').transports.Console()]
    });

    this.scene = new Scenes.BaseScene<GCTXContext>('stakeholder-onboarding');
    this.setupSceneHandlers();
  }

  private setupSceneHandlers() {
    // Scene entry
    this.scene.enter(async (ctx) => {
      const userRole = ctx.session.user?.stakeholderType;
      
      if (!userRole || userRole === 'demo') {
        await ctx.reply('❓ Invalid user role. Please restart with /start');
        return ctx.scene.leave();
      }

      // Initialize onboarding session
      ctx.session.onboarding = {
        role: userRole,
        currentStep: 0,
        data: {},
        startTime: Date.now()
      };

      await this.showOnboardingWelcome(ctx, userRole);
    });

    // Step navigation
    this.scene.action(/step_(\d+)/, async (ctx) => {
      const stepIndex = parseInt(ctx.match[1]);
      await ctx.answerCbQuery(`Moving to step ${stepIndex + 1}...`);
      await this.showStep(ctx, stepIndex);
    });

    // Field input handlers
    this.scene.action(/field_(\w+)/, async (ctx) => {
      const fieldKey = ctx.match[1];
      await ctx.answerCbQuery();
      await this.promptFieldInput(ctx, fieldKey);
    });

    // Skip optional field
    this.scene.action(/skip_(\w+)/, async (ctx) => {
      const fieldKey = ctx.match[1];
      await ctx.answerCbQuery('Field skipped');
      await this.handleFieldInput(ctx, fieldKey, null, true);
    });

    // Complete onboarding
    this.scene.action('complete_onboarding', async (ctx) => {
      await ctx.answerCbQuery('Completing onboarding...');
      await this.completeOnboarding(ctx);
    });

    // Exit onboarding
    this.scene.action('exit_onboarding', async (ctx) => {
      await ctx.answerCbQuery('Exiting onboarding...');
      await this.exitOnboarding(ctx);
    });

    // Handle text input
    this.scene.on('text', async (ctx) => {
      await this.handleTextInput(ctx);
    });

    // Handle photo input
    this.scene.on('photo', async (ctx) => {
      await this.handlePhotoInput(ctx);
    });

    // Handle location input
    this.scene.on('location', async (ctx) => {
      await this.handleLocationInput(ctx);
    });
  }

  // ============================================================================
  // ONBOARDING FLOW
  // ============================================================================

  private async showOnboardingWelcome(ctx: GCTXContext, role: string) {
    const roleEmoji = this.getRoleEmoji(role);
    const roleTitle = this.getRoleTitle(role);
    const steps = this.onboardingSteps[role] || [];

    await ctx.reply(
      `${roleEmoji} *Welcome ${roleTitle}!*\n\n` +
      `🚀 Let's get you set up in the Ghana Gold Ecosystem.\n\n` +
      `📋 **Onboarding Process** (${steps.length} steps):\n` +
      steps.map((step, index) => 
        `${index + 1}. ${step.title} ${step.required ? '✅' : '🔲'}`
      ).join('\n') + '\n\n' +
      `⏱️ **Estimated Time**: ${this.estimateCompletionTime(steps)} minutes\n\n` +
      `🔒 **Privacy**: Your information is encrypted and secure.\n` +
      `🏛️ **Compliance**: Required by Ghana Minerals Commission regulations.\n\n` +
      `Ready to begin?`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🚀 Start Onboarding', callback_data: 'step_0' },
              { text: '❓ Learn More', callback_data: 'onboarding_info' }
            ],
            [
              { text: '📱 Continue on Mobile', callback_data: 'continue_mobile' },
              { text: '🔙 Exit', callback_data: 'exit_onboarding' }
            ]
          ]
        }
      }
    );
  }

  private async showStep(ctx: GCTXContext, stepIndex: number) {
    const role = ctx.session.onboarding?.role;
    const steps = this.onboardingSteps[role!] || [];
    const step = steps[stepIndex];

    if (!step) {
      return await this.completeOnboarding(ctx);
    }

    const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
    const progressBar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));

    await ctx.editMessageText(
      `📋 **Step ${stepIndex + 1}/${steps.length}: ${step.title}**\n\n` +
      `${step.description}\n\n` +
      `📊 **Progress**: ${progressBar} ${progress}%\n\n` +
      `📝 **Required Information**:\n` +
      step.fields.map(field => 
        `${field.required ? '🔴' : '🔲'} ${field.label}`
      ).join('\n') + '\n\n' +
      `Let's collect this information:`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '▶️ Start This Step', callback_data: `field_${step.fields[0].key}` }
            ],
            [
              stepIndex > 0 ? { text: '◀️ Previous Step', callback_data: `step_${stepIndex - 1}` } : null,
              stepIndex < steps.length - 1 ? { text: 'Skip Step ▶️', callback_data: `step_${stepIndex + 1}` } : null
            ].filter(Boolean),
            [
              { text: '💾 Save Progress', callback_data: 'save_progress' },
              { text: '❌ Exit Onboarding', callback_data: 'exit_onboarding' }
            ]
          ]
        }
      }
    );

    // Update session
    ctx.session.onboarding!.currentStep = stepIndex;
  }

  // ============================================================================
  // FIELD INPUT HANDLING
  // ============================================================================

  private async promptFieldInput(ctx: GCTXContext, fieldKey: string) {
    const role = ctx.session.onboarding?.role;
    const steps = this.onboardingSteps[role!] || [];
    
    // Find the field across all steps
    let field: OnboardingField | undefined;
    let currentStep: OnboardingStep | undefined;
    
    for (const step of steps) {
      field = step.fields.find(f => f.key === fieldKey);
      if (field) {
        currentStep = step;
        break;
      }
    }

    if (!field || !currentStep) {
      return await ctx.reply('❌ Field not found. Please try again.');
    }

    // Set current field in session
    ctx.session.onboarding!.currentField = fieldKey;

    const inputInstructions = this.getInputInstructions(field);
    const keyboard = this.getFieldKeyboard(field);

    await ctx.reply(
      `📝 **${field.label}**\n\n` +
      `${inputInstructions}\n\n` +
      `${field.required ? '🔴 Required field' : '🔲 Optional field'}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: keyboard
        }
      }
    );
  }

  private async handleTextInput(ctx: GCTXContext) {
    const currentField = ctx.session.onboarding?.currentField;
    if (!currentField) return;

    const text = ctx.message!.text!;
    await this.handleFieldInput(ctx, currentField, text);
  }

  private async handlePhotoInput(ctx: GCTXContext) {
    const currentField = ctx.session.onboarding?.currentField;
    if (!currentField) return;

    const photo = ctx.message!.photo![ctx.message!.photo!.length - 1];
    const fileId = photo.file_id;
    
    await this.handleFieldInput(ctx, currentField, fileId);
  }

  private async handleLocationInput(ctx: GCTXContext) {
    const currentField = ctx.session.onboarding?.currentField;
    if (!currentField) return;

    const location = ctx.message!.location!;
    const locationData = {
      latitude: location.latitude,
      longitude: location.longitude
    };
    
    await this.handleFieldInput(ctx, currentField, locationData);
  }

  private async handleFieldInput(ctx: GCTXContext, fieldKey: string, value: any, skipped = false) {
    // Store the field value
    if (!ctx.session.onboarding!.data) {
      ctx.session.onboarding!.data = {};
    }
    
    ctx.session.onboarding!.data[fieldKey] = skipped ? null : value;

    // Validate input
    if (!skipped && value) {
      const role = ctx.session.onboarding?.role;
      const steps = this.onboardingSteps[role!] || [];
      
      let field: OnboardingField | undefined;
      for (const step of steps) {
        field = step.fields.find(f => f.key === fieldKey);
        if (field) break;
      }

      if (field?.validation && typeof value === 'string') {
        if (!field.validation.test(value)) {
          await ctx.reply(
            `❌ Invalid format for ${field.label}. Please try again.\n\n` +
            `Expected format: ${this.getValidationHelp(field)}`
          );
          return;
        }
      }
    }

    await ctx.reply(
      skipped 
        ? `⏭️ Skipped: ${fieldKey}`
        : `✅ Saved: ${fieldKey}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '➡️ Continue', callback_data: 'continue_onboarding' }]
          ]
        }
      }
    );

    // Clear current field
    ctx.session.onboarding!.currentField = undefined;
  }

  // ============================================================================
  // COMPLETION AND UTILITIES
  // ============================================================================

  private async completeOnboarding(ctx: GCTXContext) {
    const role = ctx.session.user?.stakeholderType;
    const data = ctx.session.onboarding?.data || {};

    // Update user session with collected data
    ctx.session.user = {
      ...ctx.session.user!,
      verificationLevel: 'basic',
      onboardingCompleted: true,
      profile: data
    };

    const completionMessage = 
      `🎉 **Onboarding Complete!**\n\n` +
      `Welcome to the Ghana Gold Ecosystem, ${data.fullName || 'valued member'}!\n\n` +
      `✅ **Your Status**:\n` +
      `• Role: ${this.getRoleTitle(role!)}\n` +
      `• Verification: Basic (pending document review)\n` +
      `• Profile: Complete\n\n` +
      `📱 **Next Steps**:\n` +
      `• Download mobile apps for full functionality\n` +
      `• Wait for document verification (24-48 hours)\n` +
      `• Explore available features and services\n\n` +
      `🚀 **Get Started**:`;

    await ctx.editMessageText(completionMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 Go to Dashboard', callback_data: 'go_dashboard' },
            { text: '📱 Download Apps', callback_data: 'download_apps' }
          ],
          [
            { text: '🎪 Try Interactive Demo', callback_data: 'start_demo' },
            { text: '❓ Get Help', callback_data: 'get_help' }
          ]
        ]
      }
    });

    // Clear onboarding session
    delete ctx.session.onboarding;
    
    // Leave scene
    setTimeout(() => ctx.scene.leave(), 1000);
  }

  private async exitOnboarding(ctx: GCTXContext) {
    await ctx.editMessageText(
      `👋 **Onboarding Paused**\n\n` +
      `Your progress has been saved. You can continue anytime with /start.\n\n` +
      `💡 **Tip**: Complete onboarding to access all GCTX features.`,
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

  private getRoleEmoji(role: string): string {
    const emojiMap: { [key: string]: string } = {
      miner: '⛏️',
      trader: '💰',
      inspector: '🏛️',
      buyer: '🌍'
    };
    return emojiMap[role] || '👤';
  }

  private getRoleTitle(role: string): string {
    const titleMap: { [key: string]: string } = {
      miner: 'Small-Scale Miner',
      trader: 'Gold Trader',
      inspector: 'Government Inspector',
      buyer: 'International Buyer'
    };
    return titleMap[role] || 'User';
  }

  private estimateCompletionTime(steps: OnboardingStep[]): number {
    return steps.reduce((total, step) => total + (step.fields.length * 2), 5);
  }

  private getInputInstructions(field: OnboardingField): string {
    switch (field.type) {
      case 'text':
        return `Please type your ${field.label.toLowerCase()}.`;
      case 'phone':
        return `Please enter your phone number (e.g., +233 20 123 4567).`;
      case 'email':
        return `Please enter your email address.`;
      case 'file':
        return `Please upload a clear photo of your ${field.label.toLowerCase()}.`;
      case 'location':
        return `Please share your location or manually enter GPS coordinates.`;
      case 'select':
        return `Please select from the available options.`;
      default:
        return `Please provide your ${field.label.toLowerCase()}.`;
    }
  }

  private getFieldKeyboard(field: OnboardingField): any[][] {
    const keyboard: any[][] = [];

    if (field.type === 'select' && field.options) {
      // Add option buttons in pairs
      for (let i = 0; i < field.options.length; i += 2) {
        const row = [];
        row.push({ text: field.options[i], callback_data: `select_${field.key}_${field.options[i]}` });
        
        if (i + 1 < field.options.length) {
          row.push({ text: field.options[i + 1], callback_data: `select_${field.key}_${field.options[i + 1]}` });
        }
        
        keyboard.push(row);
      }
    }

    if (field.type === 'location') {
      keyboard.push([{ text: '📍 Share Location', request_location: true }]);
    }

    // Add control buttons
    const controlRow = [];
    if (!field.required) {
      controlRow.push({ text: '⏭️ Skip', callback_data: `skip_${field.key}` });
    }
    controlRow.push({ text: '🔙 Back', callback_data: 'go_back' });

    if (controlRow.length > 0) {
      keyboard.push(controlRow);
    }

    return keyboard;
  }

  private getValidationHelp(field: OnboardingField): string {
    if (field.key === 'ghanaCardId') {
      return 'GHA-123456789-1';
    }
    return 'Please check the format requirements';
  }
}