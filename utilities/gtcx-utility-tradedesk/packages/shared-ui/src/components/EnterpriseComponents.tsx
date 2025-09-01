// ============================================================================
// GEOTAG™ ENHANCED ENTERPRISE UI COMPONENTS - WORLD-CLASS AESTHETICS
// Enterprise-grade components with superior contrast and compact design
// Optimized for dark mode with polished interactions and micro-animations
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Switch,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext, ThemedText, ThemedView, ThemedButton, ThemedCard } from '@/components/ThemeProvider';
import { accessibility } from '@/services/accessibility';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// ENHANCED ENTERPRISE HEADER COMPONENT
// ============================================================================

interface EnterpriseHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  onLeftPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  variant?: 'default' | 'compact' | 'elevated';
  showBackButton?: boolean;
  onBackPress?: () => void;
  children?: React.ReactNode;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  variant = 'default',
  showBackButton = false,
  onBackPress,
  children,
}) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows } = theme;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getHeaderStyle = () => {
    switch (variant) {
      case 'compact':
        return {
          backgroundColor: colors.background.header,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          borderBottomWidth: 1,
          borderBottomColor: colors.border.primary,
          ...shadows.sm,
        };
      case 'elevated':
        return {
          backgroundColor: colors.background.header,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          borderBottomWidth: 1,
          borderBottomColor: colors.border.primary,
          ...shadows.md,
        };
      default:
        return {
          backgroundColor: colors.background.header,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          borderBottomWidth: 1,
          borderBottomColor: colors.border.primary,
        };
    }
  };

  return (
    <Animated.View style={[getHeaderStyle(), { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress}
              style={[styles.headerButton, { backgroundColor: colors.accent.primary + '20' }]}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          )}
          {leftIcon && (
            <TouchableOpacity
              onPress={onLeftPress}
              style={[styles.headerButton, { backgroundColor: colors.accent.primary + '20' }]}
              activeOpacity={0.7}
            >
              <Ionicons name={leftIcon as any} size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <ThemedText variant="primary" weight="bold" size="lg" style={styles.headerTitle}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText variant="tertiary" size="sm" style={styles.headerSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>

        <View style={styles.headerRight}>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              style={[styles.headerButton, { backgroundColor: colors.accent.primary + '20' }]}
              activeOpacity={0.7}
            >
              <Ionicons name={rightIcon as any} size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {children}
    </Animated.View>
  );
};

// ============================================================================
// ENHANCED ENTERPRISE CARD COMPONENT
// ============================================================================

interface EnterpriseCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact' | 'elevated' | 'interactive';
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  loading?: boolean;
}

export const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  disabled = false,
  loading = false,
}) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows } = theme;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (variant === 'interactive' && !disabled) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (variant === 'interactive' && !disabled) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.card.border,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'compact':
        return {
          ...baseStyle,
          backgroundColor: colors.card.background,
          padding: spacing[3],
          ...shadows.sm,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colors.card.elevated,
          padding: spacing[4],
          ...shadows.md,
        };
      case 'interactive':
        return {
          ...baseStyle,
          backgroundColor: colors.card.background,
          padding: spacing[4],
          ...shadows.base,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.card.background,
          padding: spacing[4],
          ...shadows.base,
        };
    }
  };

  const CardContainer = variant === 'interactive' ? TouchableOpacity : View;

  // Generate accessibility props for interactive cards
  const accessibilityProps = variant === 'interactive' ? accessibility.generateAccessibilityProps({
    label: 'Interactive card',
    hint: disabled ? 'Card is disabled' : loading ? 'Card is loading' : 'Double tap to interact',
    role: 'button',
    state: { disabled: disabled || loading },
  }) : {};

  return (
    <Animated.View
      style={[
        getCardStyle(),
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <CardContainer
        onPress={(event) => {
          if (variant === 'interactive') {
            accessibility.provideHapticFeedback('light');
          }
          onPress?.(event);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={styles.cardContent}
        {...accessibilityProps}
      >
        {loading && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.background.overlay }]}>
            <ThemedText variant="primary" size="sm">Loading...</ThemedText>
          </View>
        )}
        {children}
      </CardContainer>
    </Animated.View>
  );
};

// ============================================================================
// ENHANCED ENTERPRISE BUTTON COMPONENT
// ============================================================================

interface EnterpriseButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'compact';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: any;
}

export const EnterpriseButton: React.FC<EnterpriseButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows } = theme;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...shadows.sm,
    };

    const sizeStyle = {
      small: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
      },
      medium: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
      },
      large: {
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[4],
      },
    };

    const variantStyle = {
      primary: {
        backgroundColor: colors.accent.primary,
      },
      secondary: {
        backgroundColor: colors.accent.secondary,
      },
      tertiary: {
        backgroundColor: colors.accent.tertiary,
      },
      danger: {
        backgroundColor: colors.accent.error,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border.primary,
      },
      compact: {
        backgroundColor: colors.accent.primary,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
      },
    };

    return {
      ...baseStyle,
      ...sizeStyle[size],
      ...variantStyle[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextColor = () => {
    switch (variant) {
      case 'ghost':
        return colors.text.primary;
      default:
        return colors.text.inverse;
    }
  };

  // Generate accessibility props
  const accessibilityProps = accessibility.generateAccessibilityProps({
    label: title,
    hint: disabled ? 'Button is disabled' : loading ? 'Button is loading' : undefined,
    role: 'button',
    state: { 
      disabled: disabled || loading 
    },
  });

  // Validate touch target size for accessibility
  const minTouchTarget = 44;
  const buttonHeight = size === 'small' ? 36 : size === 'large' ? 56 : 48;
  const needsPadding = buttonHeight < minTouchTarget;

  return (
    <Animated.View
      style={[
        getButtonStyle(),
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          minHeight: needsPadding ? minTouchTarget : undefined,
          justifyContent: needsPadding ? 'center' : undefined,
        },
      ]}
    >
      <TouchableOpacity
        onPress={(event) => {
          accessibility.provideHapticFeedback('light');
          onPress?.(event);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.buttonContent,
          {
            minHeight: needsPadding ? minTouchTarget : undefined,
          }
        ]}
        {...accessibilityProps}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText variant="inverse" size="sm">Loading...</ThemedText>
          </View>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons name={icon as any} size={16} color={getTextColor()} style={styles.buttonIcon} />
            )}
            <ThemedText
              variant={variant === 'ghost' ? 'primary' : 'inverse'}
              weight="medium"
              size={size === 'small' ? 'sm' : 'base'}
              style={styles.buttonText}
            >
              {title}
            </ThemedText>
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon as any} size={16} color={getTextColor()} style={styles.buttonIcon} />
            )}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================================================
// ENHANCED ENTERPRISE INPUT COMPONENT
// ============================================================================

interface EnterpriseInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: 'default' | 'compact' | 'search';
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  error?: string;
  icon?: string;
  onIconPress?: () => void;
  style?: any;
}

export const EnterpriseInput: React.FC<EnterpriseInputProps> = ({
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  error,
  icon,
  onIconPress,
  style,
}) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius } = theme;
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const getInputStyle = () => {
    const baseStyle = {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      fontSize: 14,
      color: colors.text.primary,
      backgroundColor: colors.input.background,
    };

    const variantStyle = {
      default: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
      },
      compact: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
      },
      search: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        paddingLeft: spacing[8], // Space for search icon
      },
    };

    const stateStyle = {
      borderColor: error ? colors.accent.error : isFocused ? colors.accent.primary : colors.input.border,
    };

    return {
      ...baseStyle,
      ...variantStyle[variant],
      ...stateStyle,
      opacity: disabled ? 0.5 : 1,
    };
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        {variant === 'search' && (
          <Ionicons
            name="search"
            size={16}
            color={colors.text.tertiary}
            style={styles.searchIcon}
          />
        )}
        <TextInput
          ref={inputRef}
          style={[getInputStyle(), style]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {icon && (
          <TouchableOpacity
            onPress={onIconPress}
            style={styles.inputIcon}
            activeOpacity={0.7}
          >
            <Ionicons name={icon as any} size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ThemedText variant="error" size="sm" style={styles.errorText}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

// ============================================================================
// ENHANCED ENTERPRISE MODAL COMPONENT
// ============================================================================

interface EnterpriseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  variant?: 'default' | 'sheet' | 'fullscreen';
  style?: any;
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  variant = 'default',
  style,
}) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows } = theme;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getModalStyle = () => {
    const baseStyle = {
      backgroundColor: colors.background.modal,
      borderRadius: borderRadius.xl,
      ...shadows.lg,
    };

    switch (variant) {
      case 'sheet':
        return {
          ...baseStyle,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          maxHeight: SCREEN_HEIGHT * 0.8,
        };
      case 'fullscreen':
        return {
          ...baseStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 0,
        };
      default:
        return {
          ...baseStyle,
          margin: spacing[4],
          maxHeight: SCREEN_HEIGHT * 0.8,
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            backgroundColor: colors.background.overlay,
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            getModalStyle(),
            style,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {(title || showCloseButton) && (
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                {title && (
                  <ThemedText variant="primary" weight="bold" size="lg">
                    {title}
                  </ThemedText>
                )}
                {subtitle && (
                  <ThemedText variant="tertiary" size="sm" style={styles.modalSubtitle}>
                    {subtitle}
                  </ThemedText>
                )}
              </View>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeButton, { backgroundColor: colors.accent.primary + '20' }]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color={colors.accent.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ============================================================================
// ENHANCED ENTERPRISE LIST ITEM COMPONENT
// ============================================================================

interface EnterpriseListItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'interactive';
  rightElement?: React.ReactNode;
  disabled?: boolean;
  style?: any;
}

export const EnterpriseListItem: React.FC<EnterpriseListItemProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
  variant = 'default',
  rightElement,
  disabled = false,
  style,
}) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius } = theme;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (variant === 'interactive' && !disabled) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (variant === 'interactive' && !disabled) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getItemStyle = () => {
    const baseStyle = {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.card.border,
      backgroundColor: colors.card.background,
    };

    const variantStyle = {
      default: {
        padding: spacing[4],
        marginBottom: spacing[3],
      },
      compact: {
        padding: spacing[3],
        marginBottom: spacing[2],
      },
      interactive: {
        padding: spacing[4],
        marginBottom: spacing[3],
      },
    };

    return {
      ...baseStyle,
      ...variantStyle[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const ListContainer = variant === 'interactive' ? TouchableOpacity : View;

  return (
    <Animated.View
      style={[
        getItemStyle(),
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <ListContainer
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={styles.listItemContent}
      >
        {icon && (
          <View style={[styles.listItemIcon, { backgroundColor: (iconColor || colors.accent.primary) + '20' }]}>
            <Ionicons name={icon as any} size={20} color={iconColor || colors.accent.primary} />
          </View>
        )}
        <View style={styles.listItemText}>
          <ThemedText variant="primary" weight="medium" size="base">
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText variant="tertiary" size="sm" style={styles.listItemSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
        {rightElement && (
          <View style={styles.listItemRight}>
            {rightElement}
          </View>
        )}
      </ListContainer>
    </Animated.View>
  );
};

// ============================================================================
// STYLES - OPTIMIZED FOR PERFORMANCE AND CONSISTENCY
// ============================================================================

const styles = StyleSheet.create({
  // Header Styles
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
    marginTop: 2,
  },

  // Card Styles
  cardContent: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  // Button Styles
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Input Styles
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -8,
    zIndex: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
    zIndex: 1,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalSubtitle: {
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // List Item Styles
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
  },
  listItemSubtitle: {
    marginTop: 2,
  },
  listItemRight: {
    marginLeft: 8,
  },
});

export {
  EnterpriseHeader,
  EnterpriseCard,
  EnterpriseButton,
  EnterpriseInput,
  EnterpriseModal,
  EnterpriseListItem,
}; 