// ============================================================================
// TRADEPASS™ COMPLIANCE REPORTS - REGULATORY REPORTING & AUDIT TRAILS
// Government-grade compliance reporting for mining operations
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

interface ComplianceReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'ad_hoc';
  period: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  dueDate: number;
  submissionDate?: number;
  approvalDate?: number;
  authority: string;
  downloadUrl?: string;
  violations: number;
  recommendations: number;
}

interface AuditTrail {
  id: string;
  action: string;
  user: string;
  timestamp: number;
  details: string;
  ipAddress: string;
  location: string;
  severity: 'info' | 'warning' | 'critical';
}

interface ComplianceMetric {
  category: string;
  current: number;
  target: number;
  status: 'compliant' | 'warning' | 'violation';
  trend: 'improving' | 'stable' | 'declining';
}

export default function ComplianceReports() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'audit' | 'metrics'>('reports');
  const [selectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading compliance data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockReports: ComplianceReport[] = [
        {
          id: 'report-001',
          title: 'Monthly Mining Operations Report',
          type: 'monthly',
          period: 'November 2024',
          status: 'approved',
          dueDate: Date.now() - 432000000, // 5 days ago
          submissionDate: Date.now() - 518400000, // 6 days ago
          approvalDate: Date.now() - 259200000, // 3 days ago
          authority: 'Ghana Minerals Commission',
          downloadUrl: '/reports/nov-2024-mining.pdf',
          violations: 0,
          recommendations: 2,
        },
        {
          id: 'report-002',
          title: 'Environmental Impact Assessment',
          type: 'quarterly',
          period: 'Q4 2024',
          status: 'submitted',
          dueDate: Date.now() + 604800000, // 7 days from now
          submissionDate: Date.now() - 86400000, // 1 day ago
          authority: 'Environmental Protection Agency',
          violations: 1,
          recommendations: 5,
        },
        {
          id: 'report-003',
          title: 'Annual Compliance Summary',
          type: 'annual',
          period: '2024',
          status: 'draft',
          dueDate: Date.now() + 2592000000, // 30 days from now
          authority: 'Ministry of Lands and Natural Resources',
          violations: 3,
          recommendations: 12,
        },
        {
          id: 'report-004',
          title: 'Safety Incident Report',
          type: 'ad_hoc',
          period: 'Dec 1, 2024',
          status: 'rejected',
          dueDate: Date.now() - 172800000, // 2 days ago
          submissionDate: Date.now() - 259200000, // 3 days ago
          authority: 'Mining Safety Authority',
          violations: 2,
          recommendations: 8,
        },
      ];

      const mockAuditTrails: AuditTrail[] = [
        {
          id: 'audit-001',
          action: 'Report Submitted',
          user: 'John Mensah',
          timestamp: Date.now() - 86400000,
          details: 'Environmental Impact Assessment Q4 2024 submitted',
          ipAddress: '192.168.1.100',
          location: 'Accra, Ghana',
          severity: 'info',
        },
        {
          id: 'audit-002',
          action: 'Document Modified',
          user: 'Sarah Owusu',
          timestamp: Date.now() - 172800000,
          details: 'Monthly operations report draft updated',
          ipAddress: '192.168.1.105',
          location: 'Kumasi, Ghana',
          severity: 'warning',
        },
        {
          id: 'audit-003',
          action: 'Violation Detected',
          user: 'System',
          timestamp: Date.now() - 259200000,
          details: 'Environmental threshold exceeded at Site 7',
          ipAddress: 'system',
          location: 'Mining Site 7',
          severity: 'critical',
        },
        {
          id: 'audit-004',
          action: 'Access Denied',
          user: 'Unknown',
          timestamp: Date.now() - 345600000,
          details: 'Unauthorized access attempt to compliance database',
          ipAddress: '203.45.67.89',
          location: 'External',
          severity: 'critical',
        },
      ];

      const mockMetrics: ComplianceMetric[] = [
        {
          category: 'Environmental Standards',
          current: 92,
          target: 95,
          status: 'warning',
          trend: 'improving',
        },
        {
          category: 'Safety Protocols',
          current: 98,
          target: 100,
          status: 'compliant',
          trend: 'stable',
        },
        {
          category: 'Documentation',
          current: 85,
          target: 90,
          status: 'warning',
          trend: 'declining',
        },
        {
          category: 'Financial Reporting',
          current: 100,
          target: 100,
          status: 'compliant',
          trend: 'stable',
        },
        {
          category: 'Worker Rights',
          current: 78,
          target: 95,
          status: 'violation',
          trend: 'improving',
        },
      ];

      setReports(mockReports);
      setAuditTrails(mockAuditTrails);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
      Alert.alert('Error', 'Failed to load compliance reports');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'compliant':
        return '#22c55e';
      case 'submitted':
      case 'warning':
        return '#f59e0b';
      case 'draft':
        return '#8E8E93';
      case 'rejected':
      case 'violation':
        return '#ef4444';
      default:
        return '#8E8E93';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'trending-up';
      case 'declining': return 'trending-down';
      case 'stable': return 'remove';
      default: return 'remove';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return '#007AFF';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#8E8E93';
    }
  };

  const handleDownloadReport = (report: ComplianceReport) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (report.downloadUrl) {
      Alert.alert('Download', `Downloading ${report.title}...`);
    } else {
      Alert.alert('Not Available', 'Report download not available yet');
    }
  };

  const handleGenerateReport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Generate Report',
      'Choose report type:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Monthly Report', onPress: () => Alert.alert('Generate', 'Monthly report generation started') },
        { text: 'Custom Report', onPress: () => Alert.alert('Custom', 'Custom report builder opening') }
      ]
    );
  };

  const renderReports = () => (
    <View style={styles.section}>
      {reports.map((report) => (
        <View key={report.id} style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportPeriod}>{report.period} • {report.authority}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
              <Text style={styles.statusText}>{report.status.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.reportDetails}>
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>Due Date:</Text>
              <Text style={[
                styles.reportValue,
                { color: report.dueDate < Date.now() ? '#ef4444' : '#000000' }
              ]}>
                {new Date(report.dueDate).toLocaleDateString()}
              </Text>
            </View>
            {report.submissionDate && (
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Submitted:</Text>
                <Text style={styles.reportValue}>
                  {new Date(report.submissionDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>Violations:</Text>
              <Text style={[
                styles.reportValue,
                { color: report.violations > 0 ? '#ef4444' : '#22c55e' }
              ]}>
                {report.violations}
              </Text>
            </View>
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>Recommendations:</Text>
              <Text style={styles.reportValue}>{report.recommendations}</Text>
            </View>
          </View>

          {report.downloadUrl && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownloadReport(report)}
            >
              <Ionicons name="download-outline" size={16} color="#007AFF" />
              <Text style={styles.downloadText}>Download PDF</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderAuditTrail = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {auditTrails.map((trail) => (
        <View key={trail.id} style={styles.auditCard}>
          <View style={styles.auditHeader}>
            <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(trail.severity) }]} />
            <View style={styles.auditInfo}>
              <Text style={styles.auditAction}>{trail.action}</Text>
              <Text style={styles.auditUser}>by {trail.user}</Text>
            </View>
            <Text style={styles.auditTime}>
              {new Date(trail.timestamp).toLocaleDateString()} {new Date(trail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Text style={styles.auditDetails}>{trail.details}</Text>
          <View style={styles.auditMeta}>
            <Text style={styles.auditLocation}>📍 {trail.location}</Text>
            <Text style={styles.auditIP}>IP: {trail.ipAddress}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMetrics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Compliance Metrics</Text>
      {metrics.map((metric, index) => (
        <View key={index} style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricCategory}>{metric.category}</Text>
            <View style={styles.metricTrend}>
              <Ionicons 
                name={getTrendIcon(metric.trend) as any} 
                size={16} 
                color={metric.trend === 'improving' ? '#22c55e' : metric.trend === 'declining' ? '#ef4444' : '#8E8E93'} 
              />
              <Text style={[
                styles.metricTrendText,
                { color: metric.trend === 'improving' ? '#22c55e' : metric.trend === 'declining' ? '#ef4444' : '#8E8E93' }
              ]}>
                {metric.trend}
              </Text>
            </View>
          </View>
          
          <View style={styles.metricProgress}>
            <View style={styles.metricBar}>
              <View style={[
                styles.metricFill,
                { 
                  width: `${(metric.current / metric.target) * 100}%`,
                  backgroundColor: getStatusColor(metric.status)
                }
              ]} />
            </View>
            <Text style={styles.metricValue}>
              {metric.current}% / {metric.target}%
            </Text>
          </View>
          
          <View style={[styles.metricStatus, { backgroundColor: getStatusColor(metric.status) }]}>
            <Text style={styles.metricStatusText}>
              {metric.status.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: 'reports', title: 'Reports', icon: 'document-text' },
        { key: 'audit', title: 'Audit Trail', icon: 'eye' },
        { key: 'metrics', title: 'Metrics', icon: 'stats-chart' },
      ].map((tab) => (
        <TradePassButton
          key={tab.key}
          title={tab.title}
          icon={tab.icon as any}
          variant={activeTab === tab.key ? 'primary' : 'secondary'}
          size="small"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab(tab.key as any);
          }}
          style={styles.tabButton}
        />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <Layout headerTitle="Compliance Reports" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading compliance data...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Compliance Reports" showBackButton={true}>
      <ScrollView style={styles.content}>
        {/* Status Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Compliance Overview</Text>
            <View style={styles.overviewPeriod}>
              <Text style={styles.periodText}>{selectedPeriod.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reports.filter(r => r.status === 'approved').length}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reports.filter(r => r.violations > 0).length}</Text>
              <Text style={styles.statLabel}>Violations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>94%</Text>
              <Text style={styles.statLabel}>Compliance</Text>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        {renderTabSelector()}

        {/* Content based on active tab */}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'audit' && renderAuditTrail()}
        {activeTab === 'metrics' && renderMetrics()}

        {/* Actions */}
        <View style={styles.actionSection}>
          <TradePassButton
            title="Generate New Report"
            icon="add-circle"
            variant="primary"
            size="large"
            onPress={handleGenerateReport}
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
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  overviewPeriod: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
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
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 22,
  },
  reportPeriod: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  reportDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reportLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  reportValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F2F8FF',
    borderRadius: 8,
    gap: 6,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  auditCard: {
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
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  auditInfo: {
    flex: 1,
  },
  auditAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  auditUser: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  auditTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  auditDetails: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  auditMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 8,
  },
  auditLocation: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  auditIP: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  metricCard: {
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
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricTrendText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  metricProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  metricBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
  },
  metricFill: {
    height: 8,
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'monospace',
  },
  metricStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metricStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionSection: {
    margin: 20,
  },
});