# Standardized Layout System

## Overview

The app now uses a standardized layout system with consistent header and footer components. This ensures:
- ✅ **Zero spacing issues** - No duplicate headers or unwanted spacing
- ✅ **Consistent design** - Same header/footer across all screens
- ✅ **Best practices** - Proper component separation and reusability
- ✅ **Easy maintenance** - Single place to update header/footer styling

## Components

### 1. Layout Component
The main wrapper that provides consistent structure:

```typescript
import { Layout } from '@/components/Layout';

<Layout
  showBackButton={true}
  title="Screen Title"
  showUserInfo={true}
  userName="John Doe"
  userRole="Field Worker"
  showLogo={true}
  showFooter={true}
  footerProps={{
    showNavigation: true,
    activeTab: 'home',
    showStatus: true,
    statusText: 'System Online',
    statusColor: '#10b981',
  }}
>
  {/* Your screen content here */}
</Layout>
```

### 2. Header Component
Standardized header with logo, navigation, and user info:

**Features:**
- Black background with consistent styling
- Zero bottom padding (no spacing issues)
- Optional back button with fallback navigation
- Logo display (image or text)
- User information display

**Props:**
- `showBackButton?: boolean` - Show/hide back button
- `onBackPress?: () => void` - Custom back handler
- `title?: string` - Screen title (overrides logo)
- `showUserInfo?: boolean` - Show user info
- `userName?: string` - User name
- `userRole?: string` - User role
- `showLogo?: boolean` - Show logo (when no title)

### 3. Footer Component
Standardized footer with navigation and status:

**Features:**
- Optional navigation tabs
- Status indicator
- Consistent styling with header
- Default navigation to main screens

**Props:**
- `showNavigation?: boolean` - Show navigation tabs
- `activeTab?: string` - Currently active tab
- `onTabPress?: (tab: string) => void` - Custom tab handler
- `showStatus?: boolean` - Show status bar
- `statusText?: string` - Status message
- `statusColor?: string` - Status color

## Usage Examples

### Basic Screen (No Footer)
```typescript
<Layout
  title="Camera"
  showUserInfo={true}
>
  <CameraView />
</Layout>
```

### Screen with Navigation Footer
```typescript
<Layout
  title="GPS Tracking"
  showFooter={true}
  footerProps={{
    showNavigation: true,
    activeTab: 'gps',
    showStatus: true,
    statusText: 'GPS Active',
    statusColor: '#10b981',
  }}
>
  <GPSView />
</Layout>
```

### Home Screen (No Back Button, with Footer)
```typescript
<Layout
  showBackButton={false}
  showUserInfo={false}
  showFooter={true}
  footerProps={{
    showNavigation: true,
    activeTab: 'home',
    showStatus: true,
    statusText: 'All systems operational',
  }}
>
  <HomeContent />
</Layout>
```

## Migration Guide

### From Old Header Usage
**Before:**
```typescript
<View style={styles.container}>
  <StatusBar barStyle="light-content" />
  <Header showBackButton={true} title="Screen" />
  <ScrollView>
    {/* content */}
  </ScrollView>
</View>
```

**After:**
```typescript
<Layout title="Screen">
  <ScrollView>
    {/* content */}
  </ScrollView>
</Layout>
```

### Benefits of New System

1. **No More Spacing Issues**
   - Layout handles all spacing automatically
   - No duplicate headers or unwanted gaps

2. **Consistent Design**
   - Same header/footer across all screens
   - Easy to update styling globally

3. **Better Performance**
   - Optimized component structure
   - Proper SafeAreaView handling

4. **Easier Maintenance**
   - Single place to update header/footer
   - Clear separation of concerns

## File Structure

```
src/components/
├── Layout.tsx      # Main layout wrapper
├── Header.tsx      # Standardized header
├── Footer.tsx      # Standardized footer
└── Logo.tsx        # Logo component
```

## Best Practices

1. **Always use Layout component** for new screens
2. **Don't manually add StatusBar** - Layout handles it
3. **Use footerProps for footer configuration** instead of custom footer content
4. **Keep screen content focused** on business logic, not layout concerns
5. **Use consistent prop patterns** across all screens

## Migration Checklist

- [ ] Update all screens to use `Layout` component
- [ ] Remove manual `StatusBar` components
- [ ] Remove manual `Header` components
- [ ] Remove manual container styling
- [ ] Test spacing and navigation on all screens
- [ ] Verify logo display consistency
- [ ] Test footer navigation functionality 