// ============================================================================
// TRADEPASS™ HEADER COMPONENT - APPLE-STYLE NAVIGATION
// World-class navigation header with premium Apple aesthetics
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

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: (() => void) | undefined;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  showProfile = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    router.push('/identity');
  };

  const getScreenTitle = () => {
    if (title) return title;
    
    switch (pathname) {
      case '/':
        return 'TradePass™';
      case '/gps':
        return 'GPS Tracking';
      case '/identity':
        return 'Identity';
      case '/credentials':
        return 'Credentials';
      case '/biometric':
        return 'Biometric Auth';
      case '/government':
        return 'Government';
      default:
        return 'TradePass™';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton && pathname !== '/' && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={28} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>{getScreenTitle()}</Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showProfile && (
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={handleProfilePress}
            >
              <Ionicons name="person-circle" size={32} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f2f2f7',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.29)',
    minHeight: 44,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  profileButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -6,
  },
});