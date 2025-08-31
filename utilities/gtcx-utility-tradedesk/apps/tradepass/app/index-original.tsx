import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function DashboardScreen() {
  const handleNavigation = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={32} color="#10b981" />
            <Text style={styles.logoText}>TradePass™</Text>
          </View>
          <Text style={styles.subtitle}>
            Government-Grade Identity Verification
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            <Text style={styles.statusTitle}>System Status</Text>
          </View>
          <Text style={styles.statusText}>
            All systems operational. Government integration active.
          </Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Quick Access</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderLeftColor: item.color }]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.8}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={24} color="#ffffff" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <Text style={styles.activityText}>
              Biometric verification completed
            </Text>
            <Text style={styles.activityTime}>2 minutes ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
            <Text style={styles.activityText}>
              Government ID verified successfully
            </Text>
            <Text style={styles.activityTime}>1 hour ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="wallet" size={20} color="#8b5cf6" />
            <Text style={styles.activityText}>
              New credential added to wallet
            </Text>
            <Text style={styles.activityTime}>3 hours ago</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  statusCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  menuContainer: {
    margin: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  activityContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
}); 