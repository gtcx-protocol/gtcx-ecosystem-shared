// ============================================================================
// TRADEPASS™ GPS TRACKING - GOVERNMENT-GRADE LOCATION VERIFICATION
// Simplified GPS interface focused on core functionality
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  // SafeAreaView,
} from 'react-native';
// import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useLocation } from '../src/store/location';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

export default function GPS() {
  // const router = useRouter();
  const location = useLocation();
  const { 
    currentLocation, 
    isTracking, 
    isLoading,
    startTracking, 
    stopTracking, 
    requestPermissions,
    isLocationEnabled 
  } = location;

  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid' | 'terrain'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(0.001); // Default close zoom for mining precision
  const [showDebug, setShowDebug] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      try {
        await requestPermissions();
      } catch (error) {
        console.warn('Permission request failed:', error);
      }
    })();
  }, [requestPermissions]);

  const handleStartGPS = async () => {
    console.log('🎯 GPS Start button pressed!');
    setIsFindingLocation(true);
    
    try {
      console.log('🎯 Calling startTracking from location store...');
      await startTracking();
      console.log('🎯 GPS tracking started successfully!');
      
      setTimeout(() => {
        setIsFindingLocation(false);
      }, 1500);
    } catch (error) {
      console.error('❌ GPS Start failed:', error);
      Alert.alert(
        'Enable Precise Location',
        'Government‑grade tracking requires precise location. Please enable Location Permissions and Precise Location in system settings.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsFindingLocation(false) },
          { text: 'Open Settings', onPress: () => {
            setIsFindingLocation(false);
            Linking.openSettings();
          }},
        ]
      );
      setIsFindingLocation(false);
    }
  };

  const handleStopGPS = async () => {
    try {
      await stopTracking();
      console.log('✅ GPS tracking stopped');
    } catch (error) {
      console.error('❌ Failed to stop GPS:', error);
      Alert.alert('Error', 'Failed to stop GPS tracking');
    }
  };

  const getStatusMessage = () => {
    if (isFindingLocation) return '🔍 Finding location...';
    if (isLoading) return '⏳ Loading GPS...';
    if (isTracking && !currentLocation) return '🛰️ GPS searching for signal...';
    if (isTracking && currentLocation) return '✅ GPS Active';
    if (currentLocation) return '📍 Location Found';
    return '❌ GPS Inactive';
  };

  const getStatusColor = () => {
    if (isFindingLocation || isLoading) return '#fbbf24'; // Yellow
    if (isTracking) return '#10b981'; // Green
    if (currentLocation) return '#3b82f6'; // Blue
    return '#ef4444'; // Red
  };

  const formatCoordinate = (coord: number) => coord.toFixed(6);
  const formatAccuracy = (accuracy: number) => `${accuracy.toFixed(1)}m`;

  const zoomIn = () => {
    setZoomLevel(prev => Math.max(prev / 2, 0.0001)); // Maximum zoom for mining precision
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.min(prev * 2, 0.1)); // Maximum area view
  };

  const getZoomLabel = () => {
    if (zoomLevel <= 0.0005) return 'Precision Mining';
    if (zoomLevel <= 0.001) return 'Site Detail';
    if (zoomLevel <= 0.005) return 'Area View';
    return 'Regional View';
  };

  return (
    <Layout headerTitle="GPS Tracking" showBackButton={true}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleSection}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.title}>GPS Tracking</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {isTracking ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive Map View */}
        {currentLocation && (
          <View style={styles.mapCard}>
            <View style={styles.mapHeader}>
              <View style={styles.mapControls}>
                <TouchableOpacity
                  style={[styles.mapTypeButton, mapType === 'satellite' && styles.mapTypeActive]}
                  onPress={() => setMapType('satellite')}
                >
                  <Text style={[styles.mapTypeText, mapType === 'satellite' && styles.mapTypeTextActive]}>Satellite</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mapTypeButton, mapType === 'hybrid' && styles.mapTypeActive]}
                  onPress={() => setMapType('hybrid')}
                >
                  <Text style={[styles.mapTypeText, mapType === 'hybrid' && styles.mapTypeTextActive]}>Hybrid</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mapTypeButton, mapType === 'standard' && styles.mapTypeActive]}
                  onPress={() => setMapType('standard')}
                >
                  <Text style={[styles.mapTypeText, mapType === 'standard' && styles.mapTypeTextActive]}>Map</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                mapType={mapType}
                showsUserLocation={false} // We'll use custom marker
                showsMyLocationButton={false}
                showsCompass={true}
                showsScale={true}
                toolbarEnabled={false}
                loadingEnabled={true}
                region={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: zoomLevel,
                  longitudeDelta: zoomLevel,
                }}
                onRegionChangeComplete={(region) => {
                  setZoomLevel(region.latitudeDelta);
                }}
              >
                {/* GPS Location Marker */}
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Current GPS Position"
                  description={`Accuracy: ${formatAccuracy(currentLocation.accuracy)}`}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View style={styles.customMarker}>
                    <View style={[styles.markerDot, { backgroundColor: getStatusColor() }]} />
                    <View style={[styles.markerPulse, { borderColor: getStatusColor() }]} />
                  </View>
                </Marker>

                {/* Accuracy Circle */}
                <Circle
                  center={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  radius={currentLocation.accuracy} // Radius in meters
                  strokeColor={getStatusColor()}
                  strokeWidth={2}
                  fillColor={`${getStatusColor()}20`} // 20% opacity
                />
              </MapView>
              
              {/* Map Info Overlay */}
              <View style={styles.mapInfo}>
                <View style={styles.locationPill}>
                  <View style={[styles.locationDot, { backgroundColor: getStatusColor() }]} />
                  <Text style={styles.mapCoords}>
                    {formatCoordinate(currentLocation.latitude)}, {formatCoordinate(currentLocation.longitude)}
                  </Text>
                </View>
                <Text style={styles.mapAccuracy}>
                  Accurate to {formatAccuracy(currentLocation.accuracy)} • {getZoomLabel()}
                </Text>
              </View>
              
              {/* Zoom Controls */}
              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
                  <Ionicons name="add" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
                  <Ionicons name="remove" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Location Details Card */}
        {currentLocation && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Latitude</Text>
                <Text style={styles.detailValue}>{formatCoordinate(currentLocation.latitude)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Longitude</Text>
                <Text style={styles.detailValue}>{formatCoordinate(currentLocation.longitude)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Accuracy</Text>
                <Text style={[styles.detailValue, styles.accuracyValue]}>
                  {formatAccuracy(currentLocation.accuracy)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Updated</Text>
                <Text style={styles.detailValue}>
                  {currentLocation.timestamp 
                    ? new Date(currentLocation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Unknown'
                  }
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* No Location State */}
        {!currentLocation && (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateContent}>
              <Ionicons 
                name={isTracking ? "radio" : "location-outline"} 
                size={44} 
                color={isTracking ? "#FF9500" : "#8E8E93"} 
              />
              <Text style={styles.emptyStateTitle}>
                {isTracking ? "Finding Your Location" : "Location Tracking"}
              </Text>
              <Text style={styles.emptyStateMessage}>
                {isFindingLocation || isLoading 
                  ? 'Initializing GPS hardware...' 
                  : isTracking 
                    ? 'Searching for GPS signal. This may take a moment outdoors.'
                    : 'Start GPS tracking to see your precise location on the map.'
                }
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!isTracking ? (
            <View style={styles.startSection}>
              <TradePassButton
                title={isFindingLocation || isLoading ? 'Finding Location...' : 'Start GPS'}
                onPress={handleStartGPS}
                variant="primary"
                size="large"
                icon={isFindingLocation || isLoading ? 'time' : 'play'}
                disabled={isFindingLocation || isLoading}
              />
              {(isFindingLocation || isLoading) && (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="small" color="#10b981" />
                  <Text style={styles.loadingText}>Acquiring GPS signal...</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.trackingSection}>
              {/* Minimized Tracking Pill */}
              <View style={styles.trackingPill}>
                <View style={styles.pillInfo}>
                  <Ionicons name="radio-button-on" size={16} color="#10b981" />
                  <Text style={styles.pillText}>
                    GPS Active • {currentLocation ? formatAccuracy(currentLocation.accuracy) : '—'}
                  </Text>
                </View>
                <TradePassButton
                  title="Stop"
                  onPress={handleStopGPS}
                  variant="danger"
                  size="small"
                  icon="stop"
                />
              </View>
            </View>
          )}
        </View>

        {/* Debug Toggle Button */}
        <View style={styles.debugSection}>
          <TouchableOpacity 
            style={styles.debugToggle}
            onPress={() => setShowDebug(!showDebug)}
          >
            <Ionicons name="bug" size={16} color="#8E8E93" />
            <Text style={styles.debugToggleText}>Debug Info</Text>
            <Ionicons 
              name={showDebug ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#8E8E93" 
            />
          </TouchableOpacity>

          {/* Debug Info Section */}
          {showDebug && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>• Location Enabled: {isLocationEnabled ? '✅' : '❌'}</Text>
              <Text style={styles.debugText}>• Is Tracking: {isTracking ? '✅' : '❌'}</Text>
              <Text style={styles.debugText}>• Is Loading: {isLoading ? '✅' : '❌'}</Text>
              <Text style={styles.debugText}>• Finding Location: {isFindingLocation ? '✅' : '❌'}</Text>
              <Text style={styles.debugText}>• Has Location Data: {currentLocation ? '✅' : '❌'}</Text>
              <Text style={styles.debugText}>• Status: {getStatusMessage()}</Text>
            </View>
          )}
        </View>

        {/* Permission Help */}
        {!isLocationEnabled && !isTracking && !isFindingLocation && !isLoading && (
          <View style={styles.helpSection}>
            <View style={styles.helpCard}>
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Enable Location Services</Text>
                <Text style={styles.helpText}>
                  TradePass requires precise location access for government-grade verification.
                </Text>
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={() => Linking.openSettings()}
                >
                  <Text style={styles.settingsButtonText}>Open Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Troubleshooting Help */}
        {isTracking && !currentLocation && (
          <View style={styles.troubleshootSection}>
            <View style={styles.troubleshootCard}>
              <Ionicons name="warning-outline" size={20} color="#f59e0b" />
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>GPS Taking Too Long?</Text>
                <Text style={styles.helpText}>
                  • Move to an open area with clear sky view{'\n'}
                  • GPS can take 30-60 seconds for first fix{'\n'}
                  • Check iOS Settings → Privacy → Location Services{'\n'}
                  • Ensure "Precise Location" is ON for Expo Go
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.37,
  },
  statusBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0,
  },
  statusBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  startSection: {
    gap: 16,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  trackingSection: {
    // Minimized pill when tracking
  },
  trackingPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  pillText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '600',
  },
  helpSection: {
    marginTop: 'auto',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  helpContent: {
    flex: 1,
    gap: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  helpText: {
    fontSize: 14,
    color: '#bfdbfe',
    lineHeight: 20,
  },
  settingsButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  troubleshootSection: {
    marginBottom: 16,
  },
  troubleshootCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#7c2d12',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 360, // Larger map for Apple-style prominence
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapHeader: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  mapControls: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mapTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  mapTypeActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapTypeText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  mapTypeTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  customMarker: {
    position: 'relative',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  markerPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    opacity: 0.3,
  },
  mapInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 80, // Leave space for zoom controls
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoomControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  zoomButton: {
    width: 44,
    height: 44,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.29)',
  },
  mapCoords: {
    fontSize: 13,
    color: '#000000',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  mapAccuracy: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  
  // Apple-style card designs
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: 0.35,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '40%',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  accuracyValue: {
    color: '#007AFF',
  },
  
  emptyStateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.35,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    maxWidth: 280,
  },
  
  debugSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  debugToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  debugToggleText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '600',
  },
  debugInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
});