// ============================================================================
// SHARED UI COMPONENT LIBRARY - CROSS-APP DESIGN SYSTEM
// Consistent UI components used across TradePass™, GeoTag™, and TradeDesk™
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

// ============================================================================
// SHARED THEME & STYLES
// ============================================================================

export const SHARED_COLORS = {
  // Primary Brand Colors
  primary: '#10b981', // Emerald green (trust, verification)
  secondary: '#64748b', // Slate gray (professional)
  accent: '#06b6d4', // Cyan (technology, clarity)
  success: '#22c55e', // Natural green (positive)
  warning: '#f59e0b', // Amber (caution)
  error: '#ef4444', // Red (error, danger)
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    dark: '#1e293b',
    warm: '#334155',
  },
  
  // Text Colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    light: '#f1f5f9',
    inverse: '#ffffff',
  },
  
  // Border Colors
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    accent: '#10b981',
  },
  
  // Status Colors
  status: {
    verified: '#22c55e',
    pending: '#f59e0b',
    rejected: '#ef4444',
    expired: '#6b7280',
  }
};

export const SHARED_TYPOGRAPHY = {
  fontFamily: {
    primary: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
    mono: 'JetBrains Mono',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const SHARED_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const SHARED_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

export interface CrossAppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: any;
}

export const CrossAppButton: React.FC<CrossAppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = async () => {
    if (disabled || loading) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: SHARED_RADIUS.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      ...(fullWidth && { width: '100%' }),
    };

    const sizeStyles = {
      sm: { paddingVertical: SHARED_SPACING.sm, paddingHorizontal: SHARED_SPACING.md },
      md: { paddingVertical: SHARED_SPACING.md, paddingHorizontal: SHARED_SPACING.lg },
      lg: { paddingVertical: SHARED_SPACING.lg, paddingHorizontal: SHARED_SPACING.xl },
    };

    const variantStyles = {
      primary: {
        backgroundColor: SHARED_COLORS.primary,
        borderColor: SHARED_COLORS.primary,
      },
      secondary: {
        backgroundColor: SHARED_COLORS.secondary,
        borderColor: SHARED_COLORS.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: SHARED_COLORS.primary,
        borderWidth: 1,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: SHARED_COLORS.error,
        borderColor: SHARED_COLORS.error,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.5 }),
      ...(isPressed && { opacity: 0.8 }),
      ...style,
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontFamily: SHARED_TYPOGRAPHY.fontFamily.primary,
      fontWeight: SHARED_TYPOGRAPHY.fontWeight.medium,
    };

    const sizeStyles = {
      sm: { fontSize: SHARED_TYPOGRAPHY.fontSize.sm },
      md: { fontSize: SHARED_TYPOGRAPHY.fontSize.base },
      lg: { fontSize: SHARED_TYPOGRAPHY.fontSize.lg },
    };

    const variantStyles = {
      primary: { color: SHARED_COLORS.text.inverse },
      secondary: { color: SHARED_COLORS.text.inverse },
      outline: { color: SHARED_COLORS.primary },
      ghost: { color: SHARED_COLORS.primary },
      danger: { color: SHARED_COLORS.text.inverse },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? SHARED_COLORS.primary : SHARED_COLORS.text.inverse} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={SHARED_TYPOGRAPHY.fontSize[size]} 
              color={getTextStyle().color} 
              style={{ marginRight: SHARED_SPACING.sm }}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={SHARED_TYPOGRAPHY.fontSize[size]} 
              color={getTextStyle().color} 
              style={{ marginLeft: SHARED_SPACING.sm }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// STATUS INDICATOR COMPONENT
// ============================================================================

export interface CrossAppStatusIndicatorProps {
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CrossAppStatusIndicator: React.FC<CrossAppStatusIndicatorProps> = ({
  status,
  text,
  size = 'md',
  showIcon = true,
}) => {
  const getStatusConfig = () => {
    const configs = {
      verified: {
        color: SHARED_COLORS.status.verified,
        icon: 'checkmark-circle' as const,
        text: text || 'Verified',
      },
      pending: {
        color: SHARED_COLORS.status.pending,
        icon: 'time' as const,
        text: text || 'Pending',
      },
      rejected: {
        color: SHARED_COLORS.status.rejected,
        icon: 'close-circle' as const,
        text: text || 'Rejected',
      },
      expired: {
        color: SHARED_COLORS.status.expired,
        icon: 'alert-circle' as const,
        text: text || 'Expired',
      },
    };
    return configs[status];
  };

  const config = getStatusConfig();
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;

  return (
    <View style={[styles.statusContainer, { backgroundColor: `${config.color}20` }]}>
      {showIcon && (
        <Ionicons 
          name={config.icon} 
          size={iconSize} 
          color={config.color} 
          style={{ marginRight: SHARED_SPACING.xs }}
        />
      )}
      <Text style={[
        styles.statusText,
        { 
          color: config.color,
          fontSize: size === 'sm' ? SHARED_TYPOGRAPHY.fontSize.xs : SHARED_TYPOGRAPHY.fontSize.sm,
        }
      ]}>
        {config.text}
      </Text>
    </View>
  );
};

// ============================================================================
// CREDENTIAL CARD COMPONENT
// ============================================================================

export interface CrossAppCredentialCardProps {
  title: string;
  subtitle?: string;
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  type: 'mining_license' | 'inspection_certificate' | 'trading_permit' | 'government_id';
  validFrom?: Date;
  validUntil?: Date;
  issuer?: string;
  onPress?: () => void;
  showDetails?: boolean;
}

export const CrossAppCredentialCard: React.FC<CrossAppCredentialCardProps> = ({
  title,
  subtitle,
  status,
  type,
  validFrom,
  validUntil,
  issuer,
  onPress,
  showDetails = false,
}) => {
  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    const icons: Record<typeof type, keyof typeof Ionicons.glyphMap> = {
      mining_license: 'construct',
      inspection_certificate: 'clipboard',
      trading_permit: 'business',
      government_id: 'card',
    };
    return icons[type];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.credentialCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.credentialHeader}>
        <View style={styles.credentialIconContainer}>
          <Ionicons 
            name={getTypeIcon()} 
            size={24} 
            color={SHARED_COLORS.primary} 
          />
        </View>
        <View style={styles.credentialInfo}>
          <Text style={styles.credentialTitle}>{title}</Text>
          {subtitle && <Text style={styles.credentialSubtitle}>{subtitle}</Text>}
        </View>
        <CrossAppStatusIndicator status={status} size="sm" />
      </View>
      
      {showDetails && (validFrom || validUntil || issuer) && (
        <View style={styles.credentialDetails}>
          {issuer && (
            <Text style={styles.credentialDetail}>
              <Text style={styles.credentialDetailLabel}>Issuer: </Text>
              {issuer}
            </Text>
          )}
          {validFrom && (
            <Text style={styles.credentialDetail}>
              <Text style={styles.credentialDetailLabel}>Valid from: </Text>
              {formatDate(validFrom)}
            </Text>
          )}
          {validUntil && (
            <Text style={styles.credentialDetail}>
              <Text style={styles.credentialDetailLabel}>Valid until: </Text>
              {formatDate(validUntil)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// LOADING OVERLAY COMPONENT
// ============================================================================

export interface CrossAppLoadingOverlayProps {
  visible: boolean;
  message?: string;
  showBlur?: boolean;
}

export const CrossAppLoadingOverlay: React.FC<CrossAppLoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  showBlur = true,
}) => {
  if (!visible) return null;

  const OverlayContent = () => (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SHARED_COLORS.primary} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );

  if (showBlur) {
    return (
      <BlurView intensity={20} style={StyleSheet.absoluteFill}>
        <OverlayContent />
      </BlurView>
    );
  }

  return <OverlayContent />;
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SHARED_SPACING.sm,
    paddingVertical: SHARED_SPACING.xs,
    borderRadius: SHARED_RADIUS.full,
  },
  statusText: {
    fontFamily: SHARED_TYPOGRAPHY.fontFamily.primary,
    fontWeight: SHARED_TYPOGRAPHY.fontWeight.medium,
  },
  credentialCard: {
    backgroundColor: SHARED_COLORS.background.primary,
    borderRadius: SHARED_RADIUS.lg,
    padding: SHARED_SPACING.lg,
    marginVertical: SHARED_SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  credentialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credentialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: SHARED_RADIUS.md,
    backgroundColor: `${SHARED_COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SHARED_SPACING.md,
  },
  credentialInfo: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: SHARED_TYPOGRAPHY.fontSize.lg,
    fontWeight: SHARED_TYPOGRAPHY.fontWeight.semibold,
    color: SHARED_COLORS.text.primary,
    marginBottom: SHARED_SPACING.xs,
  },
  credentialSubtitle: {
    fontSize: SHARED_TYPOGRAPHY.fontSize.sm,
    color: SHARED_COLORS.text.secondary,
  },
  credentialDetails: {
    marginTop: SHARED_SPACING.md,
    paddingTop: SHARED_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: SHARED_COLORS.border.primary,
  },
  credentialDetail: {
    fontSize: SHARED_TYPOGRAPHY.fontSize.sm,
    color: SHARED_COLORS.text.secondary,
    marginBottom: SHARED_SPACING.xs,
  },
  credentialDetailLabel: {
    fontWeight: SHARED_TYPOGRAPHY.fontWeight.medium,
    color: SHARED_COLORS.text.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: SHARED_COLORS.background.primary,
    borderRadius: SHARED_RADIUS.lg,
    padding: SHARED_SPACING.xl,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: SHARED_SPACING.md,
    fontSize: SHARED_TYPOGRAPHY.fontSize.base,
    color: SHARED_COLORS.text.primary,
    textAlign: 'center',
  },
});