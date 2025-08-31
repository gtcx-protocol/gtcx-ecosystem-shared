// ============================================================================
// PAYMENT SERVICE - GHANA MOBILE MONEY INTEGRATION
// Production-ready MTN Mobile Money & Vodafone Cash processing
// ============================================================================

import { apiClient } from './api-client';

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  description: string;
  paymentType: 'mining_operation' | 'wallet_topup' | 'permit_fee' | 'compliance_fee';
  miningOperationId?: string;
}

export interface PaymentResponse {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  phoneNumber: string;
  description: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  providerDetails?: {
    providerPaymentId: string;
    providerStatus: string;
    providerMessage?: string;
  };
}

export interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalAmountPaid: number;
  thisMonthPayments: number;
  thisMonthAmount: number;
  favoriteProvider: string;
  lastPayment?: string;
}

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'expired';

export type PaymentProvider = 'mtn' | 'vodafone' | 'unknown';

export interface PaymentProviderHealth {
  mtn: {
    status: 'available' | 'degraded' | 'unavailable';
    responseTime?: number;
    lastChecked: string;
    error?: string;
  };
  vodafone: {
    status: 'available' | 'degraded' | 'unavailable';
    responseTime?: number;
    lastChecked: string;
    error?: string;
  };
}

class PaymentService {
  private readonly apiClient = apiClient;

  /**
   * Initiate a mobile money payment
   */
  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.apiClient.request<PaymentResponse>({
        endpoint: '/payments',
        method: 'POST',
        body: {
          payment: {
            amount: paymentData.amount,
            phone_number: paymentData.phoneNumber,
            description: paymentData.description,
            payment_type: paymentData.paymentType,
            mining_operation_id: paymentData.miningOperationId
          }
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      throw new Error(error.message || 'Failed to initiate payment');
    }
  }

  /**
   * Get payment history for current user
   */
  async getPaymentHistory(options: {
    limit?: number;
    status?: PaymentStatus;
    provider?: PaymentProvider;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaymentResponse[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.status) queryParams.append('status', options.status);
      if (options.provider) queryParams.append('provider', options.provider);
      if (options.startDate) queryParams.append('start_date', options.startDate);
      if (options.endDate) queryParams.append('end_date', options.endDate);

      const response = await this.apiClient.request<PaymentResponse[]>({
        endpoint: `/payments?${queryParams.toString()}`,
        method: 'GET'
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch payment history:', error);
      throw new Error('Failed to load payment history');
    }
  }

  /**
   * Get specific payment details
   */
  async getPaymentDetails(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await this.apiClient.request<PaymentResponse>({
        endpoint: `/payments/${paymentId}`,
        method: 'GET'
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch payment details:', error);
      throw new Error('Failed to load payment details');
    }
  }

  /**
   * Check payment status and update if needed
   */
  async checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await this.apiClient.request<PaymentResponse>({
        endpoint: `/payments/${paymentId}/check_status`,
        method: 'POST'
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to check payment status:', error);
      throw new Error('Failed to check payment status');
    }
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(paymentId: string, reason?: string): Promise<PaymentResponse> {
    try {
      const response = await this.apiClient.request<PaymentResponse>({
        endpoint: `/payments/${paymentId}/cancel`,
        method: 'POST',
        body: { reason }
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to cancel payment:', error);
      throw new Error('Failed to cancel payment');
    }
  }

  /**
   * Get payment statistics for current user
   */
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await this.apiClient.request<PaymentStats>({
        endpoint: '/payments/stats',
        method: 'GET'
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch payment stats:', error);
      throw new Error('Failed to load payment statistics');
    }
  }

  /**
   * Check health status of payment providers
   */
  async checkPaymentProvidersHealth(): Promise<{
    providers: PaymentProviderHealth;
    overallStatus: string;
    lastChecked: string;
  }> {
    try {
      const response = await this.apiClient.request<{
        providers: PaymentProviderHealth;
        overallStatus: string;
        lastChecked: string;
      }>({
        endpoint: '/payments/providers/health',
        method: 'GET'
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to check provider health:', error);
      throw new Error('Failed to check payment provider status');
    }
  }

  /**
   * Detect payment provider from phone number
   */
  detectPaymentProvider(phoneNumber: string): PaymentProvider {
    // Clean phone number
    const clean = phoneNumber.replace(/\D/g, '');
    
    // Ghana MTN prefixes
    const mtnPrefixes = ['233024', '233025', '233053', '233054', '233055', '233059',
                        '024', '025', '053', '054', '055', '059'];
    
    // Ghana Vodafone prefixes  
    const vodafonePrefixes = ['233020', '233050', '233027', '233028', '233026',
                             '020', '050', '027', '028', '026'];

    if (mtnPrefixes.some(prefix => clean.startsWith(prefix))) {
      return 'mtn';
    } else if (vodafonePrefixes.some(prefix => clean.startsWith(prefix))) {
      return 'vodafone';
    } else {
      return 'unknown';
    }
  }

  /**
   * Format phone number for Ghana
   */
  formatPhoneNumber(phoneNumber: string): string {
    const clean = phoneNumber.replace(/\D/g, '');
    
    // Add Ghana country code if missing
    let formatted = clean;
    if (clean.length === 9 && clean.startsWith('0')) {
      formatted = `233${clean.slice(1)}`;
    } else if (clean.length === 10 && !clean.startsWith('233')) {
      formatted = `233${clean}`;
    }
    
    // Format with spaces for display
    if (formatted.startsWith('233')) {
      return `+${formatted.slice(0, 3)} ${formatted.slice(3, 5)} ${formatted.slice(5, 8)} ${formatted.slice(8)}`;
    }
    
    return phoneNumber;
  }

  /**
   * Validate Ghana mobile number
   */
  validateGhanaMobileNumber(phoneNumber: string): boolean {
    const clean = phoneNumber.replace(/\D/g, '');
    
    // Check for valid Ghana mobile number patterns
    const patterns = [
      /^233[2-5][0-9]{8}$/, // +233 format
      /^0[2-5][0-9]{8}$/,   // 0 format
      /^[2-5][0-9]{8}$/     // Without country code or 0
    ];
    
    return patterns.some(pattern => pattern.test(clean));
  }

  /**
   * Get payment method name for display
   */
  getPaymentMethodName(provider: PaymentProvider): string {
    switch (provider) {
      case 'mtn':
        return 'MTN Mobile Money';
      case 'vodafone':
        return 'Vodafone Cash';
      default:
        return 'Mobile Money';
    }
  }

  /**
   * Get payment status color for UI
   */
  getPaymentStatusColor(status: PaymentStatus): string {
    switch (status) {
      case 'completed':
        return '#10B981'; // Green
      case 'pending':
      case 'processing':
        return '#F59E0B'; // Yellow
      case 'failed':
      case 'cancelled':
      case 'expired':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  }

  /**
   * Get payment status display text
   */
  getPaymentStatusText(status: PaymentStatus): string {
    switch (status) {
      case 'pending':
        return 'Pending Authorization';
      case 'processing':
        return 'Processing Payment';
      case 'completed':
        return 'Payment Completed';
      case 'failed':
        return 'Payment Failed';
      case 'cancelled':
        return 'Payment Cancelled';
      case 'expired':
        return 'Payment Expired';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  /**
   * Check if payment can be retried
   */
  canRetryPayment(status: PaymentStatus): boolean {
    return ['failed', 'expired'].includes(status);
  }

  /**
   * Check if payment can be cancelled
   */
  canCancelPayment(status: PaymentStatus, createdAt: string): boolean {
    if (!['pending', 'processing'].includes(status)) {
      return false;
    }
    
    // Can only cancel within 5 minutes of creation
    const created = new Date(createdAt);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    return created > fiveMinutesAgo;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();