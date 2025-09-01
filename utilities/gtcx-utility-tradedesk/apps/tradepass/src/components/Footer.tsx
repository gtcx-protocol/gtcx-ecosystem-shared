// ============================================================================
// TRADEPASS™ FOOTER COMPONENT - APPLE-STYLE TAB NAVIGATION
// iOS-inspired tab bar with professional mining industry theming
// ============================================================================

// React import removed - handled by JSX transform
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface FooterProps {
  showNavigation?: boolean;
}

interface TabItem {
  id: string;
  route: string;
  icon: string;
  activeIcon: string;
  label: string;
  color: string;
}

export const Footer: React.FC<FooterProps> = ({
  showNavigation = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationTabs: TabItem[] = [
    {
      id: 'home',
      route: '/',
      icon: 'home-outline',
      activeIcon: 'home',
      label: 'Home',
      color: '#007AFF',
    },
    {
      id: 'gps',
      route: '/gps',
      icon: 'navigate-outline',
      activeIcon: 'navigate',
      label: 'GPS',
      color: '#34C759',
    },
    {
      id: 'identity',
      route: '/identity',
      icon: 'person-outline',
      activeIcon: 'person',
      label: 'Identity',
      color: '#FF9500',
    },
    {
      id: 'credentials',
      route: '/credentials',
      icon: 'document-outline',
      activeIcon: 'document',
      label: 'Docs',
      color: '#5856D6',
    },
    {
      id: 'biometric',
      route: '/biometric',
      icon: 'finger-print-outline',
      activeIcon: 'finger-print',
      label: 'Bio',
      color: '#FF3B30',
    },
  ];

  const handleTabPress = (tab: TabItem) => {
    // Add haptic feedback for premium feel
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to the selected tab
    router.push(tab.route);
  };

  if (!showNavigation) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footer}>
        <View style={styles.navigation}>
          {navigationTabs.map((tab) => {
            const isActive = pathname === tab.route;
            const iconName = isActive ? tab.activeIcon : tab.icon;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabButton}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.6}
              >
                <View style={styles.tabContent}>
                  <Ionicons
                    name={iconName as any}
                    size={isActive ? 28 : 24}
                    color={isActive ? tab.color : '#8E8E93'}
                  />
                  <Text style={[
                    styles.tabLabel,
                    {
                      color: isActive ? tab.color : '#8E8E93',
                      fontWeight: isActive ? '600' : '500',
                    }
                  ]}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f2f2f7',
  },
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    paddingTop: 8,
    // backdropFilter: 'blur(20px)', // iOS blur effect (not supported in RN)
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.1,
  },
});