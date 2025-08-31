// ============================================================================
// TRADEPASS™ TRADER VERIFICATION - KYC/AML COMPLIANCE SYSTEM
// Professional trader verification with government-grade security
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

interface VerificationDocument {
  id: string;
  type: 'government_id' | 'business_license' | 'tax_certificate' | 'banking_details' | 'proof_of_address';
  title: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  uploadDate: number;
  expiryDate?: number;
  rejectionReason?: string;
}

interface TraderProfile {
  id: string;
  businessName: string;
  registrationNumber: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  tradingVolume: number;
  memberSince: number;
  verificationLevel: 'basic' | 'standard' | 'premium';
  riskScore: number;
  compliance: {
    kyc: boolean;
    aml: boolean;
    sanctions: boolean;
  };
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  required: boolean;
  documents: string[];
}

export default function TraderVerification() {
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [steps, setSteps] = useState<VerificationStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'documents' | 'compliance'>('overview');

  useEffect(() => {
    loadVerificationData();
  }, []);

  const loadVerificationData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading verification data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProfile: TraderProfile = {
        id: 'trader-001',
        businessName: 'Ghana Gold Trading Ltd',
        registrationNumber: 'GT-2023-00145',
        ownerName: 'Kwame Asante',
        email: 'kasante@ghanatrading.com',
        phone: '+233 24 123 4567',
        address: 'Accra Business District, Ghana',
        tradingVolume: 2450000, // USD
        memberSince: Date.now() - 31536000000, // 1 year ago
        verificationLevel: 'standard',
        riskScore: 25, // Low risk (0-100 scale)
        compliance: {
          kyc: true,
          aml: true,
          sanctions: false,
        }
      };

      const mockDocuments: VerificationDocument[] = [
        {
          id: 'doc-001',
          type: 'government_id',
          title: 'National ID Card',
          status: 'verified',
          uploadDate: Date.now() - 2592000000, // 30 days ago
          expiryDate: Date.now() + 157680000000, // 5 years
        },
        {
          id: 'doc-002',
          type: 'business_license',
          title: 'Business Registration Certificate',
          status: 'verified',
          uploadDate: Date.now() - 2592000000,
          expiryDate: Date.now() + 31536000000, // 1 year
        },
        {
          id: 'doc-003',
          type: 'banking_details',
          title: 'Bank Account Verification',
          status: 'pending',
          uploadDate: Date.now() - 86400000, // 1 day ago
        },
        {
          id: 'doc-004',
          type: 'proof_of_address',
          title: 'Utility Bill',
          status: 'rejected',
          uploadDate: Date.now() - 172800000, // 2 days ago
          rejectionReason: 'Document older than 3 months',
        },
        {
          id: 'doc-005',
          type: 'tax_certificate',
          title: 'Tax Clearance Certificate',
          status: 'expired',
          uploadDate: Date.now() - 7776000000, // 90 days ago
          expiryDate: Date.now() - 86400000, // Expired yesterday
        },
      ];

      const mockSteps: VerificationStep[] = [
        {
          id: 'step-001',
          title: 'Identity Verification',
          description: 'Verify personal identity with government-issued ID',
          status: 'completed',
          required: true,
          documents: ['government_id'],
        },
        {
          id: 'step-002',
          title: 'Business Registration',
          description: 'Provide valid business registration documents',
          status: 'completed',
          required: true,
          documents: ['business_license'],
        },
        {
          id: 'step-003',
          title: 'Financial Verification',
          description: 'Verify banking details and financial standing',
          status: 'in_progress',
          required: true,
          documents: ['banking_details', 'tax_certificate'],
        },
        {
          id: 'step-004',
          title: 'Address Confirmation',
          description: 'Confirm business address with utility bill or lease agreement',
          status: 'pending',
          required: true,
          documents: ['proof_of_address'],
        },
        {
          id: 'step-005',
          title: 'Enhanced Due Diligence',
          description: 'Additional screening for high-volume traders',
          status: 'pending',
          required: false,
          documents: [],
        },
      ];

      setProfile(mockProfile);
      setDocuments(mockDocuments);
      setSteps(mockSteps);
    } catch (error) {
      console.error('Failed to load verification data:', error);
      Alert.alert('Error', 'Failed to load trader verification data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'checkmark-circle';
      case 'in_progress':
      case 'pending':
        return 'time-outline';
      case 'rejected':
      case 'expired':
        return 'close-circle';
      default:
        return 'ellipse-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return '#22c55e';
      case 'in_progress':
      case 'pending':
        return '#f59e0b';
      case 'rejected':
      case 'expired':
        return '#ef4444';
      default:
        return '#8E8E93';
    }
  };

  const getVerificationLevelColor = (level: string) => {
    switch (level) {
      case 'premium': return '#8b5cf6';
      case 'standard': return '#007AFF';
      case 'basic': return '#f59e0b';
      default: return '#8E8E93';
    }
  };

  const getRiskLevelText = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return '#22c55e';
    if (score <= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleUploadDocument = (docType: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Upload Document',
      `Upload your ${docType.replace('_', ' ')} document`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => Alert.alert('Camera', 'Camera upload coming soon') },
        { text: 'Gallery', onPress: () => Alert.alert('Gallery', 'Gallery upload coming soon') }
      ]
    );
  };

  const handleVerificationUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Upgrade Verification',
      'Upgrade to Premium verification for higher trading limits and faster processing.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => Alert.alert('Premium Benefits', 'Premium verification includes priority support, higher limits, and advanced features.') },
        { text: 'Upgrade', onPress: () => Alert.alert('Upgrade', 'Premium verification upgrade process starting...') }
      ]
    );
  };

  const renderOverview = () => {
    if (!profile) return null;

    return (
      <View style={styles.section}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.businessName}>{profile.businessName}</Text>
              <Text style={styles.registrationNumber}>Reg: {profile.registrationNumber}</Text>
            </View>
            <View style={[styles.verificationBadge, { backgroundColor: getVerificationLevelColor(profile.verificationLevel) }]}>
              <Text style={styles.verificationText}>{profile.verificationLevel.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Owner:</Text>
              <Text style={styles.profileValue}>{profile.ownerName}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{profile.email}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Trading Volume:</Text>
              <Text style={styles.profileValue}>${profile.tradingVolume.toLocaleString()}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Member Since:</Text>
              <Text style={styles.profileValue}>{new Date(profile.memberSince).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        {/* Risk Assessment */}
        <View style={styles.riskCard}>
          <Text style={styles.cardTitle}>Risk Assessment</Text>
          <View style={styles.riskContainer}>
            <View style={styles.riskScore}>
              <Text style={[styles.riskValue, { color: getRiskColor(profile.riskScore) }]}>
                {profile.riskScore}
              </Text>
              <Text style={styles.riskLabel}>Risk Score</Text>
            </View>
            <View style={styles.riskLevel}>
              <Text style={[styles.riskLevelText, { color: getRiskColor(profile.riskScore) }]}>
                {getRiskLevelText(profile.riskScore)}
              </Text>
              <View style={styles.riskBar}>
                <View style={[
                  styles.riskFill,
                  { 
                    width: `${profile.riskScore}%`,
                    backgroundColor: getRiskColor(profile.riskScore)
                  }
                ]} />
              </View>
            </View>
          </View>
        </View>

        {/* Compliance Status */}
        <View style={styles.complianceCard}>
          <Text style={styles.cardTitle}>Compliance Status</Text>
          <View style={styles.complianceContainer}>
            <View style={styles.complianceItem}>
              <Ionicons 
                name={profile.compliance.kyc ? 'checkmark-circle' : 'close-circle'} 
                size={24} 
                color={profile.compliance.kyc ? '#22c55e' : '#ef4444'} 
              />
              <Text style={styles.complianceText}>KYC Verified</Text>
            </View>
            <View style={styles.complianceItem}>
              <Ionicons 
                name={profile.compliance.aml ? 'checkmark-circle' : 'close-circle'} 
                size={24} 
                color={profile.compliance.aml ? '#22c55e' : '#ef4444'} 
              />
              <Text style={styles.complianceText}>AML Compliant</Text>
            </View>
            <View style={styles.complianceItem}>
              <Ionicons 
                name={profile.compliance.sanctions ? 'close-circle' : 'checkmark-circle'} 
                size={24} 
                color={profile.compliance.sanctions ? '#ef4444' : '#22c55e'} 
              />
              <Text style={styles.complianceText}>No Sanctions</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderDocuments = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Verification Documents</Text>
      {documents.map((doc) => (
        <View key={doc.id} style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{doc.title}</Text>
              <Text style={styles.documentType}>{doc.type.replace('_', ' ').toUpperCase()}</Text>
            </View>
            <View style={[styles.documentStatus, { backgroundColor: getStatusColor(doc.status) }]}>
              <Ionicons name={getStatusIcon(doc.status) as any} size={16} color="#ffffff" />
              <Text style={styles.documentStatusText}>{doc.status.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.documentDetails}>
            <Text style={styles.documentDate}>
              Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
            </Text>
            {doc.expiryDate && (
              <Text style={[
                styles.documentExpiry,
                { color: doc.expiryDate < Date.now() ? '#ef4444' : '#8E8E93' }
              ]}>
                Expires: {new Date(doc.expiryDate).toLocaleDateString()}
              </Text>
            )}
            {doc.rejectionReason && (
              <Text style={styles.rejectionReason}>
                Reason: {doc.rejectionReason}
              </Text>
            )}
          </View>
          {(doc.status === 'rejected' || doc.status === 'expired') && (
            <TouchableOpacity
              style={styles.reuploadButton}
              onPress={() => handleUploadDocument(doc.type)}
            >
              <Text style={styles.reuploadText}>Re-upload Document</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderCompliance = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Verification Progress</Text>
      {steps.map((step) => (
        <View key={step.id} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepIndicator}>
              <Ionicons 
                name={getStatusIcon(step.status) as any} 
                size={24} 
                color={getStatusColor(step.status)} 
              />
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.required && (
                  <Text style={styles.requiredLabel}>REQUIRED</Text>
                )}
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
              <Text style={[styles.stepStatus, { color: getStatusColor(step.status) }]}>
                {step.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSectionSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: 'overview', title: 'Overview', icon: 'person' },
        { key: 'documents', title: 'Documents', icon: 'document-text' },
        { key: 'compliance', title: 'Progress', icon: 'shield-checkmark' },
      ].map((tab) => (
        <TradePassButton
          key={tab.key}
          title={tab.title}
          icon={tab.icon as any}
          variant={activeSection === tab.key ? 'primary' : 'secondary'}
          size="small"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveSection(tab.key as any);
          }}
          style={styles.tabButton}
        />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <Layout headerTitle="Trader Verification" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading verification status...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Trader Verification" showBackButton={true}>
      <ScrollView style={styles.content}>
        {/* Section Selector */}
        {renderSectionSelector()}

        {/* Content based on active section */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'documents' && renderDocuments()}
        {activeSection === 'compliance' && renderCompliance()}

        {/* Actions */}
        <View style={styles.actionSection}>
          <TradePassButton
            title="Upgrade Verification"
            icon="arrow-up-circle"
            variant="primary"
            size="large"
            onPress={handleVerificationUpgrade}
          />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: 0.35,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  registrationNumber: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 16,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  riskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  riskScore: {
    alignItems: 'center',
  },
  riskValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  riskLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  riskLevel: {
    flex: 1,
  },
  riskLevelText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  riskBar: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
  },
  riskFill: {
    height: 8,
    borderRadius: 4,
  },
  complianceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  complianceContainer: {
    gap: 12,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  complianceText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  documentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  documentStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  documentDetails: {
    gap: 4,
  },
  documentDate: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  documentExpiry: {
    fontSize: 13,
    fontWeight: '500',
  },
  rejectionReason: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  reuploadButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  reuploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  stepIndicator: {
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  requiredLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 8,
  },
  stepStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionSection: {
    margin: 20,
  },
});