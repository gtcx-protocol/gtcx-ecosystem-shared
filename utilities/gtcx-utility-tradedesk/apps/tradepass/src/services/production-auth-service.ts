// ============================================================================
// 🚀 PRODUCTION AUTHENTICATION SERVICE - RAILS API INTEGRATION
// World-class authentication with intelligent session management
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiClient } from './api-client';

// ============================================================================
// AUTHENTICATION TYPES & INTERFACES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'miner' | 'trader' | 'government_official' | 'inspector';
  permitNumber?: string;
  status: 'pending' | 'active' | 'suspended' | 'banned';
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  permitNumber?: string;
}

// ============================================================================
// PRODUCTION AUTHENTICATION SERVICE
// ============================================================================

class ProductionAuthService {
  private static instance: ProductionAuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  static getInstance(): ProductionAuthService {
    if (!this.instance) {
      this.instance = new ProductionAuthService();
    }
    return this.instance;
  }

  private constructor() {
    this.loadStoredAuth();
  }

  // ============================================================================
  // AUTHENTICATION LIFECYCLE
  // ============================================================================

  private async loadStoredAuth(): Promise<void> {
    try {
      const storedUser = await AsyncStorage.getItem('@gtcx_user');
      const storedToken = await AsyncStorage.getItem('@gtcx_token');
      
      if (storedUser && storedToken) {
        this.currentUser = JSON.parse(storedUser);
        this.authToken = storedToken;
        
        // Verify token is still valid
        await this.verifyTokenValidity();
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await this.clearStoredAuth();
    }
  }

  private async storeAuth(user: User, token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('@gtcx_user', JSON.stringify(user));
      await AsyncStorage.setItem('@gtcx_token', token);
      
      this.currentUser = user;
      this.authToken = token;
      
      this.setupTokenRefresh();
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  }

  private async clearStoredAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        '@gtcx_user',
        '@gtcx_token',
        '@gtcx_refresh_token'
      ]);
      
      this.currentUser = null;
      this.authToken = null;
      
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  }

  private setupTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh token 5 minutes before expiry (assuming 24h tokens)
    const refreshInterval = 23 * 60 * 60 * 1000; // 23 hours
    
    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshInterval);
  }

  private async verifyTokenValidity(): Promise<boolean> {
    try {
      await apiClient.getUserProfile();
      return true;
    } catch (error) {
      console.log('Token invalid, clearing auth');
      await this.clearStoredAuth();
      return false;
    }
  }

  // ============================================================================
  // PUBLIC AUTHENTICATION METHODS
  // ============================================================================

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🚀 Authenticating with Rails API...');
      
      const response = await apiClient.login(
        credentials.email, 
        credentials.password
      );

      await this.storeAuth(response.user, response.token);

      console.log('✅ Authentication successful:', response.user.role);
      
      return response;

    } catch (error) {
      console.error('❌ Login failed:', error.message);
      
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🚀 Creating new account with Rails API...');
      
      const response = await apiClient.register(userData);

      await this.storeAuth(response.user, response.token);

      console.log('✅ Registration successful:', response.user.role);
      
      Alert.alert(
        'Account Created',
        `Welcome to GTCX, ${response.user.name}! Your account has been created successfully.`,
        [{ text: 'Continue' }]
      );
      
      return response;

    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      
      Alert.alert(
        'Registration Failed',
        error.message || 'Please check your information and try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚀 Logging out...');
      
      // Call API logout
      await apiClient.logout();

      // Clear local storage
      await this.clearStoredAuth();

      console.log('✅ Logout successful');

    } catch (error) {
      console.error('❌ Logout error:', error.message);
      // Clear local storage even if API call fails
      await this.clearStoredAuth();
    }
  }

  async refreshToken(): Promise<void> {
    try {
      console.log('🔄 Refreshing authentication token...');
      
      await apiClient.refreshAccessToken();
      
      // Token is automatically stored in ApiClient
      this.setupTokenRefresh();
      
      console.log('✅ Token refresh successful');

    } catch (error) {
      console.error('❌ Token refresh failed:', error.message);
      
      // If refresh fails, logout user
      await this.logout();
      
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [{ text: 'OK' }]
      );
    }
  }

  // ============================================================================
  // USER PROFILE MANAGEMENT
  // ============================================================================

  async updateProfile(updateData: Partial<User>): Promise<User> {
    try {
      console.log('🚀 Updating user profile...');
      
      const updatedUser = await apiClient.updateUserProfile(updateData);
      
      // Update stored user data
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updatedUser };
        await AsyncStorage.setItem('@gtcx_user', JSON.stringify(this.currentUser));
      }

      console.log('✅ Profile updated successfully');
      
      return updatedUser;

    } catch (error) {
      console.error('❌ Profile update failed:', error.message);
      
      Alert.alert(
        'Update Failed',
        error.message || 'Could not update profile. Please try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }

  async refreshUserProfile(): Promise<User> {
    try {
      const userData = await apiClient.getUserProfile();
      
      if (this.currentUser) {
        this.currentUser = userData;
        await AsyncStorage.setItem('@gtcx_user', JSON.stringify(this.currentUser));
      }
      
      return userData;
      
    } catch (error) {
      console.error('❌ Profile refresh failed:', error.message);
      throw error;
    }
  }

  // ============================================================================
  // BIOMETRIC AUTHENTICATION INTEGRATION
  // ============================================================================

  async enrollBiometric(biometricData: any): Promise<void> {
    try {
      console.log('🚀 Enrolling biometric data...');
      
      await apiClient.enrollBiometric(biometricData);
      
      console.log('✅ Biometric enrollment successful');
      
      Alert.alert(
        'Biometric Enrolled',
        'Your biometric data has been securely enrolled for enhanced security.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('❌ Biometric enrollment failed:', error.message);
      
      Alert.alert(
        'Enrollment Failed',
        'Could not enroll biometric data. Please try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }

  async verifyIdentity(identityData: any): Promise<boolean> {
    try {
      console.log('🚀 Verifying identity...');
      
      const result = await apiClient.verifyIdentity(identityData);
      
      console.log('✅ Identity verification completed:', result.verified);
      
      return result.verified;

    } catch (error) {
      console.error('❌ Identity verification failed:', error.message);
      return false;
    }
  }

  // ============================================================================
  // AUTHENTICATION STATE QUERIES
  // ============================================================================

  isAuthenticated(): boolean {
    return !!(this.currentUser && this.authToken && apiClient.isAuthenticated());
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  canAccessMiningOperations(): boolean {
    const role = this.getUserRole();
    return ['miner', 'government_official', 'inspector'].includes(role || '');
  }

  canTradeGold(): boolean {
    const role = this.getUserRole();
    return ['trader', 'miner'].includes(role || '');
  }

  isGovernmentOfficial(): boolean {
    const role = this.getUserRole();
    return ['government_official', 'inspector'].includes(role || '');
  }

  // ============================================================================
  // PERMISSION CHECKS
  // ============================================================================

  requireAuthentication(): void {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }
  }

  requireRole(allowedRoles: string[]): void {
    this.requireAuthentication();
    
    const userRole = this.getUserRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
    }
  }

  requireMinerPermissions(): void {
    this.requireRole(['miner', 'government_official', 'inspector']);
  }

  requireTraderPermissions(): void {
    this.requireRole(['trader', 'miner']);
  }

  requireGovernmentPermissions(): void {
    this.requireRole(['government_official', 'inspector']);
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const authService = ProductionAuthService.getInstance();

// ============================================================================
// IMPORT SECURE CRYPTO SERVICE
// ============================================================================

import { MilitaryCryptoService as SecureMilitaryCryptoService, IdentityCredential } from './secure-crypto-service';

// Re-export the secure implementation
export const MilitaryCryptoService = SecureMilitaryCryptoService;
export type { IdentityCredential };

export default authService;