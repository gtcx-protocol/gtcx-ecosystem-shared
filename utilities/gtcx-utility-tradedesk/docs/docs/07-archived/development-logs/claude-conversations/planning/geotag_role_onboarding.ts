// ============================================================================
// GEOTAG™ ROLE-BASED ONBOARDING SYSTEM
// Complete React Native role selection and context-driven workflows
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ============================================================================
// GHANA-INSPIRED THEME CONSTANTS
// ============================================================================

const GHANA_COLORS = {
  red: '#CE1126',
  gold: '#FCD116', 
  green: '#006B3F',
  black: '#000000',
  white: '#FFFFFF',
  darkGreen: '#004D2E',
  lightGold: '#FFE55C',
  miningBlue: '#1E3A8A',
  earthBrown: '#8B4513',
  silverGray: '#C0C0C0',
};

const THEME = {
  primary: GHANA_COLORS.gold,
  secondary: GHANA_COLORS.green,
  accent: GHANA_COLORS.red,
  background: GHANA_COLORS.white,
  text: GHANA_COLORS.black,
  textLight: '#666666',
  shadow: 'rgba(0, 0, 0, 0.1)',
  success: GHANA_COLORS.green,
  warning: GHANA_COLORS.gold,
  error: GHANA_COLORS.red,
};

// ============================================================================
// USER ROLE DEFINITIONS
// ============================================================================

export interface UserRole {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
  color: string;
  gradient: string[];
  primaryActions: string[];
  features: string[];
}

const USER_ROLES: UserRole[] = [
  {
    id: 'small-scale-miner',
    title: 'Small-Scale Miner',
    subtitle: 'Individual Gold Mining',
    description: 'Tag gold discoveries and verify work sites for compliance',
    icon: 'pickaxe',
    iconFamily: 'MaterialIcons',
    color: GHANA_COLORS.gold,
    gradient: [GHANA_COLORS.gold, GHANA_COLORS.lightGold],
    primaryActions: [
      'Register new gold discoveries',
      'Tag daily work locations',  
      'Create origin certificates',
      'Track mining activities',
    ],
    features: [
      'GPS-verified gold lot registration',
      'Daily work site compliance',
      'Crypto-secured origin proofs',
      '30+ day offline capability',
    ],
  },
  {
    id: 'government-inspector',
    title: 'Government Inspector',
    subtitle: 'Regulatory Compliance',
    description: 'Conduct official inspections and compliance verification',
    icon: 'shield-checkmark',
    iconFamily: 'Ionicons',
    color: GHANA_COLORS.miningBlue,
    gradient: [GHANA_COLORS.miningBlue, '#3B82F6'],
    primaryActions: [
      'Conduct site inspections',
      'Verify mining licenses',
      'Generate compliance reports',
      'Document violations',
    ],
    features: [
      'Official government authentication',
      'Comprehensive inspection checklists',
      'Digital signature capabilities',
      'Real-time compliance database sync',
    ],
  },
  {
    id: 'mining-company',
    title: 'Licensed Mining Company',
    subtitle: 'Commercial Operations',
    description: 'Verify large-scale operations and ensure compliance',
    icon: 'industry',
    iconFamily: 'FontAwesome5',
    color: GHANA_COLORS.green,
    gradient: [GHANA_COLORS.green, GHANA_COLORS.darkGreen],
    primaryActions: [
      'Monitor operation sites',
      'Verify employee activities',
      'Track equipment deployment',
      'Generate operational reports',
    ],
    features: [
      'Multi-site management dashboard',
      'Employee verification system',
      'Equipment tracking integration',
      'Advanced analytics and reporting',
    ],
  },
  {
    id: 'gold-trader',
    title: 'Gold Buyer/Trader',
    subtitle: 'Commodity Trading',
    description: 'Verify gold lot origins and trading compliance',
    icon: 'balance-scale',
    iconFamily: 'FontAwesome5',
    color: GHANA_COLORS.earthBrown,
    gradient: [GHANA_COLORS.earthBrown, '#A0522D'],
    primaryActions: [
      'Verify gold lot origins',
      'Check compliance certificates',
      'Track supply chain',
      'Generate purchase reports',
    ],
    features: [
      'Origin verification scanner',
      'Supply chain traceability',
      'Compliance certificate validation',
      'Trading record management',
    ],
  },
];

// ============================================================================
// ROLE SELECTION SCREEN COMPONENT
// ============================================================================

interface RoleSelectionScreenProps {
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onRoleSelected,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const handleRoleSelection = async (role: UserRole) => {
    setSelectedRole(role);
    
    // Save role to AsyncStorage
    try {
      await AsyncStorage.setItem('userRole', JSON.stringify(role));
      setTimeout(() => onRoleSelected(role), 500);
    } catch (error) {
      console.error('Error saving user role:', error);
      Alert.alert('Error', 'Failed to save role selection. Please try again.');
    }
  };

  const renderIcon = (role: UserRole, size: number = 40) => {
    switch (role.iconFamily) {
      case 'Ionicons':
        return <Ionicons name={role.icon as any} size={size} color={GHANA_COLORS.white} />;
      case 'MaterialIcons':
        return <MaterialIcons name={role.icon as any} size={size} color={GHANA_COLORS.white} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={role.icon as any} size={size} color={GHANA_COLORS.white} />;
      default:
        return <Ionicons name="person" size={size} color={GHANA_COLORS.white} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
      
      {/* Header */}
      <LinearGradient
        colors={[GHANA_COLORS.green, GHANA_COLORS.darkGreen]}
        style={{
          paddingTop: 60,
          paddingBottom: 30,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: GHANA_COLORS.white,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          🏔️ GeoTag™ Ghana
        </Text>
        <Text style={{
          fontSize: 16,
          color: GHANA_COLORS.lightGold,
          textAlign: 'center',
          opacity: 0.9,
        }}>
          Cryptographic Mining Verification
        </Text>
      </LinearGradient>

      <Animated.View style={[{ flex: 1, padding: 20 }, animatedStyle]}>
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: THEME.text,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Select Your Role
        </Text>
        <Text style={{
          fontSize: 16,
          color: THEME.textLight,
          textAlign: 'center',
          marginBottom: 30,
          lineHeight: 22,
        }}>
          Choose your role in Ghana's mining industry to access customized workflows
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {USER_ROLES.map((role, index) => (
            <TouchableOpacity
              key={role.id}
              activeOpacity={0.8}
              onPress={() => handleRoleSelection(role)}
              style={{
                marginBottom: 16,
                borderRadius: 16,
                overflow: 'hidden',
                elevation: 4,
                shadowColor: THEME.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <LinearGradient
                colors={role.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 20,
                  minHeight: 120,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    {renderIcon(role, 28)}
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: GHANA_COLORS.white,
                      marginBottom: 4,
                    }}>
                      {role.title}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: 8,
                    }}>
                      {role.subtitle}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 20,
                    }}>
                      {role.description}
                    </Text>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 8,
                }}>
                  {role.primaryActions.slice(0, 2).map((action, actionIndex) => (
                    <View
                      key={actionIndex}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                        marginRight: 8,
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{
                        fontSize: 12,
                        color: GHANA_COLORS.white,
                        fontWeight: '500',
                      }}>
                        {action}
                      </Text>
                    </View>
                  ))}
                  {role.primaryActions.length > 2 && (
                    <View style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      marginBottom: 6,
                    }}>
                      <Text style={{
                        fontSize: 12,
                        color: GHANA_COLORS.white,
                        fontWeight: '500',
                      }}>
                        +{role.primaryActions.length - 2} more
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: 'rgba(252, 209, 22, 0.1)',
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: GHANA_COLORS.gold,
        }}>
          <Text style={{
            fontSize: 14,
            color: THEME.textLight,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            You can change your role anytime in Settings. Multi-role users can switch between workflows as needed.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

// ============================================================================
// ROLE-SPECIFIC HOME SCREENS
// ============================================================================

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
  color: string;
  onPress: () => void;
  badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  iconFamily,
  color,
  onPress,
  badge,
}) => {
  const renderIcon = (size: number = 32) => {
    switch (iconFamily) {
      case 'Ionicons':
        return <Ionicons name={icon as any} size={size} color={color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon as any} size={size} color={color} />;
      default:
        return <Ionicons name="apps" size={size} color={color} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: THEME.background,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: THEME.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: `${color}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            {renderIcon(28)}
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: THEME.text,
              marginBottom: 4,
            }}>
              {title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: THEME.textLight,
              lineHeight: 20,
            }}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginLeft: 8 }}>
          {badge && (
            <View style={{
              backgroundColor: color,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 10,
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 12,
                color: GHANA_COLORS.white,
                fontWeight: '600',
              }}>
                {badge}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={24} color={THEME.textLight} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ============================================================================
// GHANA-THEMED HEADER COMPONENT
// ============================================================================

interface GhanaThemedHeaderProps {
  title: string;
  subtitle: string;
  userRole: UserRole;
  onSettingsPress: () => void;
}

const GhanaThemedHeader: React.FC<GhanaThemedHeaderProps> = ({
  title,
  subtitle,
  userRole,
  onSettingsPress,
}) => {
  return (
    <LinearGradient
      colors={userRole.gradient}
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
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: GHANA_COLORS.white,
            marginBottom: 4,
          }}>
            🏔️ {title}
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.8)',
          }}>
            {subtitle}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={onSettingsPress}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="settings-outline" size={24} color={GHANA_COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          {userRole.iconFamily === 'Ionicons' && (
            <Ionicons name={userRole.icon as any} size={20} color={GHANA_COLORS.white} />
          )}
          {userRole.iconFamily === 'MaterialIcons' && (
            <MaterialIcons name={userRole.icon as any} size={20} color={GHANA_COLORS.white} />
          )}
          {userRole.iconFamily === 'FontAwesome5' && (
            <FontAwesome5 name={userRole.icon as any} size={20} color={GHANA_COLORS.white} />
          )}
        </View>
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: GHANA_COLORS.white,
          }}>
            {userRole.title}
          </Text>
          <Text style={{
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            {userRole.subtitle}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// ============================================================================
// SMALL-SCALE MINER HOME SCREEN
// ============================================================================

interface SmallScaleMinerHomeProps {
  userRole: UserRole;
  onNavigate: (screen: string) => void;
}

export const SmallScaleMinerHome: React.FC<SmallScaleMinerHomeProps> = ({
  userRole,
  onNavigate,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <GhanaThemedHeader
        title="GeoTag™ Miner"
        subtitle="Individual Gold Mining Operations"
        userRole={userRole}
        onSettingsPress={() => onNavigate('settings')}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{
          fontSize: 22,
          fontWeight: '600',
          color: THEME.text,
          marginBottom: 8,
        }}>
          Quick Actions
        </Text>
        <Text style={{
          fontSize: 16,
          color: THEME.textLight,
          marginBottom: 24,
          lineHeight: 22,
        }}>
          Tag your discoveries and verify work sites for compliance
        </Text>

        <ActionCard
          title="Register New Gold Discovery"
          subtitle="Create verifiable origin proof for new gold lot"
          icon="star"
          iconFamily="Ionicons"
          color={GHANA_COLORS.gold}
          onPress={() => onNavigate('goldLotRegistration')}
          badge="Priority"
        />

        <ActionCard
          title="Tag Daily Work Site"
          subtitle="Verify current mining location for compliance"
          icon="location"
          iconFamily="Ionicons"
          color={GHANA_COLORS.green}
          onPress={() => onNavigate('workSiteTagging')}
        />

        <ActionCard
          title="View Mining History"
          subtitle="Access previous discoveries and work sites"
          icon="time"
          iconFamily="Ionicons"
          color={GHANA_COLORS.miningBlue}
          onPress={() => onNavigate('miningHistory')}
        />

        <ActionCard
          title="Generate Certificates"
          subtitle="Create shareable origin certificates"
          icon="document-text"
          iconFamily="Ionicons"
          color={GHANA_COLORS.earthBrown}
          onPress={() => onNavigate('certificates')}
        />

        {/* Status Overview */}
        <View style={{
          backgroundColor: THEME.background,
          borderRadius: 16,
          padding: 20,
          marginTop: 16,
          elevation: 2,
          shadowColor: THEME.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: THEME.text,
            marginBottom: 16,
          }}>
            Today's Summary
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Work Sites Tagged</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>3</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Gold Lots Registered</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.gold }}>1</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Compliance Status</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>✅ Current</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// GOVERNMENT INSPECTOR HOME SCREEN
// ============================================================================

interface GovernmentInspectorHomeProps {
  userRole: UserRole;
  onNavigate: (screen: string) => void;
}

export const GovernmentInspectorHome: React.FC<GovernmentInspectorHomeProps> = ({
  userRole,
  onNavigate,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <GhanaThemedHeader
        title="Inspector Portal"
        subtitle="Ghana Minerals Commission"
        userRole={userRole}
        onSettingsPress={() => onNavigate('settings')}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{
          fontSize: 22,
          fontWeight: '600',
          color: THEME.text,
          marginBottom: 8,
        }}>
          Inspection Tools
        </Text>
        <Text style={{
          fontSize: 16,
          color: THEME.textLight,
          marginBottom: 24,
          lineHeight: 22,
        }}>
          Conduct official inspections and generate compliance reports
        </Text>

        <ActionCard
          title="Routine Compliance Inspection"
          subtitle="Standard monthly site verification"
          icon="clipboard-outline"
          iconFamily="Ionicons"
          color={GHANA_COLORS.miningBlue}
          onPress={() => onNavigate('routineInspection')}
        />

        <ActionCard
          title="Violation Investigation"
          subtitle="Document and investigate regulatory breaches"
          icon="warning"
          iconFamily="Ionicons"
          color={GHANA_COLORS.red}
          onPress={() => onNavigate('violationInvestigation')}
          badge="Urgent"
        />

        <ActionCard
          title="Environmental Assessment"
          subtitle="Environmental impact and compliance review"
          icon="leaf"
          iconFamily="Ionicons"
          color={GHANA_COLORS.green}
          onPress={() => onNavigate('environmentalAssessment')}
        />

        <ActionCard
          title="License Verification"
          subtitle="Verify mining licenses and permits"
          icon="shield-checkmark"
          iconFamily="Ionicons"
          color={GHANA_COLORS.gold}
          onPress={() => onNavigate('licenseVerification')}
        />

        <ActionCard
          title="Generate Reports"
          subtitle="Create official inspection reports"
          icon="document"
          iconFamily="Ionicons"
          color={GHANA_COLORS.earthBrown}
          onPress={() => onNavigate('reportGeneration')}
        />

        {/* Inspector Dashboard */}
        <View style={{
          backgroundColor: THEME.background,
          borderRadius: 16,
          padding: 20,
          marginTop: 16,
          elevation: 2,
          shadowColor: THEME.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: THEME.text,
            marginBottom: 16,
          }}>
            This Week's Activity
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Sites Inspected</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.miningBlue }}>12</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Reports Generated</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>8</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Violations Found</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.red }}>2</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// MINING COMPANY HOME SCREEN
// ============================================================================

interface MiningCompanyHomeProps {
  userRole: UserRole;
  onNavigate: (screen: string) => void;
}

export const MiningCompanyHome: React.FC<MiningCompanyHomeProps> = ({
  userRole,
  onNavigate,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <GhanaThemedHeader
        title="Company Portal"
        subtitle="Licensed Mining Operations"
        userRole={userRole}
        onSettingsPress={() => onNavigate('settings')}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{
          fontSize: 22,
          fontWeight: '600',
          color: THEME.text,
          marginBottom: 8,
        }}>
          Operations Management
        </Text>
        <Text style={{
          fontSize: 16,
          color: THEME.textLight,
          marginBottom: 24,
          lineHeight: 22,
        }}>
          Monitor operations and ensure company-wide compliance
        </Text>

        <ActionCard
          title="Site Operations Dashboard"
          subtitle="Monitor all active mining sites"
          icon="analytics"
          iconFamily="Ionicons"
          color={GHANA_COLORS.green}
          onPress={() => onNavigate('operationsDashboard')}
        />

        <ActionCard
          title="Employee Verification"
          subtitle="Verify worker credentials and activities"
          icon="people"
          iconFamily="Ionicons"
          color={GHANA_COLORS.miningBlue}
          onPress={() => onNavigate('employeeVerification')}
        />

        <ActionCard
          title="Equipment Tracking"
          subtitle="Monitor machinery and equipment deployment"
          icon="construct"
          iconFamily="Ionicons"
          color={GHANA_COLORS.earthBrown}
          onPress={() => onNavigate('equipmentTracking')}
        />

        <ActionCard
          title="Compliance Reports"
          subtitle="Generate operational compliance reports"
          icon="bar-chart"
          iconFamily="Ionicons"
          color={GHANA_COLORS.gold}
          onPress={() => onNavigate('complianceReports')}
        />

        <ActionCard
          title="Multi-Site Overview"
          subtitle="View all mining concessions and sites"
          icon="map"
          iconFamily="Ionicons"
          color={GHANA_COLORS.red}
          onPress={() => onNavigate('multiSiteOverview')}
        />

        {/* Company Dashboard */}
        <View style={{
          backgroundColor: THEME.background,
          borderRadius: 16,
          padding: 20,
          marginTop: 16,
          elevation: 2,
          shadowColor: THEME.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: THEME.text,
            marginBottom: 16,
          }}>
            Company Overview
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Active Sites</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>8</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Active Employees</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.miningBlue }}>156</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Compliance Status</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>✅ Excellent</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// GOLD TRADER HOME SCREEN
// ============================================================================

interface GoldTraderHomeProps {
  userRole: UserRole;
  onNavigate: (screen: string) => void;
}

export const GoldTraderHome: React.FC<GoldTraderHomeProps> = ({
  userRole,
  onNavigate,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <GhanaThemedHeader
        title="Trader Portal"
        subtitle="Commodity Trading & Verification"
        userRole={userRole}
        onSettingsPress={() => onNavigate('settings')}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{
          fontSize: 22,
          fontWeight: '600',
          color: THEME.text,
          marginBottom: 8,
        }}>
          Trading Tools
        </Text>
        <Text style={{
          fontSize: 16,
          color: THEME.textLight,
          marginBottom: 24,
          lineHeight: 22,
        }}>
          Verify gold origins and manage trading compliance
        </Text>

        <ActionCard
          title="Scan Gold Lot Certificate"
          subtitle="Verify origin certificate with QR scanner"
          icon="qr-code-outline"
          iconFamily="Ionicons"
          color={GHANA_COLORS.gold}
          onPress={() => onNavigate('certificateScanner')}
          badge="Quick"
        />

        <ActionCard
          title="Verify Supply Chain"
          subtitle="Trace gold lot from origin to current"
          icon="git-network-outline"
          iconFamily="Ionicons"
          color={GHANA_COLORS.green}
          onPress={() => onNavigate('supplyChainTrace')}
        />

        <ActionCard
          title="Purchase Documentation"
          subtitle="Generate purchase records and receipts"
          icon="receipt-outline"
          iconFamily="Ionicons"
          color={GHANA_COLORS.miningBlue}
          onPress={() => onNavigate('purchaseDocumentation')}
        />

        <ActionCard
          title="Compliance Verification"
          subtitle="Check all regulatory requirements"
          icon="checkmark-circle-outline"
          iconFamily="Ionicons"
          color={GHANA_COLORS.earthBrown}
          onPress={() => onNavigate('complianceVerification')}
        />

        <ActionCard
          title="Trading History"
          subtitle="View all transactions and records"
          icon="library-outline"
          iconFamily="Ionicons"
          color={GHANA_COLORS.red}
          onPress={() => onNavigate('tradingHistory')}
        />

        {/* Trader Dashboard */}
        <View style={{
          backgroundColor: THEME.background,
          borderRadius: 16,
          padding: 20,
          marginTop: 16,
          elevation: 2,
          shadowColor: THEME.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: THEME.text,
            marginBottom: 16,
          }}>
            Trading Summary
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Lots Verified Today</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.gold }}>7</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Total Volume (oz)</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>12.3</Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: THEME.textLight }}>Compliance Rate</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>100%</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// ROLE-BASED NAVIGATION COMPONENT
// ============================================================================

interface RoleBasedNavigationProps {
  currentRole: UserRole | null;
  onRoleChange: () => void;
  children: React.ReactNode;
}

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
  currentRole,
  onRoleChange,
  children,
}) => {
  if (!currentRole) {
    return (
      <RoleSelectionScreen 
        onRoleSelected={(role) => {
          // This would be handled by parent component
          console.log('Role selected:', role);
        }} 
      />
    );
  }

  return <>{children}</>;
};

// ============================================================================
// MAIN APP INTEGRATION COMPONENT
// ============================================================================

interface GeoTagAppProps {
  // Add any props needed from your existing app
}

export const GeoTagApp: React.FC<GeoTagAppProps> = () => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    loadSavedRole();
  }, []);

  const loadSavedRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem('userRole');
      if (savedRole) {
        setCurrentRole(JSON.parse(savedRole));
      }
    } catch (error) {
      console.error('Error loading saved role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentScreen('home');
  };

  const handleRoleChange = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      setCurrentRole(null);
      setCurrentScreen('roleSelection');
    } catch (error) {
      console.error('Error clearing role:', error);
    }
  };

  const handleNavigation = (screen: string) => {
    if (screen === 'settings') {
      // Show settings modal with role change option
      Alert.alert(
        'Settings',
        'What would you like to do?',
        [
          { text: 'Change Role', onPress: handleRoleChange },
          { text: 'App Settings', onPress: () => setCurrentScreen('appSettings') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      setCurrentScreen(screen);
      // Here you would navigate to the actual screens
      console.log(`Navigating to: ${screen}`);
    }
  };

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME.background,
      }}>
        <Text style={{ fontSize: 18, color: THEME.text }}>Loading GeoTag™...</Text>
      </View>
    );
  }

  if (!currentRole) {
    return <RoleSelectionScreen onRoleSelected={handleRoleSelection} />;
  }

  // Render role-specific home screen
  const renderRoleHome = () => {
    switch (currentRole.id) {
      case 'small-scale-miner':
        return (
          <SmallScaleMinerHome 
            userRole={currentRole} 
            onNavigate={handleNavigation}
          />
        );
      case 'government-inspector':
        return (
          <GovernmentInspectorHome 
            userRole={currentRole} 
            onNavigate={handleNavigation}
          />
        );
      case 'mining-company':
        return (
          <MiningCompanyHome 
            userRole={currentRole} 
            onNavigate={handleNavigation}
          />
        );
      case 'gold-trader':
        return (
          <GoldTraderHome 
            userRole={currentRole} 
            onNavigate={handleNavigation}
          />
        );
      default:
        return (
          <SmallScaleMinerHome 
            userRole={currentRole} 
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderRoleHome()}
    </View>
  );
};

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

/*

INTEGRATION WITH EXISTING GEOTAG™ APP:

1. REPLACE YOUR CURRENT APP.TSX:
   - Import and use <GeoTagApp /> as your root component
   - This will show role selection on first launch
   - After role selection, users see role-specific home screens

2. CONNECT TO YOUR EXISTING SCREENS:
   - In handleNavigation() function, replace console.log with your navigation
   - Map the action names to your existing screen components
   - For example: 'goldLotRegistration' → navigate to your gold lot registration flow

3. PRESERVE YOUR EXISTING FUNCTIONALITY:
   - All your GPS tracking, crypto, and database code remains unchanged
   - Role-based onboarding simply adds context-driven entry points
   - Users get guided to your existing technical features

4. INSTALL DEPENDENCIES:
   npm install @react-native-async-storage/async-storage react-native-reanimated expo-linear-gradient

5. UPDATE YOUR EXISTING SCREENS:
   - Add role context to improve UX
   - Use the Ghana color theme for consistency
   - Add role-specific features as needed

EXAMPLE INTEGRATION:
```typescript
// In your existing App.tsx
import { GeoTagApp } from './src/components/onboarding/GeoTagApp';

export default function App() {
  return <GeoTagApp />;
}
```

NAVIGATION MAPPING:
- 'goldLotRegistration' → Your new gold lot registration workflow
- 'workSiteTagging' → Your daily work site tagging feature  
- 'routineInspection' → Your government inspection workflow
- 'certificateScanner' → Your QR code certificate scanner
- etc.

This role-based onboarding transforms your technical GPS app into a contextual 
mining workflow system while preserving all your excellent existing functionality.

*/