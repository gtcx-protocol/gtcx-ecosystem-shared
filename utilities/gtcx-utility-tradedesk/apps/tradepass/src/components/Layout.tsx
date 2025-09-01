// ============================================================================
// TRADEPASS™ LAYOUT COMPONENT - APPLE-STYLE APP STRUCTURE
// Unified layout wrapper with header/footer navigation system
// ============================================================================

// React import removed - handled by JSX transform
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  onBackPress?: (() => void) | undefined;
  showProfile?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  headerTitle,
  showBackButton,
  onBackPress,
  showProfile,
}) => {
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {showHeader && (
        <Header
          title={headerTitle || ''}
          showBackButton={showBackButton || false}
          onBackPress={onBackPress}
          showProfile={showProfile || false}
        />
      )}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {showFooter && (
        <Footer showNavigation={true} />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  content: {
    flex: 1,
  },
});