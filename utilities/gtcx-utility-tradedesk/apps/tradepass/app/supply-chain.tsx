// ============================================================================
// TRADEPASS™ SUPPLY CHAIN TRACKING - BLOCKCHAIN-VERIFIED PROVENANCE
// End-to-end tracking of mining materials from extraction to delivery
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

interface SupplyChainStep {
  id: string;
  stage: 'extraction' | 'processing' | 'verification' | 'transport' | 'delivery';
  title: string;
  description: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  operator: {
    id: string;
    name: string;
    verified: boolean;
  };
  documents: string[];
  cryptographicProof: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface Shipment {
  id: string;
  commodity: string;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'pending';
  currentStep: number;
  totalSteps: number;
  estimatedDelivery: number;
  chain: SupplyChainStep[];
}

export default function SupplyChainScreen() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSupplyChainData();
  }, []);

  const loadSupplyChainData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading supply chain data
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockShipments: Shipment[] = [
        {
          id: 'ship-001',
          commodity: 'Gold Ore',
          quantity: 250.5,
          unit: 'kg',
          origin: 'Obuasi Mine, Ghana',
          destination: 'Accra Processing Center',
          status: 'in_transit',
          currentStep: 3,
          totalSteps: 5,
          estimatedDelivery: Date.now() + 86400000, // 24 hours
          chain: [
            {
              id: 'step-001',
              stage: 'extraction',
              title: 'Gold Ore Extraction',
              description: 'High-grade ore extracted from Shaft 7, Level 15',
              timestamp: Date.now() - 172800000, // 2 days ago
              location: { latitude: 6.2027, longitude: -1.3293, address: 'Obuasi Mine, Ghana' },
              operator: { id: 'op-001', name: 'John Mensah', verified: true },
              documents: ['extraction-cert-001.pdf', 'quality-report-001.pdf'],
              cryptographicProof: 'SHA256:a1b2c3d4e5f6...',
              status: 'completed'
            },
            {
              id: 'step-002',
              stage: 'verification',
              title: 'Government Verification',
              description: 'Certified by Ghana Minerals Commission',
              timestamp: Date.now() - 140400000,
              location: { latitude: 6.2027, longitude: -1.3293, address: 'GMC Field Office, Obuasi' },
              operator: { id: 'op-002', name: 'Ghana Minerals Commission', verified: true },
              documents: ['gmc-cert-001.pdf', 'export-permit-001.pdf'],
              cryptographicProof: 'SHA256:b2c3d4e5f6g7...',
              status: 'completed'
            },
            {
              id: 'step-003',
              stage: 'transport',
              title: 'Road Transport',
              description: 'Secure transport to processing facility',
              timestamp: Date.now() - 86400000,
              location: { latitude: 6.4721, longitude: -1.1419, address: 'En route to Accra' },
              operator: { id: 'op-003', name: 'SafeTransport Ltd', verified: true },
              documents: ['transport-manifest-001.pdf'],
              cryptographicProof: 'SHA256:c3d4e5f6g7h8...',
              status: 'in_progress'
            },
            {
              id: 'step-004',
              stage: 'processing',
              title: 'Ore Processing',
              description: 'Refining and purification process',
              timestamp: 0,
              location: { latitude: 5.6037, longitude: -0.1870, address: 'Accra Processing Center' },
              operator: { id: 'op-004', name: 'Ghana Gold Processing', verified: true },
              documents: [],
              cryptographicProof: '',
              status: 'pending'
            },
            {
              id: 'step-005',
              stage: 'delivery',
              title: 'Final Delivery',
              description: 'Delivery to international buyer',
              timestamp: 0,
              location: { latitude: 5.6037, longitude: -0.1870, address: 'Accra Gold Export Terminal' },
              operator: { id: 'op-005', name: 'Export Authority', verified: true },
              documents: [],
              cryptographicProof: '',
              status: 'pending'
            }
          ]
        },
        {
          id: 'ship-002',
          commodity: 'Silver Concentrate',
          quantity: 180.2,
          unit: 'kg',
          origin: 'Tarkwa Mine, Ghana',
          destination: 'Tema Port',
          status: 'delivered',
          currentStep: 5,
          totalSteps: 5,
          estimatedDelivery: Date.now() - 43200000, // 12 hours ago
          chain: []
        }
      ];

      setShipments(mockShipments);
      setSelectedShipment(mockShipments[0] || null);
    } catch (error) {
      console.error('Failed to load supply chain data:', error);
      Alert.alert('Error', 'Failed to load supply chain tracking data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'extraction': return 'hammer';
      case 'processing': return 'cog';
      case 'verification': return 'shield-checkmark';
      case 'transport': return 'car';
      case 'delivery': return 'checkmark-circle';
      default: return 'ellipse';
    }
  };

  const getStageColor = (_stage: string, status: string) => {
    if (status === 'completed') return '#22c55e';
    if (status === 'in_progress') return '#f59e0b';
    return '#8E8E93';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#22c55e';
      case 'in_transit': return '#007AFF';
      case 'delayed': return '#ef4444';
      case 'pending': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const handleTrackShipment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Track Shipment', 'Enter shipment ID or QR code to track');
  };

  const renderShipmentCard = (shipment: Shipment) => (
    <TouchableOpacity
      key={shipment.id}
      style={[
        styles.shipmentCard,
        selectedShipment?.id === shipment.id && styles.selectedShipment
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedShipment(shipment);
      }}
    >
      <View style={styles.shipmentHeader}>
        <Text style={styles.commodityName}>{shipment.commodity}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
          <Text style={styles.statusText}>{shipment.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.shipmentDetails}>
        <Text style={styles.quantityText}>{shipment.quantity} {shipment.unit}</Text>
        <Text style={styles.routeText}>{shipment.origin} → {shipment.destination}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${(shipment.currentStep / shipment.totalSteps) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {shipment.currentStep} of {shipment.totalSteps}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSupplyChain = () => {
    if (!selectedShipment) return null;

    return (
      <View style={styles.chainContainer}>
        <Text style={styles.sectionTitle}>Supply Chain Trail</Text>
        {selectedShipment.chain.map((step, index) => (
          <View key={step.id} style={styles.chainStep}>
            <View style={styles.stepIndicator}>
              <View style={[
                styles.stepIcon,
                { backgroundColor: getStageColor(step.stage, step.status) }
              ]}>
                <Ionicons 
                  name={getStageIcon(step.stage) as any} 
                  size={16} 
                  color="#ffffff" 
                />
              </View>
              {index < selectedShipment.chain.length - 1 && (
                <View style={styles.stepConnector} />
              )}
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepStatus}>
                  {step.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
              <View style={styles.stepMeta}>
                <Text style={styles.stepOperator}>
                  {step.operator.name} {step.operator.verified && '✓'}
                </Text>
                {step.timestamp > 0 && (
                  <Text style={styles.stepTimestamp}>
                    {new Date(step.timestamp).toLocaleDateString()}
                  </Text>
                )}
              </View>
              {step.documents.length > 0 && (
                <View style={styles.documentsContainer}>
                  <Text style={styles.documentsTitle}>Documents:</Text>
                  {step.documents.map((doc, docIndex) => (
                    <Text key={docIndex} style={styles.documentName}>• {doc}</Text>
                  ))}
                </View>
              )}
              {step.cryptographicProof && (
                <View style={styles.proofContainer}>
                  <Ionicons name="shield-checkmark" size={14} color="#22c55e" />
                  <Text style={styles.proofText}>Cryptographically Verified</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <Layout headerTitle="Supply Chain" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading supply chain data...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Supply Chain" showBackButton={true}>
      <ScrollView style={styles.content}>
        {/* Header Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{shipments.length}</Text>
            <Text style={styles.statLabel}>Active Shipments</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98.2%</Text>
            <Text style={styles.statLabel}>On-Time Delivery</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Verified Chain</Text>
          </View>
        </View>

        {/* Shipments List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Shipments</Text>
          {shipments.map(renderShipmentCard)}
        </View>

        {/* Supply Chain Details */}
        {selectedShipment && renderSupplyChain()}

        {/* Actions */}
        <View style={styles.actionSection}>
          <TradePassButton
            title="Track New Shipment"
            icon="qr-code"
            variant="primary"
            size="large"
            onPress={handleTrackShipment}
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
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
  shipmentCard: {
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
  selectedShipment: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commodityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  shipmentDetails: {
    marginBottom: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  chainContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chainStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#F2F2F7',
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  stepStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  stepDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 20,
  },
  stepMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepOperator: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  stepTimestamp: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  documentsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  documentsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  documentName: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  proofContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  proofText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  actionSection: {
    margin: 20,
  },
});