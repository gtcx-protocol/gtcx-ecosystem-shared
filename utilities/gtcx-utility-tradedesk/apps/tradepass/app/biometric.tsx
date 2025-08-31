import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

export default function BiometricScreen() {
  return (
    <Layout headerTitle="Biometric Setup" showBackButton={true}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Ionicons name="finger-print" size={48} color="#10b981" />
            <Text style={styles.cardTitle}>Fingerprint Authentication</Text>
            <Text style={styles.cardSubtitle}>
              Set up fingerprint recognition for secure access
            </Text>
            <TradePassButton
              title="Configure Fingerprint"
              icon="finger-print"
              variant="primary"
              size="medium"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // TODO: Implement fingerprint configuration
                console.log('Configure Fingerprint pressed');
              }}
            />
          </View>

          <View style={styles.card}>
            <Ionicons name="person" size={48} color="#3b82f6" />
            <Text style={styles.cardTitle}>Face ID Authentication</Text>
            <Text style={styles.cardSubtitle}>
              Set up facial recognition for secure access
            </Text>
            <TradePassButton
              title="Configure Face ID"
              icon="person"
              variant="primary"
              size="medium"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // TODO: Implement Face ID configuration
                console.log('Configure Face ID pressed');
              }}
            />
          </View>

          <View style={styles.card}>
            <Ionicons name="shield-checkmark" size={48} color="#f59e0b" />
            <Text style={styles.cardTitle}>Security Settings</Text>
            <Text style={styles.cardSubtitle}>
              Configure biometric security preferences
            </Text>
            <TradePassButton
              title="Security Settings"
              icon="shield-checkmark"
              variant="warning"
              size="medium"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // TODO: Implement security settings
                console.log('Security Settings pressed');
              }}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 