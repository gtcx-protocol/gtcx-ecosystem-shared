import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { authService, MilitaryCryptoService, IdentityCredential } from '../src/services/production-auth-service';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

export default function CredentialsScreen() {
  const [credentials, setCredentials] = useState<IdentityCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setIsLoading(true);
      
      // Load user credentials
      const cryptoService = MilitaryCryptoService.getInstance();
      const userCredentials = await cryptoService.getUserCredentials('user123');
      setCredentials(userCredentials);
    } catch (error) {
      console.error('Failed to load credentials:', error);
      Alert.alert('Error', 'Failed to load credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCredential = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Create Credential',
      'Select the type of credential you want to create:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Government ID', onPress: () => createCredential('government_id') },
        { text: 'Biometric Template', onPress: () => createCredential('biometric_template') },
        { text: 'Compliance Certificate', onPress: () => createCredential('compliance_certificate') }
      ]
    );
  };

  const createCredential = async (type: IdentityCredential['credentialType']) => {
    try {
      setIsCreating(true);
      
      // Simulate credential creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credentialData = JSON.stringify({
        type,
        userId: 'user123',
        timestamp: Date.now(),
        metadata: {
          issuer: 'TradePass™',
          version: '1.0',
          algorithm: 'ed25519'
        }
      });
      
      const cryptoService = MilitaryCryptoService.getInstance();
      const credential = await cryptoService.createCredential('user123', type, credentialData);
      setCredentials(prev => [...prev, credential]);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Credential created successfully!');
      
    } catch (error) {
      console.error('Failed to create credential:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to create credential');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeCredential = (credentialId: string) => {
    Alert.alert(
      'Revoke Credential',
      'Are you sure you want to revoke this credential? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              const cryptoService = MilitaryCryptoService.getInstance();
              const success = await cryptoService.revokeCredential(credentialId);
              if (success) {
                setCredentials(prev => prev.filter(cred => cred.id !== credentialId));
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert('Success', 'Credential revoked successfully');
              } else {
                Alert.alert('Error', 'Failed to revoke credential');
              }
            } catch (error) {
              console.error('Failed to revoke credential:', error);
              Alert.alert('Error', 'Failed to revoke credential');
            }
          }
        }
      ]
    );
  };

  const handleExportCredential = (_credential: IdentityCredential) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Export Credential',
      'This credential will be exported as a secure digital certificate.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // Simulate export
          Alert.alert('Success', 'Credential exported successfully!');
        }}
      ]
    );
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'government_id':
        return 'card';
      case 'biometric_template':
        return 'finger-print';
      case 'compliance_certificate':
        return 'shield-checkmark';
      default:
        return 'document';
    }
  };

  const getCredentialColor = (type: string) => {
    switch (type) {
      case 'government_id':
        return '#10b981';
      case 'biometric_template':
        return '#3b82f6';
      case 'compliance_certificate':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStatusColor = (credential: IdentityCredential) => {
    if (credential.revokedAt) return '#ef4444';
    if (Date.now() > credential.expiresAt) return '#f59e0b';
    return '#22c55e';
  };

  const getStatusText = (credential: IdentityCredential) => {
    if (credential.revokedAt) return 'REVOKED';
    if (Date.now() > credential.expiresAt) return 'EXPIRED';
    return 'ACTIVE';
  };

  const renderStatusCard = () => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Ionicons name="wallet" size={24} color="#8b5cf6" />
        <Text style={styles.statusTitle}>Wallet Status</Text>
      </View>
      <Text style={styles.statusText}>
        {credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored
      </Text>
      <Text style={styles.statusText}>
        {credentials.filter(c => !c.revokedAt && Date.now() <= c.expiresAt).length} active
      </Text>
    </View>
  );

  const renderCredentials = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Digital Credentials</Text>
        <TouchableOpacity onPress={handleCreateCredential} style={styles.addButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {credentials.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={48} color="#64748b" />
          <Text style={styles.emptyStateText}>No credentials yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first digital credential to get started
          </Text>
        </View>
      ) : (
        <View style={styles.credentialsList}>
          {credentials.map((credential) => (
            <View key={credential.id} style={styles.credentialItem}>
              <View style={styles.credentialInfo}>
                <View style={[
                  styles.credentialIcon,
                  { backgroundColor: getCredentialColor(credential.credentialType) }
                ]}>
                  <Ionicons 
                    name={getCredentialIcon(credential.credentialType) as any} 
                    size={20} 
                    color="#ffffff" 
                  />
                </View>
                <View style={styles.credentialDetails}>
                  <Text style={styles.credentialType}>
                    {credential.credentialType.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.credentialId}>
                    ID: {credential.id.slice(0, 8)}...
                  </Text>
                  <Text style={styles.credentialDate}>
                    Issued: {new Date(credential.issuedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.credentialActions}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(credential) }
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {getStatusText(credential)}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => handleExportCredential(credential)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="download" size={16} color="#3b82f6" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleRevokeCredential(credential.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Actions</Text>
      
      <View style={styles.actionsContainer}>
        <TradePassButton
          title="Refresh Credentials"
          icon="refresh"
          variant="primary"
          size="medium"
          onPress={loadCredentials}
          style={styles.actionButton}
        />
        
        <TradePassButton
          title="Share Credentials"
          icon="share"
          variant="secondary"
          size="medium"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert('Share Credentials', 'Credential sharing functionality coming soon');
          }}
          style={styles.actionButton}
        />
        
        <TradePassButton
          title="Wallet Settings"
          icon="settings"
          variant="warning"
          size="medium"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert('Wallet Settings', 'Wallet configuration options coming soon');
          }}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Layout headerTitle="Credential Wallet" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading credentials...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Credential Wallet" showBackButton={true}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStatusCard()}
        {renderCredentials()}
        {renderActions()}
      </ScrollView>
      
      {isCreating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.overlayText}>Creating credential...</Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
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
    marginBottom: 12,
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
    marginBottom: 4,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#8b5cf6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  credentialsList: {
    gap: 12,
  },
  credentialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  credentialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  credentialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  credentialDetails: {
    flex: 1,
  },
  credentialType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  credentialId: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  credentialDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  credentialActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0, // Override any default margins
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
}); 