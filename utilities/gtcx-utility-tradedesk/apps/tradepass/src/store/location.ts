import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { backgroundLocationService, BackgroundTrackingSession } from '../services/backgroundLocation';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  satellites: number;
  constellation: 'GPS' | 'GLONASS' | 'Galileo' | 'BeiDou' | 'QZSS';
}

export interface TrackingSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  locations: LocationData[];
  totalDistance: number;
  averageAccuracy: number;
  status: 'active' | 'paused' | 'completed';
  backgroundSession?: BackgroundTrackingSession;
}

export interface LocationState {
  currentLocation: LocationData | null;
  lastKnownLocation: LocationData | null;
  isLocationEnabled: boolean;
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  accuracyThreshold: number;
  trackingHistory: LocationData[];
  cryptographicProof: string | null;
  currentSession: TrackingSession | null;
  allSessions: TrackingSession[];
  backgroundTrackingEnabled: boolean;
}

export interface LocationActions {
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  requestPermissions: () => Promise<void>;
  getCurrentLocation: () => Promise<LocationData | null>;
  generateProof: (location: LocationData) => Promise<string>;
  verifyProof: (proof: string, location: LocationData) => Promise<boolean>;
  clearHistory: () => void;
  deleteHistoryEntry: (index: number) => void;
  setAccuracyThreshold: (threshold: number) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  // Session management
  startBackgroundTracking: () => Promise<void>;
  stopBackgroundTracking: () => Promise<void>;
  loadAllSessions: () => Promise<void>;
  getCurrentSession: () => Promise<TrackingSession | null>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllSessions: () => Promise<void>;
  setBackgroundTrackingEnabled: (enabled: boolean) => void;
}

type LocationStore = LocationState & LocationActions;

export const useLocation = create<LocationStore>()(
  persist(
    (set, get) => ({
      // State
      currentLocation: null,
      lastKnownLocation: null,
      isLocationEnabled: false,
      isTracking: false,
      isLoading: false,
      error: null,
      accuracyThreshold: 3,
      trackingHistory: [],
      cryptographicProof: null,
      currentSession: null,
      allSessions: [],
      backgroundTrackingEnabled: false,

      // Actions
      startTracking: async () => {
        console.log('🛰️ Store: Starting GPS tracking...');
        set({ isLoading: true, error: null });
        
        try {
          // Request permissions first
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            throw new Error('Location permission not granted');
          }

          // Get initial location to test if GPS is working
          console.log('📍 Getting initial location...');
          try {
            const initialLocation = await get().getCurrentLocation();
            console.log('✅ Initial location acquired:', initialLocation);
          } catch (locationError) {
            console.warn('⚠️ Could not get initial location, but continuing tracking...');
          }

          // Create new session
          const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newSession: TrackingSession = {
            sessionId,
            startTime: Date.now(),
            locations: [],
            totalDistance: 0,
            averageAccuracy: 0,
            status: 'active',
          };

          set({
            isTracking: true,
            isLoading: false,
            currentSession: newSession,
            error: null,
          });
          
          console.log('✅ Store: GPS tracking started successfully');
        } catch (error) {
          console.error('❌ Store: Failed to start GPS tracking:', error);
          set({
            isTracking: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to start GPS tracking',
          });
          throw error;
        }
      },

      stopTracking: async () => {
        console.log('🛑 Store: Stopping GPS tracking...');
        set({ isLoading: true });
        
        try {
          const state = get();
          
          // Stop background tracking
          try {
            const isBackgroundActive = await backgroundLocationService.isBackgroundTrackingActive();
            if (isBackgroundActive) {
              await backgroundLocationService.stopBackgroundTracking();
              console.log('✅ Background tracking stopped');
            }
          } catch (bgError) {
            console.warn('⚠️ Error stopping background tracking:', bgError);
          }

          // Complete current session
          if (state.currentSession) {
            const completedSession: TrackingSession = {
              ...state.currentSession,
              endTime: Date.now(),
              status: 'completed',
            };

            set({
              currentSession: null,
              allSessions: [completedSession, ...state.allSessions],
            });
          }

          set({
            isTracking: false,
            isLoading: false,
          });
          
          console.log('✅ Store: GPS tracking stopped successfully');
        } catch (error) {
          console.error('❌ Store: Error stopping tracking:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to stop tracking',
          });
        }
      },

      requestPermissions: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('🔐 Requesting location permissions...');
          const { status } = await Location.requestForegroundPermissionsAsync();
          console.log('🔐 Foreground permission:', status);
          
          // Don't require background permissions for basic functionality
          let isEnabled = status === 'granted';
          
          if (isEnabled) {
            try {
              const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
              console.log('🔐 Background permission:', backgroundStatus.status);
            } catch (bgError) {
              console.warn('⚠️ Background permission failed (non-critical):', bgError);
            }
          }
          
          set({
            isLocationEnabled: isEnabled,
            isLoading: false,
            error: null,
          });

          if (!isEnabled) {
            throw new Error('Location permissions not granted');
          }
        } catch (error) {
          console.error('❌ Permission error:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to request permissions',
          });
          throw error;
        }
      },

      getCurrentLocation: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('📍 Getting current location...');
          
          // Try with high accuracy first, fallback to balanced
          let location;
          try {
            console.log('📍 Trying high accuracy GPS...');
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 1000,
              distanceInterval: 1,
            });
          } catch (gpsError) {
            console.warn('⚠️ High accuracy failed, trying balanced accuracy...');
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
          }
          
          console.log('✅ Location received:', location.coords);
          
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 999,
            altitude: location.coords.altitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
            timestamp: location.timestamp,
            satellites: 0, // Not available from expo-location
            constellation: 'GPS',
          };
          
          set({
            currentLocation: locationData,
            lastKnownLocation: locationData,
            isLoading: false,
            error: null,
          });
          
          return locationData;
        } catch (error) {
          console.error('❌ Location error:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to get location',
          });
          throw error;
        }
      },

      generateProof: async (location: LocationData) => {
        try {
          // Simple proof generation (in production, use proper cryptography)
          const proofData = {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp,
            accuracy: location.accuracy,
          };
          
          const proof = btoa(JSON.stringify(proofData));
          set({ cryptographicProof: proof });
          
          return proof;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to generate proof',
          });
          throw error;
        }
      },

      verifyProof: async (proof: string, location: LocationData) => {
        try {
          const expectedData = {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp,
            accuracy: location.accuracy,
          };
          const expectedProof = btoa(JSON.stringify(expectedData));
          return proof === expectedProof;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to verify proof',
          });
          throw error;
        }
      },

      // Session management actions
      startBackgroundTracking: async () => {
        try {
          const sessionId = await backgroundLocationService.startBackgroundTracking();
          set({ backgroundTrackingEnabled: true });
          console.log('✅ Background tracking started:', sessionId);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to start background tracking',
          });
          throw error;
        }
      },

      stopBackgroundTracking: async () => {
        try {
          await backgroundLocationService.stopBackgroundTracking();
          set({ backgroundTrackingEnabled: false });
          console.log('✅ Background tracking stopped');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to stop background tracking',
          });
          throw error;
        }
      },

      loadAllSessions: async () => {
        try {
          const backgroundSessions = await backgroundLocationService.getAllSessions();
          const sessions: TrackingSession[] = backgroundSessions.map(bgSession => ({
            sessionId: bgSession.sessionId,
            startTime: bgSession.startTime,
            endTime: bgSession.endTime,
            locations: bgSession.locations.map(loc => ({
              latitude: loc.latitude,
              longitude: loc.longitude,
              accuracy: loc.accuracy,
              altitude: loc.altitude,
              heading: loc.heading,
              speed: loc.speed,
              timestamp: loc.timestamp,
              satellites: 0,
              constellation: 'GPS' as const,
            })),
            totalDistance: bgSession.totalDistance,
            averageAccuracy: bgSession.averageAccuracy,
            status: bgSession.status,
            backgroundSession: bgSession,
          }));
          
          set({ allSessions: sessions });
        } catch (error) {
          console.error('❌ Error loading sessions:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load sessions',
          });
        }
      },

      getCurrentSession: async () => {
        try {
          const state = get();
          if (state.currentSession) {
            return state.currentSession;
          }
          
          const backgroundSession = await backgroundLocationService.getCurrentSession();
          if (backgroundSession) {
            const session: TrackingSession = {
              sessionId: backgroundSession.sessionId,
              startTime: backgroundSession.startTime,
              endTime: backgroundSession.endTime,
              locations: backgroundSession.locations.map(loc => ({
                latitude: loc.latitude,
                longitude: loc.longitude,
                accuracy: loc.accuracy,
                altitude: loc.altitude,
                heading: loc.heading,
                speed: loc.speed,
                timestamp: loc.timestamp,
                satellites: 0,
                constellation: 'GPS' as const,
              })),
              totalDistance: backgroundSession.totalDistance,
              averageAccuracy: backgroundSession.averageAccuracy,
              status: backgroundSession.status,
              backgroundSession,
            };
            
            set({ currentSession: session });
            return session;
          }
          
          return null;
        } catch (error) {
          console.error('❌ Error getting current session:', error);
          return null;
        }
      },

      deleteSession: async (sessionId: string) => {
        try {
          // Remove from background service storage
          // Note: backgroundLocationService doesn't have a delete method yet
          // You may need to implement it
          
          // Remove from store
          const state = get();
          const updatedSessions = state.allSessions.filter(s => s.sessionId !== sessionId);
          set({ allSessions: updatedSessions });
          
          console.log('✅ Session deleted:', sessionId);
        } catch (error) {
          console.error('❌ Error deleting session:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to delete session',
          });
        }
      },

      clearAllSessions: async () => {
        try {
          await backgroundLocationService.clearAllData();
          set({ 
            allSessions: [],
            currentSession: null,
          });
          console.log('✅ All sessions cleared');
        } catch (error) {
          console.error('❌ Error clearing sessions:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to clear sessions',
          });
        }
      },

      setBackgroundTrackingEnabled: (enabled: boolean) => {
        set({ backgroundTrackingEnabled: enabled });
      },

      // Existing actions
      clearHistory: () => set({ trackingHistory: [] }),
      deleteHistoryEntry: (index: number) => {
        set((state) => ({
          trackingHistory: state.trackingHistory.filter((_, i) => i !== index)
        }));
      },
      setAccuracyThreshold: (threshold: number) => set({ accuracyThreshold: threshold }),
      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'tradepass-location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastKnownLocation: state.lastKnownLocation,
        isLocationEnabled: state.isLocationEnabled,
        accuracyThreshold: state.accuracyThreshold,
        trackingHistory: state.trackingHistory.slice(-100), // Keep last 100 entries
        backgroundTrackingEnabled: state.backgroundTrackingEnabled,
        allSessions: state.allSessions.slice(-20), // Keep last 20 sessions
      }),
    }
  )
);