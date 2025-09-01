// ============================================================================
// TRADEPASS™ BACKGROUND LOCATION SERVICE
// Government-grade GPS tracking with background persistence
// ============================================================================

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Platform import removed - not used in current implementation
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';

const BACKGROUND_LOCATION_TASK = 'background-location';
const LOCATION_STORAGE_KEY = 'tradepass_background_locations';
const TRACKING_STATE_KEY = 'tradepass_tracking_state';

// Location data structure for background tracking
export interface BackgroundLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  sessionId: string;
  source: 'background' | 'foreground';
}

export interface BackgroundTrackingSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  locations: BackgroundLocationData[];
  totalDistance: number;
  averageAccuracy: number;
  status: 'active' | 'paused' | 'completed';
}

class BackgroundLocationService {
  private static instance: BackgroundLocationService;
  private currentSessionId: string | null = null;
  private isTrackingActive = false;
  private locationBuffer: BackgroundLocationData[] = [];
  // Buffer size for location storage optimization

  private constructor() {
    this.initializeBackgroundTask();
  }

  static getInstance(): BackgroundLocationService {
    if (!BackgroundLocationService.instance) {
      BackgroundLocationService.instance = new BackgroundLocationService();
    }
    return BackgroundLocationService.instance;
  }

  private initializeBackgroundTask() {
    console.log('🔧 TradePass: Initializing background location task...');

    TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
      if (error) {
        console.error('❌ Background location error:', error);
        return;
      }
      
      if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };
        console.log('📍 Background location update:', locations.length, 'locations received');
        
        locations.forEach(location => {
          this.processBackgroundLocation(location);
        });
      }
    });
  }

  private async processBackgroundLocation(location: Location.LocationObject) {
    if (!this.currentSessionId || !this.isTrackingActive) {
      console.warn('⚠️ Received background location but tracking is not active');
      return;
    }

    const backgroundLocation: BackgroundLocationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 999,
      timestamp: location.timestamp,
      altitude: location.coords.altitude,
      heading: location.coords.heading,
      speed: location.coords.speed,
      sessionId: this.currentSessionId,
      source: 'background',
    };

    // Add to buffer
    this.locationBuffer.push(backgroundLocation);
    console.log(`📍 Background location buffered: ${backgroundLocation.latitude.toFixed(6)}, ${backgroundLocation.longitude.toFixed(6)} (±${backgroundLocation.accuracy.toFixed(1)}m)`);

    // Persist buffer periodically
    if (this.locationBuffer.length >= 10) {
      await this.persistLocationBuffer();
    }

    // Send notification for significant location updates (optional)
    if (backgroundLocation.accuracy < 10) {
      await this.sendLocationNotification(backgroundLocation);
    }
  }

  async startBackgroundTracking(): Promise<string> {
    console.log('🛰️ TradePass: Starting background GPS tracking...');
    
    try {
      // Check permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission not granted');
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        throw new Error('Background location permission not granted');
      }

      // Request notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      console.log('🔔 Notification permission status:', notificationStatus);

      // Generate new session ID
      this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.isTrackingActive = true;

      // Save tracking state
      await AsyncStorage.setItem(TRACKING_STATE_KEY, JSON.stringify({
        isActive: true,
        sessionId: this.currentSessionId,
        startTime: Date.now(),
      }));

      // Start background location task
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 1, // 1 meter
        deferredUpdatesInterval: 10000, // 10 seconds
        foregroundService: {
          notificationTitle: 'TradePass GPS Active',
          notificationBody: 'Government-grade location tracking in progress',
          notificationColor: '#10b981',
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
      });

      // Set up background fetch for persistence
      await BackgroundFetch.registerTaskAsync('persist-location-data', {
        minimumInterval: 30000, // 30 seconds
      });

      console.log(`✅ Background tracking started with session ID: ${this.currentSessionId}`);
      
      // Send start notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'TradePass GPS Started',
          body: `Government-grade tracking active • Session ${this.currentSessionId.slice(-6)}`,
          data: { sessionId: this.currentSessionId },
        },
        trigger: null,
      });

      return this.currentSessionId;
    } catch (error) {
      console.error('❌ Failed to start background tracking:', error);
      this.isTrackingActive = false;
      this.currentSessionId = null;
      throw error;
    }
  }

  async stopBackgroundTracking(): Promise<void> {
    console.log('🛑 TradePass: Stopping background GPS tracking...');
    
    try {
      // Stop location updates
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      }

      // Unregister background fetch
      try {
        await BackgroundFetch.unregisterTaskAsync('persist-location-data');
      } catch (e) {
        console.warn('Background fetch task was not registered:', e);
      }

      // Persist remaining buffer
      if (this.locationBuffer.length > 0) {
        await this.persistLocationBuffer();
      }

      // Mark session as completed
      if (this.currentSessionId) {
        await this.completeTrackingSession();
        
        // Send completion notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'TradePass GPS Stopped',
            body: `Session completed • ${this.locationBuffer.length} locations recorded`,
            data: { sessionId: this.currentSessionId },
          },
          trigger: null,
        });
      }

      // Clear state
      this.isTrackingActive = false;
      this.currentSessionId = null;
      this.locationBuffer = [];

      // Update stored state
      await AsyncStorage.setItem(TRACKING_STATE_KEY, JSON.stringify({
        isActive: false,
        sessionId: null,
        startTime: null,
      }));

      console.log('✅ Background tracking stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping background tracking:', error);
      throw error;
    }
  }

  async isBackgroundTrackingActive(): Promise<boolean> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      const stateData = await AsyncStorage.getItem(TRACKING_STATE_KEY);
      const state = stateData ? JSON.parse(stateData) : { isActive: false };
      
      return isRegistered && state.isActive && this.isTrackingActive;
    } catch (error) {
      console.error('❌ Error checking background tracking status:', error);
      return false;
    }
  }

  async getCurrentSession(): Promise<BackgroundTrackingSession | null> {
    if (!this.currentSessionId) return null;

    try {
      const sessions = await this.getAllSessions();
      return sessions.find(session => session.sessionId === this.currentSessionId) || null;
    } catch (error) {
      console.error('❌ Error getting current session:', error);
      return null;
    }
  }

  private async persistLocationBuffer(): Promise<void> {
    if (this.locationBuffer.length === 0) return;

    try {
      console.log(`💾 Persisting ${this.locationBuffer.length} locations to storage...`);
      
      const existingData = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      const allLocations = existingData ? JSON.parse(existingData) : [];
      
      // Add buffer to stored locations
      allLocations.push(...this.locationBuffer);
      
      // Keep only last 1000 locations to prevent storage bloat
      const recentLocations = allLocations.slice(-1000);
      
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(recentLocations));
      
      console.log(`✅ ${this.locationBuffer.length} locations persisted successfully`);
      
      // Clear buffer
      this.locationBuffer = [];
    } catch (error) {
      console.error('❌ Error persisting location buffer:', error);
    }
  }

  private async completeTrackingSession(): Promise<void> {
    if (!this.currentSessionId) return;

    try {
      const sessionData = await AsyncStorage.getItem(`session_${this.currentSessionId}`);
      const session: BackgroundTrackingSession = sessionData ? 
        JSON.parse(sessionData) : 
        {
          sessionId: this.currentSessionId,
          startTime: Date.now(),
          locations: [],
          totalDistance: 0,
          averageAccuracy: 0,
          status: 'active',
        };

      // Get all locations for this session
      const allLocations = await this.getStoredLocations();
      const sessionLocations = allLocations.filter(loc => loc.sessionId === this.currentSessionId);

      // Calculate session metrics
      const totalDistance = this.calculateTotalDistance(sessionLocations);
      const averageAccuracy = sessionLocations.length > 0 ? 
        sessionLocations.reduce((sum, loc) => sum + loc.accuracy, 0) / sessionLocations.length : 0;

      // Update session
      const completedSession: BackgroundTrackingSession = {
        ...session,
        endTime: Date.now(),
        locations: sessionLocations,
        totalDistance,
        averageAccuracy,
        status: 'completed',
      };

      await AsyncStorage.setItem(`session_${this.currentSessionId}`, JSON.stringify(completedSession));
      console.log(`✅ Session ${this.currentSessionId} completed with ${sessionLocations.length} locations`);
    } catch (error) {
      console.error('❌ Error completing tracking session:', error);
    }
  }

  private calculateTotalDistance(locations: BackgroundLocationData[]): number {
    let totalDistance = 0;
    
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      
      // Ensure both locations exist before calculation
      if (!prev || !curr) continue;
      
      // Haversine formula for distance calculation
      const R = 6371000; // Earth radius in meters
      const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
      const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      totalDistance += distance;
    }
    
    return totalDistance;
  }

  private async sendLocationNotification(location: BackgroundLocationData): Promise<void> {
    try {
      // Only send notifications for high-accuracy locations to avoid spam
      if (location.accuracy > 10) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'High-Accuracy Location',
          body: `GPS: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (±${location.accuracy.toFixed(1)}m)`,
          data: { location },
        },
        trigger: null,
      });
    } catch (error) {
      console.warn('⚠️ Failed to send location notification:', error);
    }
  }

  // Public methods for accessing stored data
  async getStoredLocations(): Promise<BackgroundLocationData[]> {
    try {
      const data = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error getting stored locations:', error);
      return [];
    }
  }

  async getAllSessions(): Promise<BackgroundTrackingSession[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter(key => key.startsWith('session_'));
      
      const sessions: BackgroundTrackingSession[] = [];
      
      for (const key of sessionKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          sessions.push(JSON.parse(data));
        }
      }
      
      return sessions.sort((a, b) => b.startTime - a.startTime);
    } catch (error) {
      console.error('❌ Error getting all sessions:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LOCATION_STORAGE_KEY);
      await AsyncStorage.removeItem(TRACKING_STATE_KEY);
      
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter(key => key.startsWith('session_'));
      
      for (const key of sessionKeys) {
        await AsyncStorage.removeItem(key);
      }
      
      console.log('✅ All background location data cleared');
    } catch (error) {
      console.error('❌ Error clearing background location data:', error);
      throw error;
    }
  }

  // Get tracking statistics
  async getTrackingStatistics(): Promise<{
    totalSessions: number;
    totalLocations: number;
    totalDistance: number;
    averageAccuracy: number;
    lastTrackingTime: number | null;
  }> {
    try {
      const sessions = await this.getAllSessions();
      const locations = await this.getStoredLocations();
      
      const totalDistance = sessions.reduce((sum, session) => sum + session.totalDistance, 0);
      const averageAccuracy = locations.length > 0 ? 
        locations.reduce((sum, loc) => sum + loc.accuracy, 0) / locations.length : 0;
      const lastTrackingTime = sessions.length > 0 ? Math.max(...sessions.map(s => s.startTime)) : null;
      
      return {
        totalSessions: sessions.length,
        totalLocations: locations.length,
        totalDistance,
        averageAccuracy,
        lastTrackingTime,
      };
    } catch (error) {
      console.error('❌ Error getting tracking statistics:', error);
      return {
        totalSessions: 0,
        totalLocations: 0,
        totalDistance: 0,
        averageAccuracy: 0,
        lastTrackingTime: null,
      };
    }
  }
}

// Register background fetch task
TaskManager.defineTask('persist-location-data', async () => {
  console.log('⏰ Background fetch: Persisting location data...');
  
  try {
    // Ensure location data persistence runs periodically
    BackgroundLocationService.getInstance();
    // This will be called periodically to ensure data persistence
    // The actual persistence happens in processBackgroundLocation
    
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('❌ Background fetch error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const backgroundLocationService = BackgroundLocationService.getInstance();