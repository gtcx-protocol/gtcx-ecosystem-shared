// ============================================================================
// GEOTAG™ ENHANCED THEME SYSTEM - WORLD-CLASS AESTHETICS
// Professional design system optimized for dark mode with superior contrast
// ============================================================================

import { Platform } from 'react-native';

// ============================================================================
// ENHANCED COLOR PALETTES - OPTIMIZED FOR DARK MODE
// ============================================================================

export const DARK_COLORS = {
  // Core Background Colors - Refined Professional Dark
  background: {
    primary: '#000000',      // Pure black - main app background
    secondary: '#0a0a0a',    // Slightly lighter - content areas
    tertiary: '#111111',     // Card backgrounds
    quaternary: '#1a1a1a',   // Elevated cards
    header: '#000000',        // Pure black header
    footer: '#000000',        // Pure black footer
    modal: '#0f0f0f',        // Modal backgrounds
    overlay: 'rgba(0,0,0,0.9)', // Overlay backgrounds
    surface: '#0d0d0d',      // Surface elements
  },

  // Enhanced Text Colors - Superior Contrast Ratios
  text: {
    primary: '#ffffff',       // Pure white - primary text (AAA contrast)
    secondary: '#f1f5f9',     // Light grey - secondary text (AA contrast)
    tertiary: '#cbd5e1',      // Muted grey - tertiary text
    disabled: '#64748b',      // Disabled text
    inverse: '#000000',       // Dark text for light backgrounds
    muted: '#94a3b8',         // Very muted text
    accent: '#fbbf24',        // Accent text for highlights
  },

  // Refined Accent Colors - Professional and Accessible
  accent: {
    primary: '#10b981',       // Emerald green - primary actions (AAA contrast)
    secondary: '#3b82f6',     // Blue - secondary actions (AA contrast)
    tertiary: '#8b5cf6',      // Purple - tertiary actions
    warning: '#f59e0b',       // Orange - warnings
    error: '#ef4444',         // Red - errors
    success: '#10b981',       // Green - success
    info: '#06b6d4',          // Cyan - info
    gold: '#fbbf24',          // Ghana gold - premium features
  },

  // Ghana Mining Theme Colors - Enhanced for Dark Mode
  ghana: {
    gold: '#fbbf24',          // Enhanced Ghana gold (better contrast)
    green: '#22c55e',         // Enhanced Ghana green
    red: '#ef4444',           // Enhanced Ghana red
    black: '#000000',         // Ghana black
    white: '#ffffff',         // Ghana white
    blue: '#1d4ed8',         // Enhanced deep blue for government
  },

  // Refined Border Colors - Subtle and Professional
  border: {
    primary: '#1e293b',       // Dark borders (better contrast)
    secondary: '#334155',     // Lighter borders
    tertiary: '#475569',      // Even lighter borders
    accent: '#10b981',        // Accent borders
    subtle: '#0f172a',        // Very subtle borders
    card: '#1e293b',          // Card borders
  },

  // Enhanced Status Colors - Clear and Professional
  status: {
    online: '#10b981',        // Online/active
    offline: '#64748b',       // Offline/inactive
    warning: '#f59e0b',       // Warning
    error: '#ef4444',         // Error
    pending: '#f59e0b',       // Pending
    verified: '#10b981',      // Verified
    certified: '#8b5cf6',     // Certified
    operational: '#10b981',   // Operational status
    maintenance: '#f59e0b',   // Maintenance status
    idle: '#64748b',          // Idle status
  },

  // GPS Accuracy Colors - Enhanced Visual Feedback
  gps: {
    excellent: '#10b981',     // < 3m accuracy
    good: '#3b82f6',          // 3-10m accuracy
    fair: '#f59e0b',          // 10-20m accuracy
    poor: '#ef4444',          // > 20m accuracy
  },

  // Refined Card Colors - Professional and Elevated
  card: {
    background: '#111111',    // Card background
    elevated: '#1a1a1a',      // Elevated card background
    border: '#1e293b',        // Card border
    shadow: 'rgba(0,0,0,0.5)', // Card shadow
    highlight: '#1e293b',     // Card highlight
    surface: '#0d0d0d',       // Card surface
  },

  // Enhanced Button Colors - Clear Action Hierarchy
  button: {
    primary: '#10b981',       // Primary button
    secondary: '#3b82f6',     // Secondary button
    tertiary: '#8b5cf6',      // Tertiary button
    danger: '#ef4444',        // Danger button
    disabled: '#64748b',      // Disabled button
    ghost: 'transparent',     // Ghost button
    success: '#10b981',       // Success button
    warning: '#f59e0b',       // Warning button
  },

  // Enhanced Input Colors - Professional and Accessible
  input: {
    background: '#0d0d0d',    // Input background
    border: '#1e293b',        // Input border
    text: '#ffffff',          // Input text
    placeholder: '#64748b',   // Placeholder text
    focused: '#10b981',       // Focused state
    error: '#ef4444',         // Error state
  },

  // Role-Specific Colors - Enhanced for Dark Mode
  roles: {
    miner: '#fbbf24',         // Small-scale miner
    inspector: '#1d4ed8',     // Government inspector
    company: '#22c55e',       // Mining company
    trader: '#a855f7',        // Gold trader
  },
};

export const LIGHT_COLORS = {
  // Core Background Colors - Clean Professional Light
  background: {
    primary: '#ffffff',       // Pure white - main app background
    secondary: '#f8fafc',     // Light grey - content areas
    tertiary: '#f1f5f9',      // Card backgrounds
    quaternary: '#e2e8f0',    // Elevated cards
    header: '#ffffff',         // Pure white header
    footer: '#ffffff',         // Pure white footer
    modal: '#ffffff',          // Modal backgrounds
    overlay: 'rgba(0,0,0,0.5)', // Overlay backgrounds
    surface: '#f8fafc',        // Surface elements
  },

  // Enhanced Text Colors - Superior Contrast Ratios for Light Mode
  text: {
    primary: '#0f172a',       // Dark text - primary text (AAA contrast)
    secondary: '#334155',     // Medium grey - secondary text (AA contrast)
    tertiary: '#64748b',      // Light grey - tertiary text
    disabled: '#94a3b8',      // Disabled text
    inverse: '#ffffff',        // Light text for dark backgrounds
    muted: '#64748b',         // Muted text
    accent: '#d97706',        // Accent text for highlights
  },

  // Refined Accent Colors - Professional and Accessible for Light Mode
  accent: {
    primary: '#059669',       // Emerald green - primary actions (AAA contrast)
    secondary: '#2563eb',     // Blue - secondary actions (AA contrast)
    tertiary: '#7c3aed',      // Purple - tertiary actions
    warning: '#d97706',       // Orange - warnings
    error: '#dc2626',         // Red - errors
    success: '#059669',       // Green - success
    info: '#0891b2',          // Cyan - info
    gold: '#d97706',          // Ghana gold - premium features
  },

  // Ghana Mining Theme Colors - Enhanced for Light Mode
  ghana: {
    gold: '#d97706',          // Enhanced Ghana gold
    green: '#16a34a',         // Enhanced Ghana green
    red: '#dc2626',           // Enhanced Ghana red
    black: '#000000',         // Ghana black
    white: '#ffffff',         // Ghana white
    blue: '#1d4ed8',         // Deep blue for government
  },

  // Refined Border Colors - Subtle and Professional for Light Mode
  border: {
    primary: '#e2e8f0',       // Light borders
    secondary: '#cbd5e1',     // Medium borders
    tertiary: '#94a3b8',      // Darker borders
    accent: '#059669',        // Accent borders
    subtle: '#f1f5f9',        // Very subtle borders
    card: '#e2e8f0',          // Card borders
  },

  // Enhanced Status Colors - Clear and Professional for Light Mode
  status: {
    online: '#059669',        // Online/active
    offline: '#64748b',       // Offline/inactive
    warning: '#d97706',        // Warning
    error: '#dc2626',         // Error
    pending: '#d97706',       // Pending
    verified: '#059669',      // Verified
    certified: '#7c3aed',     // Certified
    operational: '#059669',   // Operational status
    maintenance: '#d97706',   // Maintenance status
    idle: '#64748b',          // Idle status
  },

  // GPS Accuracy Colors - Enhanced Visual Feedback for Light Mode
  gps: {
    excellent: '#059669',     // < 3m accuracy
    good: '#2563eb',          // 3-10m accuracy
    fair: '#d97706',          // 10-20m accuracy
    poor: '#dc2626',          // > 20m accuracy
  },

  // Refined Card Colors - Professional and Elevated for Light Mode
  card: {
    background: '#ffffff',    // Card background
    elevated: '#f8fafc',      // Elevated card background
    border: '#e2e8f0',        // Card border
    shadow: 'rgba(0,0,0,0.1)', // Card shadow
    highlight: '#f1f5f9',     // Card highlight
    surface: '#ffffff',        // Card surface
  },

  // Enhanced Button Colors - Clear Action Hierarchy for Light Mode
  button: {
    primary: '#059669',       // Primary button
    secondary: '#2563eb',     // Secondary button
    tertiary: '#7c3aed',      // Tertiary button
    danger: '#dc2626',        // Danger button
    disabled: '#94a3b8',      // Disabled button
    ghost: 'transparent',     // Ghost button
    success: '#059669',       // Success button
    warning: '#d97706',       // Warning button
  },

  // Enhanced Input Colors - Professional and Accessible for Light Mode
  input: {
    background: '#ffffff',    // Input background
    border: '#e2e8f0',        // Input border
    text: '#0f172a',          // Input text
    placeholder: '#94a3b8',   // Placeholder text
    focused: '#059669',       // Focused state
    error: '#dc2626',         // Error state
  },

  // Role-Specific Colors - Enhanced for Light Mode
  roles: {
    miner: '#d97706',         // Small-scale miner
    inspector: '#1d4ed8',     // Government inspector
    company: '#16a34a',       // Mining company
    trader: '#9333ea',        // Gold trader
  },
};

// ============================================================================
// REFINED TYPOGRAPHY - OPTIMIZED FOR READABILITY
// ============================================================================

export const TYPOGRAPHY = {
  // Font Families - Professional and Consistent
  fonts: {
    primary: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System',
    }),
    secondary: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System',
    }),
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'Roboto Mono',
      default: 'Monospace',
    }),
  },

  // Font Weights - Consistent and Professional
  weights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Refined Font Sizes - Optimized for Mobile
  sizes: {
    xs: 10,      // Captions, labels
    sm: 12,      // Small text, metadata
    base: 14,    // Body text
    lg: 16,      // Subheadings
    xl: 18,      // Headings
    '2xl': 20,   // Large headings
    '3xl': 24,   // Page titles
    '4xl': 28,   // Hero titles
    '5xl': 32,   // Large hero titles
    '6xl': 36,   // Extra large titles
  },

  // Line Heights - Optimized for Readability
  lineHeights: {
    tight: 1.2,    // Headings
    normal: 1.4,   // Body text
    relaxed: 1.6,  // Long text
    loose: 1.8,    // Very long text
  },

  // Letter Spacing - Professional Typography
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// ============================================================================
// OPTIMIZED SPACING - COMPACT AND EFFICIENT
// ============================================================================

export const SPACING = {
  // Compact Spacing Scale - Optimized for Mobile
  0: 0,
  1: 2,    // 2px - Minimal spacing
  2: 4,    // 4px - Tiny spacing
  3: 6,    // 6px - Small spacing
  4: 8,    // 8px - Compact spacing
  5: 10,   // 10px - Medium spacing
  6: 12,   // 12px - Standard spacing
  7: 14,   // 14px - Comfortable spacing
  8: 16,   // 16px - Large spacing
  9: 18,   // 18px - Extra large spacing
  10: 20,  // 20px - Section spacing
  11: 24,  // 24px - Card padding
  12: 28,  // 28px - Section padding
  13: 32,  // 32px - Large section padding
  14: 36,  // 36px - Extra large padding
  15: 40,  // 40px - Hero padding
  16: 48,  // 48px - Maximum padding
};

// ============================================================================
// REFINED BORDER RADIUS - CONSISTENT AND MODERN
// ============================================================================

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,    // 4px - Small radius
  base: 6,  // 6px - Standard radius
  md: 8,    // 8px - Medium radius
  lg: 12,   // 12px - Large radius
  xl: 16,   // 16px - Extra large radius
  '2xl': 20, // 20px - Very large radius
  '3xl': 24, // 24px - Maximum radius
  full: 9999, // Full radius for circles
};

// ============================================================================
// ENHANCED SHADOWS - PROFESSIONAL DEPTH
// ============================================================================

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 24,
  },
};

// ============================================================================
// SMOOTH ANIMATIONS - POLISHED INTERACTIONS
// ============================================================================

export const ANIMATIONS = {
  // Duration Scale - Consistent Timing
  duration: {
    fast: 150,    // Quick interactions
    normal: 250,  // Standard animations
    slow: 350,    // Smooth transitions
    slower: 500,  // Complex animations
    slowest: 750, // Hero animations
  },

  // Easing Functions - Professional Curves
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom easing for premium feel
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Scale Values - Consistent Transformations
  scale: {
    none: 1,
    sm: 0.95,
    base: 0.98,
    lg: 1.02,
    xl: 1.05,
    '2xl': 1.1,
  },

  // Opacity Values - Smooth Transitions
  opacity: {
    none: 0,
    sm: 0.25,
    base: 0.5,
    lg: 0.75,
    xl: 0.9,
    full: 1,
  },
};

// ============================================================================
// COMPACT COMPONENT STYLES - OPTIMIZED FOR EFFICIENCY
// ============================================================================

export const COMPONENT_STYLES = {
  // Compact Button Styles - Professional and Efficient
  button: {
    primary: {
      backgroundColor: DARK_COLORS.accent.primary,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: 16,  // Reduced from 24
      paddingVertical: 10,    // Reduced from 12
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.sm,
    },
    secondary: {
      backgroundColor: DARK_COLORS.background.secondary,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: 16,  // Reduced from 24
      paddingVertical: 10,    // Reduced from 12
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.sm,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: 16,  // Reduced from 24
      paddingVertical: 10,    // Reduced from 12
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: DARK_COLORS.border.primary,
    },
    compact: {
      backgroundColor: DARK_COLORS.accent.primary,
      borderRadius: BORDER_RADIUS.base,
      paddingHorizontal: 12,  // Very compact
      paddingVertical: 8,     // Very compact
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.sm,
    },
  },

  // Compact Card Styles - Professional and Elevated
  card: {
    base: {
      backgroundColor: DARK_COLORS.card.background,
      borderRadius: BORDER_RADIUS.xl,
      padding: 16,            // Reduced from 24
      ...SHADOWS.base,
      borderWidth: 1,
      borderColor: DARK_COLORS.card.border,
    },
    elevated: {
      backgroundColor: DARK_COLORS.card.elevated,
      borderRadius: BORDER_RADIUS.xl,
      padding: 16,            // Reduced from 24
      ...SHADOWS.md,
      borderWidth: 1,
      borderColor: DARK_COLORS.card.border,
    },
    compact: {
      backgroundColor: DARK_COLORS.card.background,
      borderRadius: BORDER_RADIUS.lg,
      padding: 12,            // Very compact
      ...SHADOWS.sm,
      borderWidth: 1,
      borderColor: DARK_COLORS.card.border,
    },
  },

  // Compact Input Styles - Professional and Accessible
  input: {
    base: {
      backgroundColor: DARK_COLORS.input.background,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: 12,  // Reduced from 16
      paddingVertical: 10,    // Reduced from 12
      borderWidth: 1,
      borderColor: DARK_COLORS.input.border,
      fontSize: TYPOGRAPHY.fontSize.base,
      color: DARK_COLORS.input.text,
    },
    focused: {
      borderColor: DARK_COLORS.accent.primary,
      ...SHADOWS.sm,
    },
    compact: {
      backgroundColor: DARK_COLORS.input.background,
      borderRadius: BORDER_RADIUS.base,
      paddingHorizontal: 10,  // Very compact
      paddingVertical: 8,     // Very compact
      borderWidth: 1,
      borderColor: DARK_COLORS.input.border,
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: DARK_COLORS.input.text,
    },
  },

  // Header Styles - Consistent and Professional
  header: {
    base: {
      backgroundColor: DARK_COLORS.background.header,
      paddingHorizontal: 16,
      paddingVertical: 12,    // Reduced from 16
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: DARK_COLORS.border.primary,
    },
    compact: {
      backgroundColor: DARK_COLORS.background.header,
      paddingHorizontal: 12,
      paddingVertical: 8,     // Very compact
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: DARK_COLORS.border.primary,
    },
  },

  // List Item Styles - Compact and Efficient
  listItem: {
    base: {
      backgroundColor: DARK_COLORS.card.background,
      borderRadius: BORDER_RADIUS.lg,
      padding: 12,            // Reduced from 16
      marginBottom: 8,        // Reduced from 12
      borderWidth: 1,
      borderColor: DARK_COLORS.card.border,
    },
    compact: {
      backgroundColor: DARK_COLORS.card.background,
      borderRadius: BORDER_RADIUS.base,
      padding: 8,             // Very compact
      marginBottom: 6,        // Very compact
      borderWidth: 1,
      borderColor: DARK_COLORS.card.border,
    },
  },
};

// ============================================================================
// RESPONSIVE BREAKPOINTS - MOBILE-FIRST
// ============================================================================

export const BREAKPOINTS = {
  // Mobile-First Breakpoints - Optimized for Mobile
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export interface Theme {
  colors: typeof DARK_COLORS;
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  animations: typeof ANIMATIONS;
  componentStyles: typeof COMPONENT_STYLES;
  breakpoints: typeof BREAKPOINTS;
  isDark: boolean;
  isLight: boolean;
}

// ============================================================================
// THEME EXPORTS - ENHANCED FOR DARK MODE
// ============================================================================

export const DARK_THEME: Theme = {
  colors: DARK_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  componentStyles: COMPONENT_STYLES,
  breakpoints: BREAKPOINTS,
  isDark: true,
  isLight: false,
};

export const LIGHT_THEME: Theme = {
  colors: LIGHT_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  componentStyles: COMPONENT_STYLES,
  breakpoints: BREAKPOINTS,
  isDark: false,
  isLight: true,
};

// ============================================================================
// UTILITY FUNCTIONS - ENHANCED FOR PERFORMANCE
// ============================================================================

export const getTheme = (isDark: boolean = true): Theme => {
  return isDark ? DARK_THEME : LIGHT_THEME;
};

export const getColors = (isDark: boolean = true) => {
  return isDark ? DARK_COLORS : LIGHT_COLORS;
};

export const getCSSVariables = (isDark: boolean = true) => {
  const colors = getColors(isDark);
  return {
    '--background-primary': colors.background.primary,
    '--background-secondary': colors.background.secondary,
    '--text-primary': colors.text.primary,
    '--text-secondary': colors.text.secondary,
    '--accent-primary': colors.accent.primary,
    '--accent-secondary': colors.accent.secondary,
  };
}; 