// ============================================================================
// GEOTAG™ FOOTER COMPONENT - UNIFIED THEME SYSTEM
// Professional navigation footer with enterprise aesthetics
// ============================================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext, ThemedText, ThemedView } from './ThemeProvider';

interface FooterProps {
  showNavigation?: boolean;
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  showStatus?: boolean;
  statusText?: string;
  statusColor?: string;
}

export const Footer: React.FC<FooterProps> = ({
  showNavigation = false,
  activeTab = 'home',
  onTabPress,
  showStatus = false,
  statusText = 'All systems operational',
  statusColor,
}) => {
  const { theme, isDark } = useThemeContext();
  const navigationTabs = [
    { id: 'home', icon: 'home', label: 'Home', color: theme.colors.accent.primary },
    { id: 'camera', icon: 'camera', label: 'Camera', color: theme.colors.accent.secondary },
    { id: 'gps', icon: 'navigate', label: 'GPS', color: theme.colors.status.pending },
    { id: 'analytics', icon: 'trending-up', label: 'Analytics', color: theme.colors.status.error },
    { id: 'settings', icon: 'settings', label: 'Settings', color: theme.colors.text.secondary },
  ];

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a subtle pulse animation for active tab
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim]);

  const getIconName = (tabId: string) => {
    switch (tabId) {
      case 'home':
        return 'home-outline';
      case 'camera':
        return 'camera-outline';
      case 'gps':
        return 'navigate-outline';
      case 'analytics':
        return 'trending-up-outline';
      case 'settings':
        return 'settings-outline';
      default:
        return 'home-outline';
    }
  };

  const getActiveIconName = (tabId: string) => {
    switch (tabId) {
      case 'home':
        return 'home';
      case 'camera':
        return 'camera';
      case 'gps':
        return 'navigate';
      case 'analytics':
        return 'trending-up';
      case 'settings':
        return 'settings';
      default:
        return 'home';
    }
  };

  const handleTabPress = (tabId: string) => {
    // Add haptic feedback and animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onTabPress) {
      onTabPress(tabId);
    }
  };

  if (!showNavigation && !showStatus) {
    return null;
  }

  return (
    <ThemedView variant="header" style={[styles.footer, { borderTopColor: theme.colors.card.border }]}>
      {/* Status Bar */}
      {showStatus && (
        <ThemedView variant="secondary" style={styles.statusBar}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor || theme.colors.status.verified }]} />
          <ThemedText variant="tertiary" size="xs" style={styles.statusText}>
            {statusText}
          </ThemedText>
        </ThemedView>
      )}

      {/* Navigation Tabs */}
      {showNavigation && (
        <View style={styles.navigation}>
          {navigationTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const iconName = isActive ? getActiveIconName(tab.id) : getIconName(tab.id);
            const inactiveColor = theme.colors.text.tertiary;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabButton}
                onPress={() => handleTabPress(tab.id)}
                activeOpacity={0.7}
              >
                <Animated.View style={[
                  styles.tabContent,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: isActive ? 1 : 0.7,
                  }
                ]}>
                  <Ionicons
                    name={iconName as any}
                    size={24}
                    color={isActive ? tab.color : inactiveColor}
                  />
                  <ThemedText 
                    variant={isActive ? 'primary' : 'tertiary'} 
                    size="xs" 
                    style={[
                      styles.tabLabel,
                      { color: isActive ? tab.color : inactiveColor }
                    ]}
                  >
                    {tab.label}
                  </ThemedText>
                  
                  {isActive && (
                    <Animated.View style={[
                      styles.activeIndicator,
                      {
                        opacity: glowAnim,
                        backgroundColor: tab.color,
                      }
                    ]} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    // Styles handled by ThemedText
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
}); 