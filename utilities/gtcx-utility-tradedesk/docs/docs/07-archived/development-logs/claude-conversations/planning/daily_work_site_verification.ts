// ============================================================================
// GEOTAG™ DAILY WORK SITE VERIFICATION INTERFACE
// Streamlined compliance tracking for licensed miners
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
  AppState,
  BackgroundTimer,
} from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

// ============================================================================
// CONSTANTS AND THEME
// ============================================================================

const GHANA_COLORS = {
  red: '#CE1126',
  gold: '#FCD116',
  green: '#006B3F',
  black: '#000000',
  white: '#FFFFFF',
  darkGreen: '#004D2E',
  lightGold: '#FFE55C',
};

const LOCATION_TASK_NAME = 'background-location-task';
const PHOTO_TASK_NAME = 'auto-photo-task';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface WorkLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

interface WorkSession {
  id: string;
  startTime: number;
  endTime?: number;
  workType: WorkType;
  crewSize: number;
  equipment: string[];
  locations: WorkLocation[];
  photos: string[];
  breaks: BreakRecord[];
  incidents: IncidentRecord[];
  totalHours: number;
  complianceScore: number;
}

interface BreakRecord {
  startTime: number;
  endTime?: number;
  type: 'break' | 'lunch' | 'safety';
}

interface IncidentRecord {
  timestamp: number;
  type: 'safety' | 'equipment' | 'environmental' | 'other';
  description: string;
  location: WorkLocation;
  photos: string[];
}

type WorkType = 'surface_mining' | 'pit_excavation' | 'equipment_maintenance' | 'site_inspection' | 'other';

type SessionStatus = 'idle' | 'working' | 'break' | 'lunch';

// ============================================================================
// BACKGROUND TASKS
// ============================================================================

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as any;
    try {
      const currentSession = await AsyncStorage.getItem('currentWorkSession');
      if (currentSession) {
        const session: WorkSession = JSON.parse(currentSession);
        const newLocation: WorkLocation = {
          latitude: locations[0].coords.latitude,
          longitude: locations[0].coords.longitude,
          timestamp: locations[0].timestamp,
          accuracy: locations[0].coords.accuracy,
        };
        
        session.locations.push(newLocation);
        await AsyncStorage.setItem('currentWorkSession', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Background location storage error:', error);
    }
  }
});

// ============================================================================
// QUICK ACTION PANEL COMPONENT
// ============================================================================

interface QuickActionPanelProps {
  sessionStatus: SessionStatus;
  onStartWork: () => void;
  onBreak: () => void;
  onLunch: () => void;
  onEndWork: () => void;
  onIncidentReport: () => void;
  isLoading: boolean;
}

const QuickActionPanel: React.FC<QuickActionPanelProps> = ({
  sessionStatus,
  onStartWork,
  onBreak,
  onLunch,
  onEndWork,
  onIncidentReport,
  isLoading,
}) => {
  const getActionButtons = () => {
    switch (sessionStatus) {
      case 'idle':
        return [
          {
            id: 'start',
            title: 'START WORK DAY',
            icon: 'play-circle',
            color: GHANA_COLORS.green,
            onPress: onStartWork,
            size: 'large',
          },
        ];
      case 'working':
        return [
          {
            id: 'break',
            title: 'BREAK',
            icon: 'pause-circle',
            color: GHANA_COLORS.gold,
            onPress: onBreak,
            size: 'medium',
          },
          {
            id: 'lunch',
            title: 'LUNCH',
            icon: 'restaurant',
            color: '#FF8C00',
            onPress: onLunch,
            size: 'medium',
          },
          {
            id: 'end',
            title: 'END WORK',
            icon: 'stop-circle',
            color: GHANA_COLORS.red,
            onPress: onEndWork,
            size: 'medium',
          },
        ];
      case 'break':
      case 'lunch':
        return [
          {
            id: 'resume',
            title: 'RESUME WORK',
            icon: 'play-circle',
            color: GHANA_COLORS.green,
            onPress: onStartWork,
            size: 'large',
          },
          {
            id: 'end',
            title: 'END WORK',
            icon: 'stop-circle',
            color: GHANA_COLORS.red,
            onPress: onEndWork,
            size: 'medium',
          },
        ];
      default:
        return [];
    }
  };

  const actionButtons = getActionButtons();

  return (
    <View style={{
      backgroundColor: GHANA_COLORS.white,
      borderRadius: 16,
      padding: 20,
      margin: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: GHANA_COLORS.black,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        Quick Actions
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {actionButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={{
              backgroundColor: button.color,
              borderRadius: 12,
              paddingVertical: button.size === 'large' ? 20 : 16,
              paddingHorizontal: button.size === 'large' ? 32 : 24,
              margin: 8,
              alignItems: 'center',
              minWidth: button.size === 'large' ? 200 : 120,
              elevation: 3,
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={button.onPress}
            disabled={isLoading}
          >
            <Ionicons
              name={button.icon as any}
              size={button.size === 'large' ? 32 : 24}
              color={GHANA_COLORS.white}
              style={{ marginBottom: 8 }}
            />
            <Text style={{
              fontSize: button.size === 'large' ? 16 : 14,
              fontWeight: '600',
              color: GHANA_COLORS.white,
              textAlign: 'center',
            }}>
              {button.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Incident Report Button - Always Available */}
      <TouchableOpacity
        style={{
          backgroundColor: '#FF4444',
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 20,
          marginTop: 16,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#FF6666',
        }}
        onPress={onIncidentReport}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="report-problem" size={20} color={GHANA_COLORS.white} />
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: GHANA_COLORS.white,
            marginLeft: 8,
          }}>
            📋 INCIDENT REPORT
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// ============================================================================
// WORK SESSION TIMER COMPONENT
// ============================================================================

interface WorkSessionTimerProps {
  session: WorkSession | null;
  sessionStatus: SessionStatus;
}

const WorkSessionTimer: React.FC<WorkSessionTimerProps> = ({
  session,
  sessionStatus,
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessionStatus === 'working') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [sessionStatus]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'working': return GHANA_COLORS.green;
      case 'break': return GHANA_COLORS.gold;
      case 'lunch': return '#FF8C00';
      default: return '#999';
    }
  };

  const getStatusText = () => {
    switch (sessionStatus) {
      case 'working': return 'WORKING';
      case 'break': return 'ON BREAK';
      case 'lunch': return 'LUNCH BREAK';
      default: return 'NOT STARTED';
    }
  };

  const getElapsedTime = () => {
    if (!session || !session.startTime) return 0;
    return currentTime - session.startTime;
  };

  return (
    <View style={{
      backgroundColor: GHANA_COLORS.white,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: GHANA_COLORS.black,
        }}>
          Work Session
        </Text>
        <View style={{
          backgroundColor: getStatusColor(),
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: GHANA_COLORS.white,
          }}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Animated.View style={{
          transform: [{ scale: sessionStatus === 'working' ? pulseAnim : 1 }],
        }}>
          <Text style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: getStatusColor(),
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          }}>
            {formatTime(getElapsedTime())}
          </Text>
        </Animated.View>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginTop: 4,
        }}>
          Total Time Today
        </Text>
      </View>

      {session && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: GHANA_COLORS.green }}>
              {session.locations.length}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Locations</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: GHANA_COLORS.gold }}>
              {session.photos.length}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Photos</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: GHANA_COLORS.red }}>
              {session.breaks.length}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Breaks</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// LOCATION TRACKER COMPONENT
// ============================================================================

interface LocationTrackerProps {
  session: WorkSession | null;
  currentLocation: WorkLocation | null;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({
  session,
  currentLocation,
}) => {
  const mapRef = useRef<MapView>(null);

  const getMapRegion = () => {
    if (!currentLocation) return null;
    
    return {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  };

  const centerOnCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <View style={{
      backgroundColor: GHANA_COLORS.white,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      overflow: 'hidden',
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: GHANA_COLORS.black,
        }}>
          Today's Work Locations
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: GHANA_COLORS.gold,
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={centerOnCurrentLocation}
        >
          <Ionicons name="locate" size={20} color={GHANA_COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 200 }}>
        {getMapRegion() ? (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={getMapRegion()!}
            showsUserLocation
            showsMyLocationButton={false}
            loadingEnabled
          >
            {/* Current Location */}
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Current Location"
                pinColor={GHANA_COLORS.green}
              />
            )}

            {/* Work Path */}
            {session && session.locations.length > 1 && (
              <Polyline
                coordinates={session.locations.map(loc => ({
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }))}
                strokeColor={GHANA_COLORS.gold}
                strokeWidth={3}
                strokePattern={[10, 5]}
              />
            )}

            {/* Work Area Coverage */}
            {session && session.locations.length > 0 && (
              <Circle
                center={{
                  latitude: session.locations[session.locations.length - 1].latitude,
                  longitude: session.locations[session.locations.length - 1].longitude,
                }}
                radius={100}
                fillColor="rgba(252, 209, 22, 0.2)"
                strokeColor={GHANA_COLORS.gold}
                strokeWidth={2}
              />
            )}
          </MapView>
        ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
          }}>
            <Ionicons name="location-outline" size={48} color="#CCC" />
            <Text style={{
              fontSize: 16,
              color: '#666',
              marginTop: 8,
              textAlign: 'center',
            }}>
              Waiting for GPS signal...
            </Text>
          </View>
        )}
      </View>

      {/* Location Stats */}
      {currentLocation && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 16,
          backgroundColor: '#F8F9FA',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.black }}>
              {currentLocation.latitude.toFixed(6)}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Latitude</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.black }}>
              {currentLocation.longitude.toFixed(6)}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Longitude</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: GHANA_COLORS.green }}>
              ±{currentLocation.accuracy.toFixed(1)}m
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Accuracy</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// DAILY SUMMARY COMPONENT
// ============================================================================

interface DailySummaryProps {
  sessions: WorkSession[];
  currentSession: WorkSession | null;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  sessions,
  currentSession,
}) => {
  const getTotalHours = () => {
    const completedHours = sessions.reduce((total, session) => total + session.totalHours, 0);
    const currentHours = currentSession ? (Date.now() - currentSession.startTime) / (1000 * 60 * 60) : 0;
    return completedHours + currentHours;
  };

  const getTotalLocations = () => {
    const completedLocations = sessions.reduce((total, session) => total + session.locations.length, 0);
    const currentLocations = currentSession ? currentSession.locations.length : 0;
    return completedLocations + currentLocations;
  };

  const getTotalPhotos = () => {
    const completedPhotos = sessions.reduce((total, session) => total + session.photos.length, 0);
    const currentPhotos = currentSession ? currentSession.photos.length : 0;
    return completedPhotos + currentPhotos;
  };

  const getComplianceScore = () => {
    if (sessions.length === 0 && !currentSession) return 0;
    const totalSessions = sessions.length + (currentSession ? 1 : 0);
    const totalScore = sessions.reduce((sum, session) => sum + session.complianceScore, 0) + 
                     (currentSession ? 85 : 0); // Assume current session has good compliance
    return Math.round(totalScore / totalSessions);
  };

  return (
    <View style={{
      backgroundColor: GHANA_COLORS.white,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: GHANA_COLORS.black,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        📊 Today's Summary
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        <View style={{
          width: '48%',
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: GHANA_COLORS.green,
          }}>
            {getTotalHours().toFixed(1)}h
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
          }}>
            Total Hours
          </Text>
        </View>

        <View style={{
          width: '48%',
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: GHANA_COLORS.gold,
          }}>
            {getTotalLocations()}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
          }}>
            Locations Tagged
          </Text>
        </View>

        <View style={{
          width: '48%',
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: GHANA_COLORS.red,
          }}>
            {getTotalPhotos()}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
          }}>
            Evidence Photos
          </Text>
        </View>

        <View style={{
          width: '48%',
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: getComplianceScore() >= 80 ? GHANA_COLORS.green : 
                   getComplianceScore() >= 60 ? GHANA_COLORS.gold : GHANA_COLORS.red,
          }}>
            {getComplianceScore()}%
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
          }}>
            Compliance Score
          </Text>
        </View>
      </View>

      {/* Compliance Status */}
      <View style={{
        backgroundColor: getComplianceScore() >= 80 ? 'rgba(0, 107, 63, 0.1)' : 
                       getComplianceScore() >= 60 ? 'rgba(252, 209, 22, 0.1)' : 'rgba(206, 17, 38, 0.1)',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: getComplianceScore() >= 80 ? GHANA_COLORS.green : 
                        getComplianceScore() >= 60 ? GHANA_COLORS.gold : GHANA_COLORS.red,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: GHANA_COLORS.black,
          marginBottom: 4,
        }}>
          {getComplianceScore() >= 80 ? '✅ Excellent Compliance' :
           getComplianceScore() >= 60 ? '⚠️ Good Compliance' : '❌ Needs Improvement'}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
          lineHeight: 16,
        }}>
          {getComplianceScore() >= 80 
            ? 'Meeting all regulatory requirements. Keep up the excellent work!'
            : getComplianceScore() >= 60 
            ? 'Good tracking. Consider adding more location points and photos.'
            : 'Increase location frequency and evidence collection for better compliance.'
          }
        </Text>
      </View>
    </View>
  );
};

// ============================================================================
// WORK TYPE SELECTOR COMPONENT
// ============================================================================

interface WorkTypeSelectorProps {
  selectedType: WorkType;
  onTypeSelected: (type: WorkType) => void;
  onClose: () => void;
}

const WorkTypeSelector: React.FC<WorkTypeSelectorProps> = ({
  selectedType,
  onTypeSelected,
  onClose,
}) => {
  const workTypes: { type: WorkType; label: string; icon: string; description: string }[] = [
    {
      type: 'surface_mining',
      label: 'Surface Mining',
      icon: 'hammer',
      description: 'Open pit and surface gold extraction',
    },
    {
      type: 'pit_excavation',
      label: 'Pit Excavation',
      icon: 'construct',
      description: 'Deep pit digging and excavation work',
    },
    {
      type: 'equipment_maintenance',
      label: 'Equipment Maintenance',
      icon: 'build',
      description: 'Machinery servicing and repairs',
    },
    {
      type: 'site_inspection',
      label: 'Site Inspection',
      icon: 'eye',
      description: 'Safety and compliance inspection',
    },
    {
      type: 'other',
      label: 'Other Activities',
      icon: 'ellipsis-horizontal',
      description: 'Other mining-related work',
    },
  ];

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <View style={{
        backgroundColor: GHANA_COLORS.white,
        borderRadius: 16,
        padding: 20,
        margin: 20,
        maxWidth: 350,
        width: '90%',
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: GHANA_COLORS.black,
          }}>
            Select Work Type
          </Text>
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#F0F0F0',
            }}
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color={GHANA_COLORS.black} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {workTypes.map((workType) => (
            <TouchableOpacity
              key={workType.type}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: selectedType === workType.type ? 'rgba(252, 209, 22, 0.1)' : 'transparent',
                borderWidth: selectedType === workType.type ? 2 : 1,
                borderColor: selectedType === workType.type ? GHANA_COLORS.gold : '#E5E5E5',
                marginBottom: 12,
              }}
              onPress={() => onTypeSelected(workType.type)}
            >
              <View style={{
                width: 48,
                height: