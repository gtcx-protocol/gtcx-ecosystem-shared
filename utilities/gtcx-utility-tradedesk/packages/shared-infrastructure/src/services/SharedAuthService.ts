/**
 * Shared Authentication Service
 * Unified user session management across GeoTag™ and TradeDesk™
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger, LogCategory } from './logger';

export interface UnifiedUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  
  // Role information
  geotagRole?: {
    type: 'small-scale-miner' | 'government-inspector' | 'mining-company';
    licenseNumber: string;
    verificationLevel: 'basic' | 'enhanced' | 'premium';
    permissions: string[];
  };
  
  tradedeskRole?: {
    type: 'gold-trader' | 'licensed-buyer' | 'compliance-officer';
    licenseNumber: string;
    tradingLevel: 'basic' | 'professional' | 'institutional';
    permissions: string[];
  };
  
  // Profile information
  profile: {
    avatar?: string;
    location?: {
      region: string;
      district: string;
      coordinates?: { latitude: number; longitude: number };
    };
    preferences: {
      language: 'en' | 'tw' | 'fr' | 'ar';
      currency: 'GHS' | 'USD' | 'EUR';
      notifications: {
        goldLots: boolean;
        trades: boolean;
        compliance: boolean;
        system: boolean;
      };
    };
  };
  
  // Security
  security: {
    lastLogin: string;
    deviceId: string;
    biometricEnabled: boolean;
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
  
  // Cross-app data
  crossAppData: {
    goldLots: string[];
    transactions: string[];
    complianceRecords: string[];
    sharedDocuments: string[];
  };
}

export interface AppSession {
  userId: string;
  appName: 'geotag' | 'tradedesk';
  sessionId: string;
  startTime: string;
  lastActivity: string;
  isActive: boolean;
  permissions: string[];
  deviceInfo: {
    platform: string;
    version: string;
    deviceId: string;
  };
}

export interface CrossAppNotification {
  id: string;
  userId: string;
  fromApp: 'geotag' | 'tradedesk';
  type: 'gold_lot' | 'trade' | 'compliance' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export class SharedAuthService {
  private currentApp: 'geotag' | 'tradedesk';
  private currentSession: AppSession | null = null;
  private currentUser: UnifiedUser | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private crossAppIntegration: any; // CrossAppIntegrationService

  constructor(appName: 'geotag' | 'tradedesk', crossAppIntegration?: any) {
    this.currentApp = appName;
    this.crossAppIntegration = crossAppIntegration;
    this.initializeAuth();
  }

  /**
   * Initialize authentication system
   */
  private async initializeAuth(): Promise<void> {
    try {
      // Load existing session
      await this.loadExistingSession();
      
      // Start session monitoring
      this.startSessionMonitoring();
      
      logger.info(LogCategory.AUTH, `Shared auth initialized for ${this.currentApp}`);
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to initialize shared auth', error);
    }
  }

  /**
   * Authenticate user with cross-app session creation
   */
  async authenticateUser(credentials: {
    email: string;
    password: string;
    biometricData?: any;
    deviceId: string;
  }): Promise<{
    success: boolean;
    user?: UnifiedUser;
    session?: AppSession;
    error?: string;
  }> {
    try {
      logger.info(LogCategory.AUTH, 'Authenticating user', { email: credentials.email });

      // Validate credentials (this would integrate with real auth service)
      const authResult = await this.validateCredentials(credentials);
      if (!authResult.valid) {
        return { success: false, error: authResult.error };
      }

      // Load or create unified user profile
      const user = await this.loadOrCreateUnifiedUser(credentials.email, authResult.userData);
      
      // Create session for current app
      const session = await this.createAppSession(user.id, credentials.deviceId);
      
      // Store session and user data
      await this.storeSession(session);
      await this.storeUser(user);
      
      this.currentUser = user;
      this.currentSession = session;

      // Notify other app about login
      if (this.crossAppIntegration) {
        await this.crossAppIntegration.sendMessage(
          this.currentApp === 'geotag' ? 'tradedesk' : 'geotag',
          'user_notification',
          {
            type: 'user_login',
            userId: user.id,
            appName: this.currentApp,
            sessionId: session.sessionId,
          },
          'medium'
        );
      }

      logger.info(LogCategory.AUTH, 'User authenticated successfully', { userId: user.id });
      
      return { success: true, user, session };
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Authentication failed', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Switch between apps with seamless session transfer
   */
  async switchToApp(targetApp: 'geotag' | 'tradedesk'): Promise<{
    success: boolean;
    session?: AppSession;
    error?: string;
  }> {
    if (!this.currentUser || !this.currentSession) {
      return { success: false, error: 'No active session' };
    }

    try {
      // Check if user has permissions for target app
      const hasPermission = this.userHasAppPermission(this.currentUser, targetApp);
      if (!hasPermission) {
        return { success: false, error: 'User not authorized for target app' };
      }

      // Create session for target app
      const newSession = await this.createAppSession(
        this.currentUser.id,
        this.currentSession.deviceInfo.deviceId,
        targetApp
      );

      // Update cross-app data
      await this.syncCrossAppUserData();

      logger.info(LogCategory.AUTH, `User switched to ${targetApp}`, {
        userId: this.currentUser.id,
        fromApp: this.currentApp,
        toApp: targetApp,
      });

      return { success: true, session: newSession };
    } catch (error) {
      logger.error(LogCategory.AUTH, 'App switch failed', error);
      return { success: false, error: 'Failed to switch apps' };
    }
  }

  /**
   * Get unified user profile
   */
  getCurrentUser(): UnifiedUser | null {
    return this.currentUser;
  }

  /**
   * Get current session
   */
  getCurrentSession(): AppSession | null {
    return this.currentSession;
  }

  /**
   * Update user profile across both apps
   */
  async updateUserProfile(updates: Partial<UnifiedUser>): Promise<{
    success: boolean;
    user?: UnifiedUser;
    error?: string;
  }> {
    if (!this.currentUser) {
      return { success: false, error: 'No active user' };
    }

    try {
      // Merge updates
      const updatedUser: UnifiedUser = {
        ...this.currentUser,
        ...updates,
        profile: {
          ...this.currentUser.profile,
          ...(updates.profile || {}),
          preferences: {
            ...this.currentUser.profile.preferences,
            ...(updates.profile?.preferences || {}),
          },
        },
      };

      // Store updated user
      await this.storeUser(updatedUser);
      this.currentUser = updatedUser;

      // Sync across apps
      if (this.crossAppIntegration) {
        await this.crossAppIntegration.sendMessage(
          this.currentApp === 'geotag' ? 'tradedesk' : 'geotag',
          'user_notification',
          {
            type: 'profile_update',
            userId: updatedUser.id,
            updates,
          },
          'medium'
        );
      }

      logger.info(LogCategory.AUTH, 'User profile updated', { userId: updatedUser.id });
      
      return { success: true, user: updatedUser };
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Profile update failed', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  /**
   * Logout from current app
   */
  async logout(logoutFromAllApps: boolean = false): Promise<void> {
    if (!this.currentUser || !this.currentSession) {
      return;
    }

    try {
      // Notify other app if logging out from all apps
      if (logoutFromAllApps && this.crossAppIntegration) {
        await this.crossAppIntegration.sendMessage(
          this.currentApp === 'geotag' ? 'tradedesk' : 'geotag',
          'user_notification',
          {
            type: 'user_logout',
            userId: this.currentUser.id,
            logoutAll: true,
          },
          'high'
        );
      }

      // Clear session data
      await this.clearSession();
      
      // Stop session monitoring
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }

      logger.info(LogCategory.AUTH, 'User logged out', {
        userId: this.currentUser.id,
        appName: this.currentApp,
        logoutAll: logoutFromAllApps,
      });

      this.currentUser = null;
      this.currentSession = null;
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Logout failed', error);
    }
  }

  /**
   * Get cross-app notifications
   */
  async getCrossAppNotifications(): Promise<CrossAppNotification[]> {
    if (!this.currentUser) {
      return [];
    }

    try {
      const stored = await AsyncStorage.getItem(`notifications_${this.currentUser.id}`);
      if (!stored) {
        return [];
      }

      const notifications: CrossAppNotification[] = JSON.parse(stored);
      return notifications
        .filter(n => n.userId === this.currentUser!.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to get notifications', error);
      return [];
    }
  }

  /**
   * Add cross-app notification
   */
  async addCrossAppNotification(notification: Omit<CrossAppNotification, 'id' | 'timestamp'>): Promise<void> {
    try {
      const fullNotification: CrossAppNotification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString(),
      };

      const existing = await this.getCrossAppNotifications();
      const updated = [fullNotification, ...existing];

      // Keep only last 100 notifications
      if (updated.length > 100) {
        updated.splice(100);
      }

      await AsyncStorage.setItem(
        `notifications_${notification.userId}`,
        JSON.stringify(updated)
      );

      logger.info(LogCategory.AUTH, 'Cross-app notification added', {
        type: notification.type,
        userId: notification.userId,
      });
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to add notification', error);
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    if (!this.currentUser) return;

    try {
      const notifications = await this.getCrossAppNotifications();
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );

      await AsyncStorage.setItem(
        `notifications_${this.currentUser.id}`,
        JSON.stringify(updated)
      );
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to mark notification read', error);
    }
  }

  // Private helper methods
  private async loadExistingSession(): Promise<void> {
    try {
      const sessionKey = `session_${this.currentApp}`;
      const userKey = 'current_user';
      
      const [sessionData, userData] = await Promise.all([
        AsyncStorage.getItem(sessionKey),
        AsyncStorage.getItem(userKey),
      ]);

      if (sessionData && userData) {
        this.currentSession = JSON.parse(sessionData);
        this.currentUser = JSON.parse(userData);
        
        // Check if session is still valid
        if (this.currentSession && this.isSessionValid(this.currentSession)) {
          logger.info(LogCategory.AUTH, 'Existing session loaded', {
            userId: this.currentUser?.id,
          });
        } else {
          // Clear invalid session
          await this.clearSession();
        }
      }
    } catch (error) {
      logger.error(LogCategory.AUTH, 'Failed to load existing session', error);
    }
  }

  private async validateCredentials(credentials: any): Promise<{
    valid: boolean;
    userData?: any;
    error?: string;
  }> {
    // This would integrate with real authentication service
    // For demo purposes, we'll simulate validation
    return {
      valid: true,
      userData: {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: 'Demo User',
      },
    };
  }

  private async loadOrCreateUnifiedUser(email: string, authData: any): Promise<UnifiedUser> {
    // Try to load existing unified user
    const existingUser = await this.loadUserByEmail(email);
    if (existingUser) {
      return existingUser;
    }

    // Create new unified user
    const newUser: UnifiedUser = {
      id: authData.id,
      email: email,
      name: authData.name,
      // Add roles for both apps to enable seamless switching
      geotagRole: {
        type: 'small-scale-miner',
        licenseNumber: 'SSM-TEST-2024',
        verificationLevel: 'enhanced',
        permissions: ['mining', 'registration', 'trading'],
      },
      tradedeskRole: {
        type: 'gold-trader',
        licenseNumber: 'GT-TEST-2024',
        tradingLevel: 'professional',
        permissions: ['trading', 'analysis', 'compliance'],
      },
      profile: {
        preferences: {
          language: 'en',
          currency: 'GHS',
          notifications: {
            goldLots: true,
            trades: true,
            compliance: true,
            system: true,
          },
        },
      },
      security: {
        lastLogin: new Date().toISOString(),
        deviceId: '',
        biometricEnabled: false,
        twoFactorEnabled: false,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      },
      crossAppData: {
        goldLots: [],
        transactions: [],
        complianceRecords: [],
        sharedDocuments: [],
      },
    };

    return newUser;
  }

  private async createAppSession(userId: string, deviceId: string, appName?: 'geotag' | 'tradedesk'): Promise<AppSession> {
    const session: AppSession = {
      userId,
      appName: appName || this.currentApp,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
      permissions: this.getUserPermissionsForApp(userId, appName || this.currentApp),
      deviceInfo: {
        platform: 'react-native',
        version: '1.0.0',
        deviceId,
      },
    };

    return session;
  }

  private async storeSession(session: AppSession): Promise<void> {
    await AsyncStorage.setItem(`session_${session.appName}`, JSON.stringify(session));
  }

  private async storeUser(user: UnifiedUser): Promise<void> {
    await AsyncStorage.setItem('current_user', JSON.stringify(user));
  }

  private async clearSession(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(`session_${this.currentApp}`),
      AsyncStorage.removeItem('current_user'),
    ]);
  }

  private isSessionValid(session: AppSession): boolean {
    const now = Date.now();
    const lastActivity = new Date(session.lastActivity).getTime();
    const timeout = this.currentUser?.security.sessionTimeout || (24 * 60 * 60 * 1000);
    
    return (now - lastActivity) < timeout;
  }

  private userHasAppPermission(user: UnifiedUser, appName: 'geotag' | 'tradedesk'): boolean {
    if (appName === 'geotag') {
      return !!user.geotagRole;
    } else {
      return !!user.tradedeskRole;
    }
  }

  private getUserPermissionsForApp(userId: string, appName: 'geotag' | 'tradedesk'): string[] {
    if (!this.currentUser) return [];
    
    if (appName === 'geotag') {
      return this.currentUser.geotagRole?.permissions || ['basic'];
    } else {
      return this.currentUser.tradedeskRole?.permissions || ['basic'];
    }
  }

  private async loadUserByEmail(email: string): Promise<UnifiedUser | null> {
    // This would query user database
    return null;
  }

  private async syncCrossAppUserData(): Promise<void> {
    // Sync user data across apps
  }

  private startSessionMonitoring(): void {
    this.sessionCheckInterval = setInterval(async () => {
      if (this.currentSession && !this.isSessionValid(this.currentSession)) {
        await this.logout();
      }
    }, 60000); // Check every minute
  }
}

export default SharedAuthService;