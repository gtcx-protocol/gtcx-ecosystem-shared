import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Header } from './Header';
import { Footer } from './Footer';
import { SystemStatus } from './SystemStatus';
import { useThemeContext } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
  showUserInfo?: boolean;
  userName?: string;
  userRole?: string;
  showLogo?: boolean;
  showFooter?: boolean;
  showSystemStatus?: boolean;
  footerProps?: {
    showNavigation?: boolean;
    activeTab?: string;
    onTabPress?: (tab: string) => void;
    showStatus?: boolean;
    statusText?: string;
    statusColor?: string;
  };
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showBackButton = true,
  onBackPress,
  title,
  showUserInfo = true,
  userName = 'John Doe',
  userRole = 'Field Worker',
  showLogo = true,
  showFooter = false,
  showSystemStatus = true,
  footerProps = {},
}) => {
  const { theme, isDark } = useThemeContext();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.header}
        translucent
      />
      
      {/* Standard Header */}
      <Header
        showBackButton={showBackButton}
        {...(onBackPress && { onBackPress })}
        {...(title && { title })}
        showUserInfo={showUserInfo}
        userName={userName}
        userRole={userRole}
        showLogo={showLogo}
      />

      {/* Main Content */}
      <View style={[styles.content, { backgroundColor: theme.colors.background.primary }]}>
        {children}
      </View>

      {/* System Status */}
      {showSystemStatus && <SystemStatus />}

      {/* Optional Footer */}
      {showFooter && <Footer {...footerProps} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 