// ============================================================================
// GEOTAG™ HEADER COMPONENT - ENTERPRISE-GRADE NAVIGATION
// Unified theme system with consistent branding and UX
// ============================================================================

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Logo } from './Logo';
import { useThemeContext, ThemedText, ThemedView } from './ThemeProvider';
import { EnterpriseModal } from './ui/EnterpriseComponents';
import { useUser } from '@/store/user';

interface HeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
  showUserInfo?: boolean;
  userName?: string;
  userRole?: string;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  onBackPress,
  title,
  showUserInfo = true,
  userName = 'John Doe',
  userRole = 'Field Worker',
  showLogo = true,
}) => {
  const router = useRouter();
  const { theme, isDark } = useThemeContext();
  const { user, isAuthenticated, logout } = useUser();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      // Check if we can go back, otherwise go to home
      try {
        router.back();
      } catch (error) {
        // If back navigation fails, go to home
        router.push('/');
      }
    }
  };

  const handleUserPress = () => {
    if (isAuthenticated) {
      setShowUserMenu(true);
    } else {
      router.push('/auth');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const displayUser = user || { name: userName, role: userRole, avatar: undefined, email: '' };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.header}
        translucent
      />
      <ThemedView variant="header" style={[styles.header, { borderBottomColor: theme.colors.card.border }]}>
        {/* GEOTAG Logo on the left */}
        <View style={styles.geotagLogoContainer}>
          <Logo size="small" showText={false} color={theme.colors.text.primary} type="geotag" />
        </View>

        {/* Center GTCX Logo */}
        <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/')}>
          {title ? (
            <ThemedText variant="primary" weight="bold" size="lg" style={styles.titleText}>
              {title}
            </ThemedText>
          ) : showLogo ? (
            <Logo size="medium" showText={false} color={theme.colors.text.primary} />
          ) : null}
        </TouchableOpacity>

        {/* User Photo on the right */}
        {isAuthenticated ? (
          <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
            <Image 
              source={displayUser.avatar || require('@/assets/user-avatar-photo.png')} 
              style={[styles.userAvatar, { borderColor: theme.colors.card.border }]}
            />
            {showUserInfo && (
              <View style={styles.userDetails}>
                <ThemedText variant="primary" weight="bold" size="xs" style={styles.userName}>
                  {displayUser.name}
                </ThemedText>
                <ThemedText variant="tertiary" size="xs" style={styles.userRole}>
                  {displayUser.role}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.authButton, { backgroundColor: theme.colors.card.background }]} onPress={() => router.push('/auth')}>
            <Ionicons name="person" size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* User Menu Modal */}
      <EnterpriseModal
        visible={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        title="User Menu"
        subtitle={displayUser.name}
        variant="sheet"
      >
        <View style={styles.modalContent}>
          <View style={[styles.menuHeader, { borderBottomColor: theme.colors.card.border }]}>
            <Image 
              source={displayUser.avatar || require('@/assets/user-avatar-photo.png')} 
              style={[styles.menuAvatar, { borderColor: theme.colors.card.border }]}
            />
            <View style={styles.menuUserInfo}>
              <ThemedText variant="primary" weight="bold" size="base" style={styles.menuUserName}>
                {displayUser.name}
              </ThemedText>
              <ThemedText variant="secondary" size="sm" style={styles.menuUserEmail}>
                {displayUser.email}
              </ThemedText>
              <ThemedText variant="tertiary" size="sm" style={styles.menuUserRole}>
                {displayUser.role}
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setShowUserMenu(false);
            router.push('/settings');
          }}>
            <Ionicons name="settings" size={20} color={theme.colors.text.secondary} />
            <ThemedText variant="primary" size="base" style={styles.menuItemText}>
              Settings
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setShowUserMenu(false);
            router.push('/profile');
          }}>
            <Ionicons name="person" size={20} color={theme.colors.text.secondary} />
            <ThemedText variant="primary" size="base" style={styles.menuItemText}>
              Profile
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            setShowUserMenu(false);
            router.push('/help');
          }}>
            <Ionicons name="help-circle" size={20} color={theme.colors.text.secondary} />
            <ThemedText variant="primary" size="base" style={styles.menuItemText}>
              Help & Support
            </ThemedText>
          </TouchableOpacity>
          
          <View style={[styles.menuDivider, { backgroundColor: theme.colors.card.border }]} />
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={theme.colors.status.error} />
            <ThemedText variant="primary" size="base" style={[styles.logoutText, { color: theme.colors.status.error }]}>
              Sign Out
            </ThemedText>
          </TouchableOpacity>
        </View>
      </EnterpriseModal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  geotagLogoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoContainer: {
    flex: 2,
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
  },
  userDetails: {
    alignItems: 'flex-end',
  },
  userName: {
    // Styles handled by ThemedText
  },
  userRole: {
    // Styles handled by ThemedText
  },
  authButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  menuAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    marginBottom: 4,
  },
  menuUserEmail: {
    marginBottom: 4,
  },
  menuUserRole: {
    // Styles handled by ThemedText
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemText: {
    marginLeft: 16,
  },
  menuDivider: {
    height: 1,
    marginVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    marginLeft: 16,
  },
}); 