// import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

export default function IdentityPage() {
  return (
    <Layout headerTitle="Identity Management" showBackButton={true}>
      <ScrollView style={styles.content}>

        {/* Status */}
        <View style={styles.status}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          <Text style={styles.statusText}>✅ Identity Screen Loaded</Text>
          <Text style={styles.statusSubtext}>Navigation working successfully</Text>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Digital Identity Features</Text>
          
          <View style={styles.feature}>
            <Ionicons name="person-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Biometric Enrollment</Text>
            <Text style={styles.featureSubtext}>Fingerprint & Face ID</Text>
            <TradePassButton
              title="Setup Biometrics"
              icon="finger-print"
              variant="primary"
              size="medium"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/biometric');
              }}
              style={styles.featureButton}
            />
          </View>

          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color="#3b82f6" />
            <Text style={styles.featureText}>Document Verification</Text>
            <Text style={styles.featureSubtext}>Government ID verification</Text>
            <TradePassButton
              title="Verify Documents"
              icon="document"
              variant="secondary"
              size="medium"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/government');
              }}
              style={styles.featureButton}
            />
          </View>

          <View style={styles.feature}>
            <Ionicons name="key" size={24} color="#f59e0b" />
            <Text style={styles.featureText}>Cryptographic Keys</Text>
            <Text style={styles.featureSubtext}>Secure identity proof</Text>
            <TradePassButton
              title="Manage Keys"
              icon="key"
              variant="warning"
              size="medium"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert('Cryptographic Keys', 'Key management functionality coming soon');
              }}
              style={styles.featureButton}
            />
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  status: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
  },
  statusSubtext: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  contentSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  feature: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureButton: {
    marginTop: 12,
    marginBottom: 0,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 4,
  },
  featureSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
}); 