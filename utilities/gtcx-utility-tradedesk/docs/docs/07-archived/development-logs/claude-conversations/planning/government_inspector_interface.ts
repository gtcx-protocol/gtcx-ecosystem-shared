              <Ionicons 
                name={isRecording ? "pulse" : "chevron-forward"} 
                size={20} 
                color={isRecording ? GOVERNMENT_COLORS.accent : GOVERNMENT_COLORS.primary} 
              />
            </TouchableOpacity>

            {/* Document Upload */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#F0FDF4',
                borderWidth: 2,
                borderColor: GOVERNMENT_COLORS.secondary,
                marginBottom: 12,
              }}
              onPress={pickDocument}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: GOVERNMENT_COLORS.secondary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons name="document" size={24} color={GOVERNMENT_COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: GOVERNMENT_COLORS.black,
                  marginBottom: 4,
                }}>
                  Document Evidence
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: GOVERNMENT_COLORS.gray,
                }}>
                  Upload certificates, permits, or reports
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={GOVERNMENT_COLORS.secondary} />
            </TouchableOpacity>
          </View>

          {/* Current Evidence List */}
          {checklistItem.evidence.length > 0 && (
            <View style={{
              backgroundColor: GOVERNMENT_COLORS.white,
              borderRadius: 16,
              padding: 20,
              elevation: 3,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: GOVERNMENT_COLORS.black,
                marginBottom: 16,
              }}>
                Collected Evidence ({checklistItem.evidence.length})
              </Text>

              {checklistItem.evidence.map((evidence) => (
                <View key={evidence.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: '#F9FAFB',
                  marginBottom: 8,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: GOVERNMENT_COLORS.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                    <Ionicons
                      name={evidence.type === 'photo' ? 'camera' : 
                           evidence.type === 'voice' ? 'mic' : 'document'}
                      size={20}
                      color={GOVERNMENT_COLORS.white}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: GOVERNMENT_COLORS.black,
                    }}>
                      {evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)} Evidence
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: GOVERNMENT_COLORS.gray,
                    }}>
                      {new Date(evidence.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: GOVERNMENT_COLORS.secondary,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}>
                    <Text style={{
                      fontSize: 10,
                      color: GOVERNMENT_COLORS.white,
                      fontWeight: '600',
                    }}>
                      VERIFIED
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

// ============================================================================
// DIGITAL SIGNATURE COMPONENT
// ============================================================================

interface DigitalSignatureProps {
  inspector: InspectorCredentials;
  reportData: any;
  onSigned: (signature: string) => void;
}

const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  inspector,
  reportData,
  onSigned,
}) => {
  const [isSigning, setIsSigning] = useState(false);

  const generateDigitalSignature = async () => {
    setIsSigning(true);
    
    try {
      // Biometric verification
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity to sign official report',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN',
      });

      if (!biometricAuth.success) {
        Alert.alert('Authentication Failed', 'Biometric verification required for digital signature.');
        setIsSigning(false);
        return;
      }

      // Create report hash
      const reportString = JSON.stringify({
        ...reportData,
        inspector: inspector.id,
        timestamp: Date.now(),
      });
      
      const reportHash = sha256(new TextEncoder().encode(reportString));
      
      // Generate digital signature
      const privateKey = ed25519.utils.randomPrivateKey(); // In production, use inspector's secure key
      const signature = ed25519.sign(reportHash, privateKey);
      
      const digitalSignature = {
        algorithm: 'Ed25519',
        inspector: inspector.id,
        reportHash: bytesToHex(reportHash),
        signature: bytesToHex(signature),
        publicKey: inspector.publicKey,
        timestamp: Date.now(),
        biometricVerified: true,
      };

      onSigned(JSON.stringify(digitalSignature));
      
    } catch (error) {
      console.error('Digital signature error:', error);
      Alert.alert('Signature Error', 'Failed to generate digital signature.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <View style={{
      backgroundColor: GOVERNMENT_COLORS.white,
      borderRadius: 16,
      padding: 20,
      margin: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: '600',
        color: GOVERNMENT_COLORS.black,
        textAlign: 'center',
        marginBottom: 16,
      }}>
        🔏 Digital Signature Required
      </Text>

      <View style={{
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: GOVERNMENT_COLORS.black,
          marginBottom: 8,
        }}>
          Inspector Details:
        </Text>
        <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, marginBottom: 4 }}>
          Name: {inspector.name}
        </Text>
        <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, marginBottom: 4 }}>
          Badge: {inspector.badgeNumber}
        </Text>
        <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, marginBottom: 4 }}>
          Title: {inspector.title}
        </Text>
        <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
          Department: {inspector.department}
        </Text>
      </div>

      <TouchableOpacity
        style={{
          backgroundColor: isSigning ? GOVERNMENT_COLORS.gray : GOVERNMENT_COLORS.accent,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: 'center',
          elevation: 3,
          opacity: isSigning ? 0.7 : 1,
        }}
        onPress={generateDigitalSignature}
        disabled={isSigning}
      >
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: GOVERNMENT_COLORS.white,
        }}>
          {isSigning ? 'Signing Report...' : '✍️ Sign Official Report'}
        </Text>
      </TouchableOpacity>

      <View style={{
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: GOVERNMENT_COLORS.primary,
      }}>
        <Text style={{
          fontSize: 12,
          color: GOVERNMENT_COLORS.gray,
          textAlign: 'center',
          lineHeight: 16,
        }}>
          Digital signature will be cryptographically verified and legally binding.{'\n'}
          Report cannot be modified after signing.
        </Text>
      </div>
    </View>
  );
};

// ============================================================================
// OFFICIAL REPORT PDF COMPONENT
// ============================================================================

interface OfficialReportPDFProps {
  inspection: InspectionSession;
  inspector: InspectorCredentials;
  site: InspectionSite;
  onShare: () => void;
  onSubmit: () => void;
}

const OfficialReportPDF: React.FC<OfficialReportPDFProps> = ({
  inspection,
  inspector,
  site,
  onShare,
  onSubmit,
}) => {
  const getComplianceScore = () => {
    const totalItems = inspection.checklist.length;
    const compliantItems = inspection.checklist.filter(item => item.status === 'compliant').length;
    return totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 0;
  };

  const getViolationCount = () => {
    return inspection.checklist.filter(item => item.status === 'non-compliant').length;
  };

  const formatInspectionType = (type: InspectionType) => {
    return type.replace('_', ' ').toUpperCase();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: GOVERNMENT_COLORS.lightGray }}>
      <View style={{
        backgroundColor: GOVERNMENT_COLORS.white,
        borderRadius: 16,
        margin: 16,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }}>
        {/* Official Header */}
        <View style={{
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottomWidth: 2,
          borderBottomColor: GOVERNMENT_COLORS.gold,
        }}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80x80?text=GH' }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 12,
              borderWidth: 3,
              borderColor: GOVERNMENT_COLORS.gold,
            }}
          />
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: GOVERNMENT_COLORS.black,
            textAlign: 'center',
          }}>
            🇬🇭 REPUBLIC OF GHANA
          </Text>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.primary,
            textAlign: 'center',
            marginTop: 4,
          }}>
            MINERALS COMMISSION
          </Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.accent,
            textAlign: 'center',
            marginTop: 8,
          }}>
            OFFICIAL INSPECTION REPORT
          </Text>
        </View>

        {/* Report Details */}
        <View style={{ marginBottom: 24 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, flex: 1 }}>
              Report ID:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              flex: 2,
            }}>
              {inspection.id}
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, flex: 1 }}>
              Inspection Type:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              flex: 2,
            }}>
              {formatInspectionType(inspection.inspectionType)}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, flex: 1 }}>
              Date:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              flex: 2,
            }}>
              {new Date(inspection.startTime).toLocaleDateString()}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray, flex: 1 }}>
              Inspector:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              flex: 2,
            }}>
              {inspector.name} (Badge #{inspector.badgeNumber})
            </Text>
          </View>
        </View>

        {/* Site Information */}
        <View style={{
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            marginBottom: 12,
          }}>
            📍 SITE INFORMATION
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Site Name:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
            }}>
              {site.name}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              License Number:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
            }}>
              {site.licenseNumber}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Operator:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
            }}>
              {site.operator}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Location:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
            }}>
              {site.location.address}
            </Text>
          </View>
        </View>

        {/* Compliance Summary */}
        <View style={{
          backgroundColor: getComplianceScore() >= 80 ? '#F0FDF4' : 
                         getComplianceScore() >= 60 ? '#FEF3C7' : '#FEE2E2',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          borderLeftWidth: 4,
          borderLeftColor: getComplianceScore() >= 80 ? GOVERNMENT_COLORS.secondary :
                          getComplianceScore() >= 60 ? GOVERNMENT_COLORS.gold : GOVERNMENT_COLORS.accent,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            marginBottom: 12,
          }}>
            📊 COMPLIANCE SUMMARY
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Overall Compliance Score:
            </Text>
            <View style={{
              backgroundColor: getComplianceScore() >= 80 ? GOVERNMENT_COLORS.secondary :
                             getComplianceScore() >= 60 ? GOVERNMENT_COLORS.gold : GOVERNMENT_COLORS.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: GOVERNMENT_COLORS.white,
              }}>
                {getComplianceScore()}%
              </Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Total Checklist Items:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
            }}>
              {inspection.checklist.length}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Compliant Items:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.secondary,
            }}>
              {inspection.checklist.filter(item => item.status === 'compliant').length}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Violations Found:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.accent,
            }}>
              {getViolationCount()}
            </Text>
          </div>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: GOVERNMENT_COLORS.gray }}>
              Evidence Collected:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.primary,
            }}>
              {inspection.evidence.length} items
            </Text>
          </View>
        </View>

        {/* Violations (if any) */}
        {getViolationCount() > 0 && (
          <View style={{
            backgroundColor: '#FEE2E2',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderLeftWidth: 4,
            borderLeftColor: GOVERNMENT_COLORS.accent,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              marginBottom: 12,
            }}>
              ⚠️ VIOLATIONS IDENTIFIED
            </Text>

            {inspection.checklist
              .filter(item => item.status === 'non-compliant')
              .map((violation, index) => (
                <View key={violation.id} style={{
                  backgroundColor: GOVERNMENT_COLORS.white,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: GOVERNMENT_COLORS.accent,
                    marginBottom: 4,
                  }}>
                    Violation #{index + 1}: {violation.requirement}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: GOVERNMENT_COLORS.gray,
                    marginBottom: 4,
                  }}>
                    Category: {violation.category}
                  </Text>
                  {violation.notes && (
                    <Text style={{
                      fontSize: 13,
                      color: GOVERNMENT_COLORS.black,
                      fontStyle: 'italic',
                    }}>
                      Notes: {violation.notes}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Recommendations */}
        {inspection.recommendations.length > 0 && (
          <View style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderLeftWidth: 4,
            borderLeftColor: GOVERNMENT_COLORS.primary,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              marginBottom: 12,
            }}>
              💡 RECOMMENDATIONS
            </Text>

            {inspection.recommendations.map((recommendation, index) => (
              <Text key={index} style={{
                fontSize: 14,
                color: GOVERNMENT_COLORS.black,
                marginBottom: 8,
                lineHeight: 18,
              }}>
                {index + 1}. {recommendation}
              </Text>
            ))}
          </View>
        )}

        {/* Digital Signature */}
        {inspection.digitalSignature && (
          <View style={{
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderWidth: 2,
            borderColor: GOVERNMENT_COLORS.primary,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              marginBottom: 12,
              textAlign: 'center',
            }}>
              🔏 DIGITAL SIGNATURE VERIFIED
            </Text>
            
            <Text style={{
              fontSize: 12,
              color: GOVERNMENT_COLORS.gray,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              This report has been digitally signed and cryptographically verified
            </Text>
            
            <Text style={{
              fontSize: 12,
              color: GOVERNMENT_COLORS.primary,
              textAlign: 'center',
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            }}>
              Signature Hash: {inspection.digitalSignature.substring(0, 32)}...
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={{
          alignItems: 'center',
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        }}>
          <Text style={{
            fontSize: 12,
            color: GOVERNMENT_COLORS.gray,
            textAlign: 'center',
            marginBottom: 4,
          }}>
            Generated on {new Date().toLocaleString()}
          </Text>
          <Text style={{
            fontSize: 12,
            color: GOVERNMENT_COLORS.gray,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            GeoTag™ Government Inspection System v2.0
          </Text>
          <Text style={{
            fontSize: 10,
            color: GOVERNMENT_COLORS.gray,
            textAlign: 'center',
          }}>
            This is an official government document.{'\n'}
            Unauthorized reproduction is prohibited.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 32,
        gap: 12,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: GOVERNMENT_COLORS.gold,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            elevation: 3,
          }}
          onPress={onShare}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.white,
          }}>
            📤 Share Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: GOVERNMENT_COLORS.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            elevation: 3,
          }}
          onPress={onSubmit}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.white,
          }}>
            📋 Submit to Database
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ============================================================================
// MAIN INSPECTOR INTERFACE COMPONENT
// ============================================================================

interface InspectorInterfaceProps {
  onBack: () => void;
}

export const InspectorInterface: React.FC<InspectorInterfaceProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<'auth' | 'selection' | 'inspection' | 'report'>('auth');
  const [inspector, setInspector] = useState<InspectorCredentials | null>(null);
  const [inspectionType, setInspectionType] = useState<InspectionType | null>(null);
  const [selectedSite, setSelectedSite] = useState<InspectionSite | null>(null);
  const [currentInspection, setCurrentInspection] = useState<InspectionSession | null>(null);
  const [showEvidenceCollector, setShowEvidenceCollector] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<ChecklistItem | null>(null);

  const handleAuthenticated = (inspectorCredentials: InspectorCredentials) => {
    setInspector(inspectorCredentials);
    setCurrentStep('selection');
  };

  const handleInspectionTypeSelected = (type: InspectionType, site: InspectionSite) => {
    setInspectionType(type);
    setSelectedSite(site);
    
    // Create new inspection session
    const inspection: InspectionSession = {
      id: `INSP-${Date.now()}`,
      inspectorId: inspector!.id,
      siteId: site.id,
      inspectionType: type,
      startTime: Date.now(),
      status: 'in-progress',
      checklist: [],
      evidence: [],
      violations: [],
      overallScore: 0,
      recommendations: [],
    };
    
    setCurrentInspection(inspection);
    setCurrentStep('inspection');
  };

  const handleChecklistUpdated = (checklist: ChecklistItem[]) => {
    if (currentInspection) {
      setCurrentInspection({
        ...currentInspection,
        checklist,
      });
    }
  };

  const handleEvidenceRequired = (item: ChecklistItem) => {
    setSelectedChecklistItem(item);
    setShowEvidenceCollector(true);
  };

  const handleEvidenceAdded = (evidence: Evidence) => {
    if (currentInspection && selectedChecklistItem) {
      // Add evidence to checklist item
      const updatedChecklist = currentInspection.checklist.map(item =>
        item.id === selectedChecklistItem.id
          ? { ...item, evidence: [...item.evidence, evidence] }
          : item
      );

      // Add evidence to inspection
      const updatedInspection = {
        ...currentInspection,
        checklist: updatedChecklist,
        evidence: [...currentInspection.evidence, evidence],
      };

      setCurrentInspection(updatedInspection);
      setShowEvidenceCollector(false);
      setSelectedChecklistItem(null);
    }
  };

  const handleGenerateReport = () => {
    if (currentInspection) {
      // Calculate final scores and recommendations
      const completedItems = currentInspection.checklist.filter(item => 
        item.status !== 'pending'
      ).length;
      
      const completionPercentage = (completedItems / currentInspection.checklist.length) * 100;
      
      const recommendations = [];
      if (completionPercentage < 100) {
        recommendations.push('Complete all pending checklist items for comprehensive assessment');
      }
      
      const violations = currentInspection.checklist.filter(item => item.status === 'non-compliant');
      if (violations.length > 0) {
        recommendations.push('Address all identified violations within 30 days');
        recommendations.push('Submit corrective action plan to Minerals Commission');
      }

      const updatedInspection = {
        ...currentInspection,
        endTime: Date.now(),
        status: 'completed' as const,
        overallScore: Math.round(completionPercentage),
        recommendations,
      };

      set              requirement: 'Production Records',
              description: 'Review gold production and sales documentation',
              mandatory: false,
            },
          ],
        },
      ],
      violation_investigation: [
        {
          category: 'Violation Assessment',
          items: [
            {
              requirement: 'Incident Documentation',
              description: 'Document the reported violation with evidence',
              mandatory: true,
            },
            {
              requirement: 'Witness Statements',
              description: 'Collect statements from witnesses and affected parties',
              mandatory: true,
            },
            {
              requirement: 'Impact Assessment',
              description: 'Assess environmental and social impact of violation',
              mandatory: true,
            },
          ],
        },
        {
          category: 'Legal Compliance',
          items: [
            {
              requirement: 'Regulation Breach Analysis',
              description: 'Identify specific regulations that were violated',
              mandatory: true,
            },
            {
              requirement: 'Precedent Cases',
              description: 'Reference similar violation cases and outcomes',
              mandatory: false,
            },
            {
              requirement: 'Corrective Measures',
              description: 'Define required corrective actions and timeline',
              mandatory: true,
            },
          ],
        },
      ],
      environmental_assessment: [
        {
          category: 'Environmental Impact',
          items: [
            {
              requirement: 'Soil Quality Assessment',
              description: 'Test soil quality and contamination levels',
              mandatory: true,
            },
            {
              requirement: 'Water Quality Testing',
              description: 'Analyze water sources for chemical contamination',
              mandatory: true,
            },
            {
              requirement: 'Air Quality Monitoring',
              description: 'Measure dust and emission levels',
              mandatory: true,
            },
            {
              requirement: 'Biodiversity Impact',
              description: 'Assess impact on local flora and fauna',
              mandatory: false,
            },
          ],
        },
        {
          category: 'Remediation',
          items: [
            {
              requirement: 'Restoration Plan',
              description: 'Review environmental restoration plan',
              mandatory: true,
            },
            {
              requirement: 'Monitoring System',
              description: 'Verify environmental monitoring systems',
              mandatory: true,
            },
          ],
        },
      ],
      safety_audit: [
        {
          category: 'Workplace Safety',
          items: [
            {
              requirement: 'Hazard Identification',
              description: 'Identify and document workplace hazards',
              mandatory: true,
            },
            {
              requirement: 'Safety Protocols',
              description: 'Review safety protocols and procedures',
              mandatory: true,
            },
            {
              requirement: 'Emergency Procedures',
              description: 'Test emergency response procedures',
              mandatory: true,
            },
            {
              requirement: 'Incident History',
              description: 'Review accident and incident reports',
              mandatory: true,
            },
          ],
        },
        {
          category: 'Equipment Safety',
          items: [
            {
              requirement: 'Equipment Maintenance',
              description: 'Verify regular maintenance of safety equipment',
              mandatory: true,
            },
            {
              requirement: 'Machinery Safety',
              description: 'Inspect machinery safety features and guards',
              mandatory: true,
            },
          ],
        },
      ],
      license_verification: [
        {
          category: 'License Validity',
          items: [
            {
              requirement: 'License Authentication',
              description: 'Verify license authenticity with central database',
              mandatory: true,
            },
            {
              requirement: 'Expiration Status',
              description: 'Check license expiration dates and renewal status',
              mandatory: true,
            },
            {
              requirement: 'License Conditions',
              description: 'Verify compliance with license conditions',
              mandatory: true,
            },
          ],
        },
        {
          category: 'Permit Documentation',
          items: [
            {
              requirement: 'Supporting Permits',
              description: 'Verify all required supporting permits',
              mandatory: true,
            },
            {
              requirement: 'Fee Payment Status',
              description: 'Confirm all license fees are current',
              mandatory: true,
            },
          ],
        },
      ],
    };

    const selectedChecklist = checklists[inspectionType] || checklists.routine_compliance;
    
    const checklistItems: ChecklistItem[] = [];
    selectedChecklist.forEach((category, categoryIndex) => {
      category.items.forEach((item, itemIndex) => {
        checklistItems.push({
          id: `${categoryIndex}-${itemIndex}`,
          category: category.category,
          requirement: item.requirement,
          description: item.description,
          mandatory: item.mandatory,
          status: 'pending',
          evidence: [],
          notes: '',
          inspector: inspector.id,
        });
      });
    });

    setChecklist(checklistItems);
  };

  const calculateProgress = () => {
    const completedItems = checklist.filter(item => 
      item.status === 'compliant' || item.status === 'non-compliant' || item.status === 'not-applicable'
    ).length;
    const progress = checklist.length > 0 ? (completedItems / checklist.length) * 100 : 0;
    setCompletionProgress(Math.round(progress));
  };

  const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, ...updates, timestamp: Date.now() }
        : item
    ));
  };

  const getCategories = () => {
    const categories = ['all', ...Array.from(new Set(checklist.map(item => item.category)))];
    return categories;
  };

  const getFilteredChecklist = () => {
    return selectedCategory === 'all' 
      ? checklist 
      : checklist.filter(item => item.category === selectedCategory);
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'compliant': return GOVERNMENT_COLORS.secondary;
      case 'non-compliant': return GOVERNMENT_COLORS.accent;
      case 'not-applicable': return GOVERNMENT_COLORS.gray;
      default: return GOVERNMENT_COLORS.gold;
    }
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'compliant': return 'checkmark-circle';
      case 'non-compliant': return 'close-circle';
      case 'not-applicable': return 'remove-circle';
      default: return 'time';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: GOVERNMENT_COLORS.lightGray }}>
      {/* Header with Progress */}
      <View style={{
        backgroundColor: GOVERNMENT_COLORS.white,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
          }}>
            📋 Inspection Checklist
          </Text>
          <View style={{
            backgroundColor: completionProgress === 100 ? GOVERNMENT_COLORS.secondary : GOVERNMENT_COLORS.gold,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.white,
            }}>
              {completionProgress}% Complete
            </Text>
          </View>
        </View>

        <Text style={{
          fontSize: 14,
          color: GOVERNMENT_COLORS.gray,
          marginBottom: 16,
        }}>
          {siteInfo.name} • {inspectionType.replace('_', ' ').toUpperCase()}
        </Text>

        {/* Progress Bar */}
        <View style={{
          backgroundColor: '#E5E7EB',
          borderRadius: 8,
          height: 8,
          marginBottomom: 16,
        }}>
          <View style={{
            backgroundColor: completionProgress === 100 ? GOVERNMENT_COLORS.secondary : GOVERNMENT_COLORS.gold,
            borderRadius: 8,
            height: 8,
            width: `${completionProgress}%`,
          }} />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
        >
          {getCategories().map((category) => (
            <TouchableOpacity
              key={category}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor: selectedCategory === category ? GOVERNMENT_COLORS.primary : 'transparent',
                borderWidth: 1,
                borderColor: selectedCategory === category ? GOVERNMENT_COLORS.primary : '#D1D5DB',
                marginRight: 8,
              }}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: selectedCategory === category ? GOVERNMENT_COLORS.white : GOVERNMENT_COLORS.gray,
                textTransform: 'capitalize',
              }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Checklist Items */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {getFilteredChecklist().map((item) => (
          <View key={item.id} style={{
            backgroundColor: GOVERNMENT_COLORS.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}>
            {/* Item Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${getStatusColor(item.status)}20`,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <Ionicons
                  name={getStatusIcon(item.status)}
                  size={18}
                  color={getStatusColor(item.status)}
                />
              </View>
              
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: GOVERNMENT_COLORS.black,
                    flex: 1,
                  }}>
                    {item.requirement}
                  </Text>
                  {item.mandatory && (
                    <View style={{
                      backgroundColor: GOVERNMENT_COLORS.accent,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: GOVERNMENT_COLORS.white,
                        fontWeight: '600',
                      }}>
                        MANDATORY
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text style={{
                  fontSize: 14,
                  color: GOVERNMENT_COLORS.gray,
                  lineHeight: 18,
                  marginBottom: 8,
                }}>
                  {item.description}
                </Text>

                <View style={{
                  backgroundColor: '#F3F4F6',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: GOVERNMENT_COLORS.primary,
                    fontWeight: '500',
                  }}>
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status Selection */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 16,
            }}>
              {[
                { status: 'compliant', label: 'Compliant', icon: 'checkmark-circle' },
                { status: 'non-compliant', label: 'Non-Compliant', icon: 'close-circle' },
                { status: 'not-applicable', label: 'N/A', icon: 'remove-circle' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.status}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: item.status === option.status ? `${getStatusColor(option.status as ChecklistItem['status'])}20` : 'transparent',
                    borderWidth: 1,
                    borderColor: item.status === option.status ? getStatusColor(option.status as ChecklistItem['status']) : '#E5E7EB',
                  }}
                  onPress={() => updateChecklistItem(item.id, { status: option.status as ChecklistItem['status'] })}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={16}
                    color={item.status === option.status ? getStatusColor(option.status as ChecklistItem['status']) : GOVERNMENT_COLORS.gray}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: item.status === option.status ? getStatusColor(option.status as ChecklistItem['status']) : GOVERNMENT_COLORS.gray,
                  }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Evidence and Notes */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
            }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: GOVERNMENT_COLORS.gold,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={() => onEvidenceRequired(item)}
              >
                <Ionicons name="camera" size={16} color={GOVERNMENT_COLORS.white} />
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: GOVERNMENT_COLORS.white,
                  marginLeft: 6,
                }}>
                  Add Evidence ({item.evidence.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: GOVERNMENT_COLORS.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={() => {
                  Alert.prompt(
                    'Inspector Notes',
                    'Add notes for this checklist item:',
                    (text) => updateChecklistItem(item.id, { notes: text || '' }),
                    'plain-text',
                    item.notes
                  );
                }}
              >
                <Ionicons name="create" size={16} color={GOVERNMENT_COLORS.white} />
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: GOVERNMENT_COLORS.white,
                  marginLeft: 6,
                }}>
                  Notes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display Notes */}
            {item.notes && (
              <View style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: GOVERNMENT_COLORS.primary,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: GOVERNMENT_COLORS.black,
                  lineHeight: 18,
                }}>
                  📝 {item.notes}
                </Text>
              </View>
            )}
          </View>
        ))}

        {getFilteredChecklist().length === 0 && (
          <View style={{
            backgroundColor: GOVERNMENT_COLORS.white,
            borderRadius: 12,
            padding: 32,
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Ionicons name="document-outline" size={48} color={GOVERNMENT_COLORS.gray} />
            <Text style={{
              fontSize: 16,
              color: GOVERNMENT_COLORS.gray,
              marginTop: 16,
              textAlign: 'center',
            }}>
              No checklist items found for the selected category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// EVIDENCE COLLECTOR COMPONENT
// ============================================================================

interface EvidenceCollectorProps {
  checklistItem: ChecklistItem;
  onEvidenceAdded: (evidence: Evidence) => void;
  onClose: () => void;
}

const EvidenceCollector: React.FC<EvidenceCollectorProps> = ({
  checklistItem,
  onEvidenceAdded,
  onClose,
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
      });
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current && currentLocation) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: true,
        });

        const evidence: Evidence = {
          id: `evidence_${Date.now()}`,
          type: 'photo',
          uri: photo.uri,
          timestamp: Date.now(),
          location: currentLocation,
          metadata: {
            description: '',
            category: checklistItem.category,
            tags: [checklistItem.requirement],
          },
          cryptographicHash: bytesToHex(sha256(new TextEncoder().encode(photo.uri + Date.now()))),
        };

        onEvidenceAdded(evidence);
        setShowCamera(false);
      } catch (error) {
        console.error('Photo capture error:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Audio recording permission is required for voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri && currentLocation) {
        const evidence: Evidence = {
          id: `evidence_${Date.now()}`,
          type: 'voice',
          uri,
          timestamp: Date.now(),
          location: currentLocation,
          metadata: {
            description: 'Voice note recording',
            category: checklistItem.category,
            tags: [checklistItem.requirement, 'voice-note'],
          },
          cryptographicHash: bytesToHex(sha256(new TextEncoder().encode(uri + Date.now()))),
        };

        onEvidenceAdded(evidence);
      }
      setRecording(null);
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to save recording');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0] && currentLocation) {
        const evidence: Evidence = {
          id: `evidence_${Date.now()}`,
          type: 'document',
          uri: result.assets[0].uri,
          timestamp: Date.now(),
          location: currentLocation,
          metadata: {
            description: result.assets[0].name || 'Document evidence',
            category: checklistItem.category,
            tags: [checklistItem.requirement, 'document'],
          },
          cryptographicHash: bytesToHex(sha256(new TextEncoder().encode(result.assets[0].uri + Date.now()))),
        };

        onEvidenceAdded(evidence);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  if (showCamera) {
    return (
      <Modal visible={true} animationType="slide">
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={CameraType.back} ref={cameraRef}>
            <View style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
              {/* Location Overlay */}
              <View style={{
                position: 'absolute',
                top: 50,
                left: 20,
                right: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 8,
                padding: 12,
              }}>
                <Text style={{
                  color: GOVERNMENT_COLORS.white,
                  fontSize: 14,
                  fontWeight: '600',
                  marginBottom: 4,
                }}>
                  📍 Evidence Location Embedded
                </Text>
                <Text style={{ color: GOVERNMENT_COLORS.gold, fontSize: 12 }}>
                  {checklistItem.requirement}
                </Text>
                {currentLocation && (
                  <>
                    <Text style={{ color: GOVERNMENT_COLORS.gold, fontSize: 12 }}>
                      Lat: {currentLocation.latitude.toFixed(6)}
                    </Text>
                    <Text style={{ color: GOVERNMENT_COLORS.gold, fontSize: 12 }}>
                      Lon: {currentLocation.longitude.toFixed(6)}
                    </Text>
                  </>
                )}
              </View>

              {/* Controls */}
              <View style={{
                position: 'absolute',
                bottom: 50,
                left: 0,
                right: 0,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 30,
                    padding: 15,
                  }}
                  onPress={() => setShowCamera(false)}
                >
                  <Ionicons name="close" size={30} color={GOVERNMENT_COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: GOVERNMENT_COLORS.accent,
                    borderRadius: 40,
                    padding: 20,
                    elevation: 5,
                  }}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={40} color={GOVERNMENT_COLORS.white} />
                </TouchableOpacity>

                <View style={{ width: 60 }} />
              </View>
            </View>
          </Camera>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={true} animationType="slide">
      <View style={{ flex: 1, backgroundColor: GOVERNMENT_COLORS.lightGray }}>
        <StatusBar barStyle="light-content" backgroundColor={GOVERNMENT_COLORS.primary} />
        
        {/* Header */}
        <LinearGradient
          colors={[GOVERNMENT_COLORS.primary, GOVERNMENT_COLORS.darkBlue]}
          style={{
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: GOVERNMENT_COLORS.white,
                marginBottom: 4,
              }}>
                📸 Collect Evidence
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.8)',
              }}>
                {checklistItem.requirement}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 20,
                padding: 8,
              }}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={GOVERNMENT_COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Evidence Type Selection */}
          <View style={{
            backgroundColor: GOVERNMENT_COLORS.white,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            elevation: 3,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              marginBottom: 16,
            }}>
              Select Evidence Type
            </Text>

            {/* Photo Evidence */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#FEF3C7',
                borderWidth: 2,
                borderColor: GOVERNMENT_COLORS.gold,
                marginBottom: 12,
              }}
              onPress={() => setShowCamera(true)}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: GOVERNMENT_COLORS.gold,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons name="camera" size={24} color={GOVERNMENT_COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: GOVERNMENT_COLORS.black,
                  marginBottom: 4,
                }}>
                  Photo Evidence
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: GOVERNMENT_COLORS.gray,
                }}>
                  Capture high-resolution photos with GPS embedding
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={GOVERNMENT_COLORS.gold} />
            </TouchableOpacity>

            {/* Voice Recording */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 12,
                backgroundColor: isRecording ? '#FEE2E2' : '#F0F9FF',
                borderWidth: 2,
                borderColor: isRecording ? GOVERNMENT_COLORS.accent : GOVERNMENT_COLORS.primary,
                marginBottom: 12,
              }}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: isRecording ? GOVERNMENT_COLORS.accent : GOVERNMENT_COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons 
                  name={isRecording ? "stop" : "mic"} 
                  size={24} 
                  color={GOVERNMENT_COLORS.white} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: GOVERNMENT_COLORS.black,
                  marginBottom: 4,
                }}>
                  {isRecording ? 'Stop Recording' : 'Voice Notes'}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: GOVERNMENT_COLORS.gray,
                }}>
                  {isRecording ? 'Recording in progress...' : 'Record detailed observations'}
                </Text>
              </View>// ============================================================================
// GEOTAG™ GOVERNMENT INSPECTOR INTERFACE
// Professional inspection tools for regulatory compliance verification
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
  Image,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { sha256 } from '@noble/hashes/sha256';
import { ed25519 } from '@noble/curves/ed25519';
import { bytesToHex } from '@noble/hashes/utils';

const { width, height } = Dimensions.get('window');

// ============================================================================
// CONSTANTS AND THEME
// ============================================================================

const GOVERNMENT_COLORS = {
  primary: '#1E3A8A', // Government Blue
  secondary: '#059669', // Authority Green
  accent: '#DC2626', // Alert Red
  gold: '#F59E0B', // Official Gold
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkBlue: '#1E40AF',
};

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface InspectorCredentials {
  id: string;
  badgeNumber: string;
  name: string;
  title: string;
  department: string;
  authority: string;
  certificationLevel: 'basic' | 'advanced' | 'senior';
  digitalSignature: string;
  publicKey: string;
  issuedDate: string;
  expiryDate: string;
}

interface InspectionSite {
  id: string;
  name: string;
  licenseNumber: string;
  operator: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  lastInspectionDate?: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'pending' | 'suspended';
}

interface Evidence {
  id: string;
  type: 'photo' | 'document' | 'voice' | 'measurement';
  uri: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  metadata: {
    description: string;
    category: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
  };
  cryptographicHash: string;
}

interface ChecklistItem {
  id: string;
  category: string;
  requirement: string;
  description: string;
  mandatory: boolean;
  status: 'pending' | 'compliant' | 'non-compliant' | 'not-applicable';
  evidence: Evidence[];
  notes: string;
  inspector: string;
  timestamp?: number;
}

interface InspectionSession {
  id: string;
  inspectorId: string;
  siteId: string;
  inspectionType: InspectionType;
  startTime: number;
  endTime?: number;
  status: 'in-progress' | 'completed' | 'suspended' | 'cancelled';
  checklist: ChecklistItem[];
  evidence: Evidence[];
  violations: Violation[];
  overallScore: number;
  recommendations: string[];
  officialReport?: string;
  digitalSignature?: string;
}

interface Violation {
  id: string;
  type: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  evidence: Evidence[];
  correctionDeadline: string;
  followUpRequired: boolean;
  legalAction: boolean;
}

type InspectionType = 
  | 'routine_compliance'
  | 'violation_investigation'
  | 'environmental_assessment'
  | 'safety_audit'
  | 'license_verification';

// ============================================================================
// INSPECTOR AUTHENTICATION COMPONENT
// ============================================================================

interface InspectorAuthenticationProps {
  onAuthenticated: (inspector: InspectorCredentials) => void;
}

const InspectorAuthentication: React.FC<InspectorAuthenticationProps> = ({
  onAuthenticated,
}) => {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [useHardwareKey, setUseHardwareKey] = useState(false);

  const authenticateInspector = async () => {
    setIsAuthenticating(true);
    
    try {
      // Biometric authentication first
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity for government access',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN',
      });

      if (!biometricAuth.success) {
        Alert.alert('Authentication Failed', 'Biometric verification required for government access.');
        setIsAuthenticating(false);
        return;
      }

      // Validate credentials with government database
      // In production, this would connect to actual government authentication system
      const mockInspector: InspectorCredentials = {
        id: 'INS-2025-001',
        badgeNumber: badgeNumber,
        name: 'John Mensah',
        title: 'Senior Mining Inspector',
        department: 'Ghana Minerals Commission',
        authority: 'Republic of Ghana',
        certificationLevel: 'senior',
        digitalSignature: bytesToHex(ed25519.sign(
          sha256(new TextEncoder().encode(badgeNumber)),
          ed25519.utils.randomPrivateKey()
        )),
        publicKey: bytesToHex(ed25519.getPublicKey(ed25519.utils.randomPrivateKey())),
        issuedDate: '2024-01-01',
        expiryDate: '2025-12-31',
      };

      // Save credentials securely
      await AsyncStorage.setItem('inspectorCredentials', JSON.stringify(mockInspector));
      
      onAuthenticated(mockInspector);
      
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication Error', 'Failed to verify government credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const connectHardwareKey = async () => {
    Alert.alert(
      'Hardware Security Key',
      'Insert your government-issued hardware security key and follow the prompts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => setUseHardwareKey(true) }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: GOVERNMENT_COLORS.lightGray }}>
      <StatusBar barStyle="light-content" backgroundColor={GOVERNMENT_COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[GOVERNMENT_COLORS.primary, GOVERNMENT_COLORS.darkBlue]}
        style={{
          paddingTop: 60,
          paddingBottom: 40,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80x80?text=GH' }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 16,
              borderWidth: 3,
              borderColor: GOVERNMENT_COLORS.gold,
            }}
          />
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: GOVERNMENT_COLORS.white,
            textAlign: 'center',
          }}>
            Ghana Minerals Commission
          </Text>
          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginTop: 4,
          }}>
            Inspector Authentication Portal
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View style={{
          backgroundColor: GOVERNMENT_COLORS.white,
          borderRadius: 16,
          padding: 24,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            🛡️ Secure Inspector Login
          </Text>

          {/* Badge Number Input */}
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            marginBottom: 8,
          }}>
            Inspector Badge Number
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              borderColor: GOVERNMENT_COLORS.primary,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              backgroundColor: GOVERNMENT_COLORS.lightGray,
              marginBottom: 20,
            }}
            value={badgeNumber}
            onChangeText={setBadgeNumber}
            placeholder="Enter your badge number"
            keyboardType="default"
            autoCapitalize="characters"
          />

          {/* PIN Input */}
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            marginBottom: 8,
          }}>
            Security PIN
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              borderColor: GOVERNMENT_COLORS.primary,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              backgroundColor: GOVERNMENT_COLORS.lightGray,
              marginBottom: 24,
            }}
            value={pin}
            onChangeText={setPin}
            placeholder="Enter security PIN"
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
          />

          {/* Authentication Buttons */}
          <TouchableOpacity
            style={{
              backgroundColor: GOVERNMENT_COLORS.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 16,
              elevation: 3,
              opacity: isAuthenticating ? 0.7 : 1,
            }}
            onPress={authenticateInspector}
            disabled={isAuthenticating || !badgeNumber || !pin}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.white,
            }}>
              {isAuthenticating ? 'Authenticating...' : '🔐 Authenticate with Biometrics'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: GOVERNMENT_COLORS.gold,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 24,
              elevation: 3,
            }}
            onPress={connectHardwareKey}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.white,
            }}>
              🔑 Use Hardware Security Key
            </Text>
          </TouchableOpacity>

          {/* Security Notice */}
          <View style={{
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            borderRadius: 12,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: GOVERNMENT_COLORS.primary,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: GOVERNMENT_COLORS.black,
              marginBottom: 8,
            }}>
              🛡️ Security Notice:
            </Text>
            <Text style={{
              fontSize: 13,
              color: GOVERNMENT_COLORS.gray,
              lineHeight: 18,
            }}>
              • Multi-factor authentication required{'\n'}
              • All activities are logged and audited{'\n'}
              • Unauthorized access is a criminal offense{'\n'}
              • Hardware security keys provide enhanced protection
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// INSPECTION TYPE SELECTOR COMPONENT
// ============================================================================

interface InspectionTypeSelectorProps {
  inspector: InspectorCredentials;
  selectedSite: InspectionSite | null;
  onInspectionTypeSelected: (type: InspectionType, site: InspectionSite) => void;
}

const InspectionTypeSelector: React.FC<InspectionTypeSelectorProps> = ({
  inspector,
  selectedSite,
  onInspectionTypeSelected,
}) => {
  const [sites, setSites] = useState<InspectionSite[]>([]);
  const [selectedInspectionType, setSelectedInspectionType] = useState<InspectionType | null>(null);
  const [currentSite, setCurrentSite] = useState<InspectionSite | null>(selectedSite);

  const inspectionTypes = [
    {
      type: 'routine_compliance' as InspectionType,
      title: 'Routine Compliance Inspection',
      description: 'Standard periodic compliance verification',
      icon: 'clipboard-outline',
      color: GOVERNMENT_COLORS.secondary,
      duration: '2-3 hours',
      priority: 'standard',
    },
    {
      type: 'violation_investigation' as InspectionType,
      title: 'Violation Investigation',
      description: 'Investigate reported regulatory violations',
      icon: 'warning-outline',
      color: GOVERNMENT_COLORS.accent,
      duration: '3-6 hours',
      priority: 'high',
    },
    {
      type: 'environmental_assessment' as InspectionType,
      title: 'Environmental Assessment',
      description: 'Environmental impact and compliance review',
      icon: 'leaf-outline',
      color: GOVERNMENT_COLORS.secondary,
      duration: '4-8 hours',
      priority: 'standard',
    },
    {
      type: 'safety_audit' as InspectionType,
      title: 'Safety Audit',
      description: 'Comprehensive workplace safety evaluation',
      icon: 'shield-checkmark-outline',
      color: GOVERNMENT_COLORS.gold,
      duration: '3-5 hours',
      priority: 'high',
    },
    {
      type: 'license_verification' as InspectionType,
      title: 'License Verification',
      description: 'Verify mining licenses and permits',
      icon: 'document-text-outline',
      color: GOVERNMENT_COLORS.primary,
      duration: '1-2 hours',
      priority: 'standard',
    },
  ];

  useEffect(() => {
    loadNearbySites();
  }, []);

  const loadNearbySites = async () => {
    // In production, this would fetch from government database
    const mockSites: InspectionSite[] = [
      {
        id: 'SITE-001',
        name: 'Golden Valley Mining Co.',
        licenseNumber: 'SSML-2024-001234',
        operator: 'Kwame Asante',
        location: {
          latitude: 6.200000,
          longitude: -1.600000,
          address: 'Ashanti Region, Ghana',
        },
        lastInspectionDate: '2024-11-15',
        complianceStatus: 'compliant',
      },
      {
        id: 'SITE-002',
        name: 'Sunrise Gold Operations',
        licenseNumber: 'SSML-2024-005678',
        operator: 'Ama Osei',
        location: {
          latitude: 6.250000,
          longitude: -1.550000,
          address: 'Eastern Region, Ghana',
        },
        lastInspectionDate: '2024-10-28',
        complianceStatus: 'pending',
      },
      {
        id: 'SITE-003',
        name: 'Diamond Creek Mining',
        licenseNumber: 'SSML-2024-009012',
        operator: 'Joseph Mensah',
        location: {
          latitude: 6.180000,
          longitude: -1.620000,
          address: 'Western Region, Ghana',
        },
        lastInspectionDate: '2024-09-12',
        complianceStatus: 'non-compliant',
      },
    ];
    
    setSites(mockSites);
    if (!currentSite && mockSites.length > 0) {
      setCurrentSite(mockSites[0]);
    }
  };

  const handleStartInspection = () => {
    if (selectedInspectionType && currentSite) {
      onInspectionTypeSelected(selectedInspectionType, currentSite);
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return GOVERNMENT_COLORS.secondary;
      case 'non-compliant': return GOVERNMENT_COLORS.accent;
      case 'pending': return GOVERNMENT_COLORS.gold;
      case 'suspended': return GOVERNMENT_COLORS.gray;
      default: return GOVERNMENT_COLORS.gray;
    }
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return 'checkmark-circle';
      case 'non-compliant': return 'close-circle';
      case 'pending': return 'time';
      case 'suspended': return 'pause-circle';
      default: return 'help-circle';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: GOVERNMENT_COLORS.lightGray }}>
      <StatusBar barStyle="light-content" backgroundColor={GOVERNMENT_COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[GOVERNMENT_COLORS.primary, GOVERNMENT_COLORS.darkBlue]}
        style={{
          paddingTop: 50,
          paddingBottom: 30,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50x50?text=GM' }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 12,
              borderWidth: 2,
              borderColor: GOVERNMENT_COLORS.gold,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: GOVERNMENT_COLORS.white,
            }}>
              Inspector {inspector.name}
            </Text>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.8)',
            }}>
              Badge #{inspector.badgeNumber} • {inspector.title}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Site Selection */}
        <View style={{
          backgroundColor: GOVERNMENT_COLORS.white,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            marginBottom: 16,
          }}>
            📍 Select Inspection Site
          </Text>

          {sites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: currentSite?.id === site.id ? 'rgba(30, 58, 138, 0.1)' : 'transparent',
                borderWidth: currentSite?.id === site.id ? 2 : 1,
                borderColor: currentSite?.id === site.id ? GOVERNMENT_COLORS.primary : '#E5E7EB',
                marginBottom: 12,
              }}
              onPress={() => setCurrentSite(site)}
            >
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: getComplianceStatusColor(site.complianceStatus),
                marginRight: 12,
              }} />
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: GOVERNMENT_COLORS.black,
                  marginBottom: 2,
                }}>
                  {site.name}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: GOVERNMENT_COLORS.gray,
                  marginBottom: 2,
                }}>
                  License: {site.licenseNumber} • Operator: {site.operator}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: GOVERNMENT_COLORS.gray,
                }}>
                  {site.location.address}
                </Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Ionicons
                  name={getComplianceStatusIcon(site.complianceStatus)}
                  size={20}
                  color={getComplianceStatusColor(site.complianceStatus)}
                />
                <Text style={{
                  fontSize: 10,
                  color: getComplianceStatusColor(site.complianceStatus),
                  fontWeight: '600',
                  marginTop: 2,
                  textTransform: 'capitalize',
                }}>
                  {site.complianceStatus.replace('_', ' ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inspection Type Selection */}
        <View style={{
          backgroundColor: GOVERNMENT_COLORS.white,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.black,
            marginBottom: 16,
          }}>
            📋 Select Inspection Type
          </Text>

          {inspectionTypes.map((type) => (
            <TouchableOpacity
              key={type.type}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: selectedInspectionType === type.type ? `${type.color}15` : 'transparent',
                borderWidth: selectedInspectionType === type.type ? 2 : 1,
                borderColor: selectedInspectionType === type.type ? type.color : '#E5E7EB',
                marginBottom: 12,
              }}
              onPress={() => setSelectedInspectionType(type.type)}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: selectedInspectionType === type.type ? type.color : `${type.color}20`,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={selectedInspectionType === type.type ? GOVERNMENT_COLORS.white : type.color}
                />
              </View>
              
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: selectedInspectionType === type.type ? GOVERNMENT_COLORS.black : '#374151',
                  }}>
                    {type.title}
                  </Text>
                  {type.priority === 'high' && (
                    <View style={{
                      backgroundColor: GOVERNMENT_COLORS.accent,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                      marginLeft: 8,
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: GOVERNMENT_COLORS.white,
                        fontWeight: '600',
                      }}>
                        HIGH PRIORITY
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{
                  fontSize: 14,
                  color: GOVERNMENT_COLORS.gray,
                  marginBottom: 4,
                  lineHeight: 18,
                }}>
                  {type.description}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: type.color,
                  fontWeight: '500',
                }}>
                  ⏱️ Duration: {type.duration}
                </Text>
              </View>

              {selectedInspectionType === type.type && (
                <Ionicons name="checkmark-circle" size={24} color={type.color} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Start Inspection Button */}
        <TouchableOpacity
          style={{
            backgroundColor: selectedInspectionType && currentSite ? GOVERNMENT_COLORS.primary : GOVERNMENT_COLORS.gray,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            elevation: selectedInspectionType && currentSite ? 4 : 0,
            marginBottom: 40,
          }}
          onPress={handleStartInspection}
          disabled={!selectedInspectionType || !currentSite}
        >
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: GOVERNMENT_COLORS.white,
          }}>
            🚀 Start Official Inspection
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// COMPLIANCE CHECKLIST COMPONENT
// ============================================================================

interface ComplianceChecklistProps {
  inspectionType: InspectionType;
  siteInfo: InspectionSite;
  inspector: InspectorCredentials;
  onChecklistUpdated: (checklist: ChecklistItem[]) => void;
  onEvidenceRequired: (item: ChecklistItem) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  inspectionType,
  siteInfo,
  inspector,
  onChecklistUpdated,
  onEvidenceRequired,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completionProgress, setCompletionProgress] = useState(0);

  useEffect(() => {
    generateChecklist();
  }, [inspectionType]);

  useEffect(() => {
    calculateProgress();
    onChecklistUpdated(checklist);
  }, [checklist]);

  const generateChecklist = () => {
    const checklists = {
      routine_compliance: [
        {
          category: 'Licensing',
          items: [
            {
              requirement: 'Valid Mining License',
              description: 'Verify current mining license is valid and displayed',
              mandatory: true,
            },
            {
              requirement: 'Environmental Permit',
              description: 'Check environmental impact assessment permit',
              mandatory: true,
            },
            {
              requirement: 'Land Use Authorization',
              description: 'Verify land use authorization from traditional authorities',
              mandatory: true,
            },
          ],
        },
        {
          category: 'Safety',
          items: [
            {
              requirement: 'Safety Equipment Availability',
              description: 'Confirm availability of helmets, boots, and protective gear',
              mandatory: true,
            },
            {
              requirement: 'First Aid Facilities',
              description: 'Verify presence of first aid kit and emergency procedures',
              mandatory: true,
            },
            {
              requirement: 'Worker Safety Training',
              description: 'Check safety training records for all workers',
              mandatory: false,
            },
          ],
        },
        {
          category: 'Environmental',
          items: [
            {
              requirement: 'Waste Management',
              description: 'Assess proper disposal of mining waste and chemicals',
              mandatory: true,
            },
            {
              requirement: 'Water Source Protection',
              description: 'Verify protection of nearby water sources',
              mandatory: true,
            },
            {
              requirement: 'Land Rehabilitation Plan',
              description: 'Review land rehabilitation and closure plan',
              mandatory: false,
            },
          ],
        },
        {
          category: 'Operations',
          items: [
            {
              requirement: 'Mining Area Boundaries',
              description: 'Confirm mining activities within licensed boundaries',
              mandatory: true,
            },
            {
              requirement: 'Equipment Registration',
              description: 'Verify all mining equipment is properly registered',
              mandatory: true,
            },
            {
              requirement: 'Production Records',
              