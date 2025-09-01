# 🎨 GeoTag™ Design System Guidelines

## Enterprise-Grade Design System for Mining Compliance Platform

### 📋 Table of Contents
- [Overview](#overview)
- [Theme System](#theme-system)
- [Components](#components)
- [Accessibility Standards](#accessibility-standards)
- [Color Guidelines](#color-guidelines)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Animation & Interactions](#animation--interactions)
- [Testing Guidelines](#testing-guidelines)

---

## 🌟 Overview

The GeoTag™ design system provides a unified, enterprise-grade visual language for mining compliance applications. Built with accessibility, consistency, and world-class UX at its core.

### Key Principles
- **Enterprise Aesthetics**: Professional, polished, and trustworthy
- **WCAG 2.1 AA Compliance**: Accessible to all users
- **Consistent Experience**: Unified across all screens and interactions
- **Performance Optimized**: Smooth animations and efficient rendering
- **Role-Based UX**: Tailored experiences for different user roles

---

## 🎨 Theme System

### ThemeProvider Usage
```typescript
import { useThemeContext, ThemedText, ThemedView } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useThemeContext();
  
  return (
    <ThemedView variant="primary">
      <ThemedText variant="primary" weight="bold" size="xl">
        Enterprise Content
      </ThemedText>
    </ThemedView>
  );
}
```

### Theme Structure
```typescript
interface Theme {
  colors: {
    background: { primary, secondary, header };
    text: { primary, secondary, tertiary, inverse };
    accent: { primary, secondary };
    status: { verified, pending, error };
    card: { background, border, elevated };
    button: { primary, secondary };
    input: { background, border, text };
  };
  spacing: number[];
  borderRadius: { sm, base, md, lg, xl, '2xl' };
  shadows: { sm, base, md };
  typography: { sizes, weights };
}
```

---

## 🧩 Components

### EnterpriseComponents Library

#### EnterpriseHeader
```typescript
<EnterpriseHeader
  title="Dashboard"
  subtitle="Mining Operations Control Center"
  showBackButton={false}
  variant="hero"
/>
```

**Variants:**
- `default`: Standard header with title
- `compact`: Minimal header for secondary screens
- `elevated`: Header with enhanced shadow
- `hero`: Large header for main screens

#### EnterpriseCard
```typescript
<EnterpriseCard
  variant="interactive"
  onPress={() => navigate('/details')}
>
  <Content />
</EnterpriseCard>
```

**Variants:**
- `default`: Standard card with basic styling
- `compact`: Reduced padding for dense layouts
- `elevated`: Enhanced shadow and prominence
- `interactive`: Hover/press animations and haptics

#### EnterpriseButton
```typescript
<EnterpriseButton
  title="Start GPS Tracking"
  variant="primary"
  icon="location"
  onPress={handleStartTracking}
/>
```

**Variants:**
- `primary`: Main call-to-action buttons
- `secondary`: Supporting actions
- `tertiary`: Subtle actions
- `danger`: Destructive actions
- `ghost`: Text-only buttons
- `compact`: Smaller buttons for tight spaces

**Sizes:** `small`, `medium`, `large`

#### EnterpriseInput
```typescript
<EnterpriseInput
  placeholder="Enter location name"
  variant="default"
  icon="search"
  error={validationError}
  onChangeText={handleTextChange}
/>
```

#### EnterpriseModal
```typescript
<EnterpriseModal
  visible={showModal}
  title="Site Details"
  subtitle="Comprehensive information"
  variant="sheet"
  onClose={handleClose}
>
  <ModalContent />
</EnterpriseModal>
```

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Text**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

#### Touch Targets
- **Minimum Size**: 44x44 points
- **Spacing**: Minimum 8 points between targets
- **Visual Feedback**: Clear hover/focus states

#### Screen Reader Support
```typescript
import { accessibility } from '@/services/accessibility';

// Generate proper accessibility props
const accessibilityProps = accessibility.generateAccessibilityProps({
  label: 'GPS tracking button',
  hint: 'Starts location tracking for current session',
  role: 'button',
  state: { disabled: false }
});
```

#### Accessibility Wrapper Components
```typescript
import { AccessibleButton, AccessibleText } from '@/components/AccessibilityWrapper';

<AccessibleButton
  label="Submit form"
  hint="Submits the current form data"
  onPress={handleSubmit}
>
  <ButtonContent />
</AccessibleButton>
```

### Testing Accessibility
```typescript
// Custom matchers available
expect(component).toHaveThemeColors(true); // Dark theme
expect(component).toHaveEnterpriseVariant('primary');
```

---

## 🎨 Color Guidelines

### Dark Theme (Primary)
```typescript
DARK_THEME = {
  colors: {
    background: {
      primary: '#000000',    // Pure black for OLED optimization
      secondary: '#0a0a0a',  // Subtle elevation
      header: '#000000',     // Consistent header
    },
    text: {
      primary: '#ffffff',    // High contrast white
      secondary: '#f1f5f9',  // Slightly dimmed
      tertiary: '#cbd5e1',   // Supporting text
      inverse: '#0f172a',    // For light backgrounds
    },
    accent: {
      primary: '#10b981',    // Emerald green (mining theme)
      secondary: '#3b82f6',  // Professional blue
    },
    status: {
      verified: '#10b981',   // Green for success
      pending: '#f59e0b',    // Amber for warnings
      error: '#ef4444',      // Red for errors
    }
  }
}
```

### Usage Guidelines
- **Primary Colors**: Main brand colors, use sparingly
- **Background Colors**: Create hierarchy and focus
- **Status Colors**: Consistent semantic meaning
- **Text Colors**: Ensure proper contrast ratios

---

## ✍️ Typography

### ThemedText Component
```typescript
<ThemedText 
  variant="primary"     // primary, secondary, tertiary, inverse
  weight="bold"         // normal, medium, bold
  size="xl"            // xs, sm, base, lg, xl, 2xl
>
  Enterprise Text
</ThemedText>
```

### Typography Scale
- **xs**: 10px - Small labels, captions
- **sm**: 12px - Supporting text, metadata
- **base**: 14px - Body text, buttons
- **lg**: 16px - Emphasized text, inputs
- **xl**: 18px - Subheadings
- **2xl**: 20px - Main headings

### Font Weights
- **normal**: 400 - Body text
- **medium**: 500 - Emphasized text
- **bold**: 700 - Headings, important content

---

## 📏 Spacing & Layout

### Spacing System
```typescript
spacing: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48]
// Usage: theme.spacing[4] = 8px
```

### Layout Guidelines
- **Consistent Margins**: Use spacing scale values
- **Content Padding**: 16-20px standard
- **Component Spacing**: 12-16px between related elements
- **Section Spacing**: 24-32px between major sections

### Border Radius
```typescript
borderRadius: {
  sm: 4,    // Small elements
  base: 6,  // Default
  md: 8,    // Cards, buttons
  lg: 12,   // Prominent elements
  xl: 16,   // Large components
  '2xl': 20 // Hero elements
}
```

---

## ✨ Animation & Interactions

### Animation Principles
- **Subtle**: Enhance without distracting
- **Responsive**: 60fps smooth animations
- **Purposeful**: Guide user attention
- **Accessible**: Respect motion preferences

### Standard Durations
- **Micro-interactions**: 100ms
- **Component transitions**: 200ms
- **Screen transitions**: 300ms
- **Loading states**: 500ms+

### Haptic Feedback
```typescript
import { accessibility } from '@/services/accessibility';

// Provide contextual haptic feedback
await accessibility.provideHapticFeedback('light');   // General interactions
await accessibility.provideHapticFeedback('success'); // Successful actions
await accessibility.provideHapticFeedback('error');   // Error states
```

---

## 🧪 Testing Guidelines

### Theme-Aware Testing
```typescript
import { render } from '@/test/test-utils';

// Test with different themes
const { getByText } = render(<Component />, { isDark: true });
const { getByText: getLightText } = render(<Component />, { isDark: false });

expect(getByText('Test')).toBeTruthy();
expect(getLightText('Test')).toBeTruthy();
```

### Accessibility Testing
```typescript
// Validate color contrast
const contrast = accessibility.calculateColorContrast('#ffffff', '#000000');
expect(contrast.isAccessible).toBe(true);
expect(contrast.level).toBe('AAA');

// Test touch targets
expect(accessibility.validateTouchTarget(44, 44)).toBe(true);
```

### Component Testing Pattern
```typescript
describe('Component - Theme System Integration', () => {
  it('renders correctly in dark theme', () => {
    const { getByText } = render(<Component />, { isDark: true });
    expect(getByText('Content')).toBeTruthy();
  });
  
  it('renders correctly in light theme', () => {
    const { getByText } = render(<Component />, { isDark: false });
    expect(getByText('Content')).toBeTruthy();
  });
  
  it('maintains accessibility standards', () => {
    const { getByRole } = render(<Component />);
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });
});
```

---

## 📱 Implementation Examples

### Screen Template
```typescript
import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { useThemeContext, ThemedView, ThemedText } from '@/components/ThemeProvider';
import { EnterpriseHeader, EnterpriseCard } from '@/components/ui/EnterpriseComponents';

export const ExampleScreen: React.FC = () => {
  const { theme, isDark } = useThemeContext();

  return (
    <ThemedView variant="primary" style={{ flex: 1 }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background.header} 
      />
      
      <EnterpriseHeader
        title="Screen Title"
        subtitle="Screen description"
        showBackButton={true}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <EnterpriseCard variant="elevated">
          <ThemedText variant="primary" weight="bold" size="lg">
            Content Title
          </ThemedText>
          <ThemedText variant="secondary" size="base">
            Supporting content with proper theming
          </ThemedText>
        </EnterpriseCard>
      </ScrollView>
    </ThemedView>
  );
};
```

---

## 🚀 Best Practices

### DO ✅
- Use unified theme system consistently
- Implement proper accessibility props
- Test with both light and dark themes
- Follow spacing and typography scales
- Provide haptic feedback for interactions
- Use EnterpriseComponents for consistency

### DON'T ❌
- Hardcode colors or spacing values
- Ignore accessibility requirements
- Create custom components without theme support
- Skip screen reader testing
- Use animations without motion preferences
- Forget to validate touch target sizes

---

## 📞 Support & Contribution

For questions about the design system or to suggest improvements:

1. **Documentation Issues**: Create issues in the project repository
2. **Component Requests**: Follow the component development guidelines
3. **Accessibility Concerns**: All accessibility issues are high priority
4. **Theme Updates**: Ensure backward compatibility

---

**Built with ❤️ for Ghana's mining industry**
*GeoTag™ Design System v2.0 - Enterprise Mining Compliance Platform*