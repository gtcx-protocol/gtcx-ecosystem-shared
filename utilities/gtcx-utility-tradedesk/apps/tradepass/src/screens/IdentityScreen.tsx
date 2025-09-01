// ============================================================================
// TRADEPASS™ IDENTITY SCREEN
// Main identity management interface with biometric enrollment
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TradePassBiometrics, BiometricCapabilities, BiometricTemplate } from '@/services/biometric-auth-stub';
import { CrossAppButton, CrossAppStatusIndicator, CrossAppLoadingOverlay } from '@/components/shared-ui/CrossAppComponents';

// ============================================================================
// COMPONENT
// ============================================================================

export default function IdentityScreen() {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities | null>(null);
  const [templates, setTemplates] = useState<BiometricTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    initializeBiometrics();
  }, []);

  const initializeBiometrics = async () => {
    try {
      setIsLoading(true);
      
      // Initialize biometric service
      await TradePassBiometrics.initialize();
      
      // Get device capabilities
      const deviceCapabilities = await TradePassBiometrics.getCapabilities();
      setCapabilities(deviceCapabilities);
      
      // Load existing templates
      const existingTemplates = await TradePassBiometrics.getAllTemplates();
      setTemplates(existingTemplates);
      
    } catch (error) {
      console.error('Failed to initialize biometrics:', error);
      Alert.alert(
        'Biometric Error',
        'Failed to initialize biometric authentication. Please check your device settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // BIOMETRIC ENROLLMENT
  // ============================================================================

  const handleFingerprintEnrollment = async () => {
    try {
      setIsEnrolling(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await TradePassBiometrics.enrollFingerprint();
      
      if (result.success && result.template) {
        setTemplates(prev => [...prev, result.template!]);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Fingerprint enrolled successfully!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.error || 'Fingerprint enrollment failed');
      }
    } catch (error) {
      console.error('Fingerprint enrollment error:', error);
      Alert.alert('Error', 'Fingerprint enrollment failed');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleFaceEnrollment = async () => {
    try {
      setIsEnrolling(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await TradePassBiometrics.enrollFaceId();
      
      if (result.success && result.template) {
        setTemplates(prev => [...prev, result.template!]);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Face ID enrolled successfully!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.error || 'Face ID enrollment failed');
      }
    } catch (error) {
      console.error('Face ID enrollment error:', error);
      Alert.alert('Error', 'Face ID enrollment failed');
    } finally {
      setIsEnrolling(false);
    }
  };

  // ============================================================================
  // BIOMETRIC VERIFICATION
  // ============================================================================

  const handleFingerprintVerification = async () => {
    try {
      setIsVerifying(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await TradePassBiometrics.verifyFingerprint();
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Fingerprint verification successful!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.error || 'Fingerprint verification failed');
      }
    } catch (error) {
      console.error('Fingerprint verification error:', error);
      Alert.alert('Error', 'Fingerprint verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFaceVerification = async () => {
    try {
      setIsVerifying(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await TradePassBiometrics.verifyFaceId();
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Face ID verification successful!');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.error || 'Face ID verification failed');
      }
    } catch (error) {
      console.error('Face ID verification error:', error);
      Alert.alert('Error', 'Face ID verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // ============================================================================
  // TEMPLATE MANAGEMENT
  // ============================================================================

  const handleDeleteTemplate = async (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this biometric template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await TradePassBiometrics.deleteTemplate(templateId);
            if (success) {
              setTemplates(prev => prev.filter(t => t.id !== templateId));
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'Template deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete template');
            }
          }
        }
      ]
    );
  };

  const handleClearAllTemplates = async () => {
    Alert.alert(
      'Clear All Templates',
      'Are you sure you want to delete all biometric templates? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await TradePassBiometrics.clearAllTemplates();
            if (success) {
              setTemplates([]);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'All templates cleared successfully');
            } else {
              Alert.alert('Error', 'Failed to clear templates');
            }
          }
        }
      ]
    );
  };

  // ============================================================================
  // RENDER METHODS
  // ============================================================================

  const renderCapabilitiesSection = () => {
    if (!capabilities) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Capabilities</Text>
        <View style={styles.capabilitiesContainer}>
          <View style={styles.capabilityItem}>
            <Ionicons 
              name={capabilities.hasHardware ? 'checkmark-circle' : 'close-circle'} 
              size={24} 
              color={capabilities.hasHardware ? '#22c55e' : '#ef4444'} 
            />
            <Text style={styles.capabilityText}>Biometric Hardware</Text>
          </View>
          
          <View style={styles.capabilityItem}>
            <Ionicons 
              name={capabilities.isEnrolled ? 'checkmark-circle' : 'close-circle'} 
              size={24} 
              color={capabilities.isEnrolled ? '#22c55e' : '#ef4444'} 
            />
            <Text style={styles.capabilityText}>Biometrics Enrolled</Text>
          </View>
          
          <View style={styles.capabilityItem}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <Text style={styles.capabilityText}>
              Security Level: {capabilities.biometricStrength.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.supportedTypesTitle}>Supported Types:</Text>
        <View style={styles.supportedTypesContainer}>
          {capabilities.supportedTypes.map((type, index) => (
            <View key={index} style={styles.supportedTypeItem}>
              <Ionicons 
                name={type === 'fingerprint' ? 'finger-print' : 'person'} 
                size={20} 
                color="#10b981" 
              />
              <Text style={styles.supportedTypeText}>
                {type === 'fingerprint' ? 'Fingerprint' : type === 'face' ? 'Face ID' : type}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderEnrollmentSection = () => {
    if (!capabilities?.hasHardware) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enroll Biometrics</Text>
        <Text style={styles.sectionSubtitle}>
          Set up biometric authentication for secure access to TradePass™
        </Text>
        
        <View style={styles.enrollmentButtons}>
          {capabilities.supportedTypes.includes('fingerprint') && (
            <CrossAppButton
              title="Enroll Fingerprint"
              onPress={handleFingerprintEnrollment}
              icon="finger-print"
              variant="primary"
              loading={isEnrolling}
              style={styles.enrollmentButton}
            />
          )}
          
          {capabilities.supportedTypes.includes('face') && (
            <CrossAppButton
              title="Enroll Face ID"
              onPress={handleFaceEnrollment}
              icon="person"
              variant="primary"
              loading={isEnrolling}
              style={styles.enrollmentButton}
            />
          )}
        </View>
      </View>
    );
  };

  const renderVerificationSection = () => {
    if (templates.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verify Biometrics</Text>
        <Text style={styles.sectionSubtitle}>
          Test your enrolled biometric authentication
        </Text>
        
        <View style={styles.verificationButtons}>
          {templates.some(t => t.type === 'fingerprint') && (
            <CrossAppButton
              title="Verify Fingerprint"
              onPress={handleFingerprintVerification}
              icon="finger-print"
              variant="outline"
              loading={isVerifying}
              style={styles.verificationButton}
            />
          )}
          
          {templates.some(t => t.type === 'face') && (
            <CrossAppButton
              title="Verify Face ID"
              onPress={handleFaceVerification}
              icon="person"
              variant="outline"
              loading={isVerifying}
              style={styles.verificationButton}
            />
          )}
        </View>
      </View>
    );
  };

  const renderTemplatesSection = () => {
    if (templates.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Enrolled Templates</Text>
          <CrossAppButton
            title="Clear All"
            onPress={handleClearAllTemplates}
            variant="danger"
            size="sm"
          />
        </View>
        
        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <View key={template.id} style={styles.templateItem}>
              <View style={styles.templateInfo}>
                <Ionicons 
                  name={template.type === 'fingerprint' ? 'finger-print' : 'person'} 
                  size={24} 
                  color="#10b981" 
                />
                <View style={styles.templateDetails}>
                  <Text style={styles.templateType}>
                    {template.type === 'fingerprint' ? 'Fingerprint' : 'Face ID'}
                  </Text>
                  <Text style={styles.templateDate}>
                    Enrolled: {new Date(template.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.templateActions}>
                <CrossAppStatusIndicator 
                  status="verified" 
                  text={`${Math.round(template.confidence * 100)}%`}
                  size="sm"
                />
                <CrossAppButton
                  title="Delete"
                  onPress={() => handleDeleteTemplate(template.id)}
                  variant="danger"
                  size="sm"
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <View style={styles.container}>
        <CrossAppLoadingOverlay 
          visible={true} 
          message="Initializing biometric authentication..." 
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Identity Management</Text>
        <Text style={styles.subtitle}>
          Secure biometric authentication for TradePass™
        </Text>
      </View>

      {renderCapabilitiesSection()}
      {renderEnrollmentSection()}
      {renderVerificationSection()}
      {renderTemplatesSection()}
    </ScrollView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  section: {
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  capabilitiesContainer: {
    marginBottom: 16,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  capabilityText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  supportedTypesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  supportedTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  supportedTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  supportedTypeText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 6,
  },
  enrollmentButtons: {
    gap: 12,
  },
  enrollmentButton: {
    marginBottom: 8,
  },
  verificationButtons: {
    gap: 12,
  },
  verificationButton: {
    marginBottom: 8,
  },
  templatesContainer: {
    gap: 12,
  },
  templateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  templateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  templateDetails: {
    marginLeft: 12,
    flex: 1,
  },
  templateType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  templateDate: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  templateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 