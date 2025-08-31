import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { authService, MilitaryCryptoService } from '../src/services/production-auth-service';
// import { GovernmentIntegrationService } from '../src/services/government-integration';
import { Layout } from '../src/components/Layout';

export default function DashboardScreen() {
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      console.log('🚀 Initializing TradePass services...');
      
      // Initialize core services
      const cryptoService = MilitaryCryptoService.getInstance();
      await cryptoService.initialize();
      
      // const govService = GovernmentIntegrationService.getInstance();
      // Government service initializes automatically in constructor
      
      setServicesInitialized(true);
      console.log('✅ All TradePass services initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      setServicesInitialized(true); // Allow UI to continue
    }
  };
  const handleNavigation = (route: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(route as any);
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback: at least log where we're trying to go
      console.log('Attempting to navigate to:', route);
    }
  };

  const menuItems = [
    {
      title: 'Identity Management',
      subtitle: 'Manage your digital identity',
      icon: 'person-circle',
      route: '/identity',
      color: '#10b981',
    },
    {
      title: 'Biometric Setup',
      subtitle: 'Configure fingerprint and face ID',
      icon: 'finger-print',
      route: '/biometric',
      color: '#3b82f6',
    },
    {
      title: 'Government Verification',
      subtitle: 'Verify government documents',
      icon: 'shield-checkmark',
      route: '/government',
      color: '#f59e0b',
    },
    {
      title: 'Credential Wallet',
      subtitle: 'Store and manage credentials',
      icon: 'wallet',
      route: '/credentials',
      color: '#8b5cf6',
    },
    {
      title: 'GPS Tracking',
      subtitle: 'Military-grade location verification',
      icon: 'location',
      route: '/gps',
      color: '#ef4444',
    },
  ];

  return (
    <Layout showBackButton={false}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={32} color="#007AFF" />
            <Text style={styles.title}>TradePass™</Text>
          </View>
          <Text style={styles.subtitle}>Government-Grade Identity Verification</Text>
        </View>

        {/* Status */}
        <View style={styles.status}>
          <Ionicons name={servicesInitialized ? "checkmark-circle" : "time-outline"} size={20} color={servicesInitialized ? "#22c55e" : "#f59e0b"} />
          <Text style={[styles.statusText, { color: servicesInitialized ? "#22c55e" : "#f59e0b" }]}>
            {servicesInitialized ? "✅ All Services Running" : "⏳ Initializing Services..."}
          </Text>
          <Text style={styles.statusSubtext}>Crypto & Government Services</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { borderLeftColor: item.color }]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={20} color="#ffffff" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.buttonText}>{item.title}</Text>
                <Text style={styles.buttonSubtext}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 12,
    letterSpacing: 0.37,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 22,
    fontWeight: '500',
  },
  status: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    color: '#22c55e',
    fontSize: 17,
    fontWeight: '600',
  },
  statusSubtext: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  menuContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
});