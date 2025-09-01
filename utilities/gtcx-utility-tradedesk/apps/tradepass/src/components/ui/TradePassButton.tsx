// ============================================================================
// TRADEPASS™ UNIFIED BUTTON COMPONENT
// Enterprise-grade button with consistent styling across all screens
// ============================================================================

// React import removed - handled by JSX transform
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TradePassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const TradePassButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: TradePassButtonProps) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    // Haptic feedback for enterprise feel
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: '#10b981' },
          text: { color: '#ffffff' },
        };
      case 'secondary':
        return {
          container: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
          text: { color: '#f1f5f9' },
        };
      case 'danger':
        return {
          container: { backgroundColor: '#ef4444' },
          text: { color: '#ffffff' },
        };
      case 'success':
        return {
          container: { backgroundColor: '#22c55e' },
          text: { color: '#ffffff' },
        };
      case 'warning':
        return {
          container: { backgroundColor: '#f59e0b' },
          text: { color: '#ffffff' },
        };
      default:
        return {
          container: { backgroundColor: '#10b981' },
          text: { color: '#ffffff' },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
          text: { fontSize: 14, fontWeight: '600' },
        };
      case 'medium':
        return {
          container: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
          text: { fontSize: 16, fontWeight: '600' },
        };
      case 'large':
        return {
          container: { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
          text: { fontSize: 18, fontWeight: '700' },
        };
      default:
        return {
          container: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
          text: { fontSize: 16, fontWeight: '600' },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.text.fontSize}
          color={variantStyles.text.color}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

export default TradePassButton;

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: '#9ca3af',
  },
});