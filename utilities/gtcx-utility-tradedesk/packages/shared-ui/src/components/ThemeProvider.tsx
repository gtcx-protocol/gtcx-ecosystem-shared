// ============================================================================
// GEOTAG™ THEME PROVIDER - DARK MODE & WORLD-CLASS AESTHETICS
// Provides theme context and manages dark/light mode throughout the app
// ============================================================================

import React, { createContext, useContext, useEffect } from 'react';
import { StatusBar, useColorScheme, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useAppTheme, DARK_THEME, LIGHT_THEME } from '@/store/theme';

// ============================================================================
// THEME CONTEXT
// ============================================================================

interface ThemeContextType {
  isDark: boolean;
  theme: typeof DARK_THEME;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const { isDark, theme, toggleTheme, setDarkMode } = useAppTheme();

  // Auto-detect system theme on app launch
  useEffect(() => {
    if (colorScheme) {
      setDarkMode(colorScheme === 'dark');
    }
  }, [colorScheme, setDarkMode]);

  // Update status bar based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    StatusBar.setBackgroundColor(isDark ? '#000000' : '#ffffff');
  }, [isDark]);

  const contextValue: ThemeContextType = {
    isDark,
    theme,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// THEME HOOK
// ============================================================================

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// ============================================================================
// THEME-AWARE COMPONENTS
// ============================================================================

// Theme-aware Text component
export const ThemedText: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
}> = ({ children, style, variant = 'primary', size = 'base', weight = 'normal' }) => {
  const { theme } = useThemeContext();
  const { colors, typography } = theme;

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'tertiary':
        return colors.text.tertiary;
      case 'disabled':
        return colors.text.disabled;
      case 'inverse':
        return colors.text.inverse;
      default:
        return colors.text.primary;
    }
  };

  const textStyle = {
    color: getTextColor(),
    fontSize: typography.fontSize[size],
    fontWeight: typography.fontWeight[weight],
    ...style,
  };

  return <Text style={textStyle}>{children}</Text>;
};

// Theme-aware View component
export const ThemedView: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'card' | 'elevated';
}> = ({ children, style, variant = 'primary' }) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows } = theme;

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.background.primary;
      case 'secondary':
        return colors.background.secondary;
      case 'tertiary':
        return colors.background.tertiary;
      case 'card':
        return colors.card.background;
      case 'elevated':
        return colors.card.elevated;
      default:
        return colors.background.primary;
    }
  };

  const viewStyle = {
    backgroundColor: getBackgroundColor(),
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.base,
    ...style,
  };

  return <View style={viewStyle}>{children}</View>;
};

// Theme-aware Button component
export const ThemedButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  disabled?: boolean;
}> = ({ children, onPress, style, variant = 'primary', disabled = false }) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows, typography } = theme;

  const getButtonStyle = () => {
    const baseStyle = {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      borderRadius: borderRadius.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...shadows.sm,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: colors.button.disabled,
        opacity: 0.5,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.button.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.button.secondary,
        };
      case 'tertiary':
        return {
          ...baseStyle,
          backgroundColor: colors.button.tertiary,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.button.danger,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border.primary,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.button.primary,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.disabled;
    
    switch (variant) {
      case 'ghost':
        return colors.text.primary;
      default:
        return colors.text.inverse;
    }
  };

  const buttonStyle = getButtonStyle();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ color: textColor, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

// Theme-aware Card component
export const ThemedCard: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'base' | 'elevated';
}> = ({ children, style, variant = 'base' }) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows } = theme;

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.card.background,
      borderRadius: borderRadius.xl,
      padding: spacing[6],
      borderWidth: 1,
      borderColor: colors.card.border,
    };

    switch (variant) {
      case 'base':
        return {
          ...baseStyle,
          ...shadows.base,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colors.card.elevated,
          ...shadows.md,
        };
      default:
        return {
          ...baseStyle,
          ...shadows.base,
        };
    }
  };

  const cardStyle = getCardStyle();

  return <View style={[cardStyle, style]}>{children}</View>;
};

// Theme-aware Input component
export const ThemedInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}> = ({ placeholder, value, onChangeText, style, secureTextEntry, keyboardType = 'default' }) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius, shadows, typography } = theme;

  const inputStyle = {
    backgroundColor: colors.input.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.input.border,
    fontSize: typography.fontSize.base,
    color: colors.input.text,
    ...style,
  };

  return (
    <TextInput
      style={inputStyle}
      placeholder={placeholder}
      placeholderTextColor={colors.input.placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ThemeProvider; 