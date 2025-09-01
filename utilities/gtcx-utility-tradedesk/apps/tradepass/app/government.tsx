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
import { GovernmentIntegrationService, GovernmentDocument, GovernmentVerification } from '../src/services/government-integration-stub';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

export default function GovernmentScreen() {
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [verifications, setVerifications] = useState<GovernmentVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load documents and verifications
      const govService = GovernmentIntegrationService.getInstance();
      const allDocuments = await govService.getAllDocuments();
      const allVerifications = await govService.getVerificationStatus('all');
      
      setDocuments(allDocuments);
      setVerifications(allVerifications ? [allVerifications] : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load government data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDocument = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Add Government Document',
      'This will open the camera to scan your government ID. Make sure you have good lighting and the document is clearly visible.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Scan Document', onPress: () => simulateDocumentScan() }
      ]
    );
  };

  const simulateDocumentScan = async () => {
    try {
      setIsVerifying(true);
      
      // Simulate document scanning and verification
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const govService = GovernmentIntegrationService.getInstance();
      const newDocument = await govService.addGovernmentDocument({
        type: 'national_id',
        country: 'Ghana',
        documentNumber: 'GHA-123456789',
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        expiryDate: '2025-12-31',
        issuingAuthority: 'Ghana Immigration Service',
        documentImage: 'data:image/jpeg;base64,...',
        metadata: {
          scanQuality: 0.95,
          confidence: 0.92,
          extractedFields: {
            name: 'John Doe',
            idNumber: 'GHA-123456789',
            dateOfBirth: '1990-01-01'
          }
        }
      });

      setDocuments(prev => [...prev, newDocument]);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Document scanned and verified successfully!');
      
    } catch (error) {
      console.error('Document scan failed:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to scan document. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      setIsVerifying(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const govService = GovernmentIntegrationService.getInstance();
      const verification = await govService.verifyDocument(documentId);
      setVerifications(prev => [...prev, verification]);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Document verification completed!');
      
    } catch (error) {
      console.error('Verification failed:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Document verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShareWithGeoTag = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const govService = GovernmentIntegrationService.getInstance();
      const success = await govService.shareIdentityWithGeoTag('user123');
      
      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Identity shared with GeoTag™ successfully!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', 'Failed to share identity with GeoTag™');
      }
    } catch (error) {
      console.error('Failed to share identity:', error);
      Alert.alert('Error', 'Failed to share identity');
    }
  };

  const renderStatusCard = () => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Ionicons name="shield-checkmark" size={24} color="#22c55e" />
        <Text style={styles.statusTitle}>Verification Status</Text>
      </View>
      <Text style={styles.statusText}>
        {documents.length} document{documents.length !== 1 ? 's' : ''} registered
      </Text>
      <Text style={styles.statusText}>
        {verifications.filter(v => v.status === 'approved').length} verification{verifications.filter(v => v.status === 'approved').length !== 1 ? 's' : ''} approved
      </Text>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Government Documents</Text>
        <TouchableOpacity onPress={handleAddDocument} style={styles.addButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      {documents.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color="#64748b" />
          <Text style={styles.emptyStateText}>No documents added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your government ID to get started
          </Text>
        </View>
      ) : (
        <View style={styles.documentsList}>
          {documents.map((document) => (
            <View key={document.id} style={styles.documentItem}>
              <View style={styles.documentInfo}>
                <Ionicons 
                  name={document.type === 'passport' ? 'document' as any : 'card' as any} 
                  size={24} 
                  color="#10b981" 
                />
                <View style={styles.documentDetails}>
                  <Text style={styles.documentType}>
                    {document.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.documentNumber}>
                    {document.documentNumber}
                  </Text>
                  <Text style={styles.documentName}>
                    {document.fullName}
                  </Text>
                </View>
              </View>
              
              <View style={styles.documentActions}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: document.verificationStatus === 'verified' ? '#22c55e' : '#f59e0b' }
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {document.verificationStatus.toUpperCase()}
                  </Text>
                </View>
                
                {document.verificationStatus === 'pending' && (
                  <TouchableOpacity
                    onPress={() => handleVerifyDocument(document.id)}
                    style={styles.verifyButton}
                    disabled={isVerifying}
                  >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  </TouchableOpacity>
                )}
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
          title="Share with GeoTag™"
          icon="share"
          variant="primary"
          size="medium"
          onPress={handleShareWithGeoTag}
          style={styles.actionButton}
        />
        
        <TradePassButton
          title="Refresh Verifications"
          icon="refresh"
          variant="warning"
          size="medium"
          onPress={loadData}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Layout headerTitle="Government Verification" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading government data...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Government Verification" showBackButton={true}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStatusCard()}
        {renderDocuments()}
        {renderActions()}
      </ScrollView>
      
      {isVerifying && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.overlayText}>Verifying document...</Text>
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
    backgroundColor: '#10b981',
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
  documentsList: {
    gap: 12,
  },
  documentItem: {
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
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  documentNumber: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  documentName: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  verifyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
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