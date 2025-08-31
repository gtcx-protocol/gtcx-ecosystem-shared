import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

let watchSubscription: Location.LocationSubscription | null = null;
let locationCallback: ((location: LocationData) => void) | null = null;

export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    console.log('🛰️ Requesting location permissions...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('🛰️ Location permission status:', status);
    
    if (status === 'granted') {
      // Also check if location services are enabled
      const locationEnabled = await Location.hasServicesEnabledAsync();
      console.log('🛰️ Location services enabled:', locationEnabled);
      
      if (!locationEnabled) {
        console.warn('⚠️ Location services are disabled on device');
        return false;
      }
    }
    
    return status === 'granted';
  } catch (error) {
    console.error('❌ Error requesting location permissions:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    console.log('🛰️ Getting current location...');
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      console.error('❌ Location permission denied');
      return null;
    }

    console.log('🛰️ Getting GPS position...');
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    console.log('✅ GPS location received:', {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      accuracy: location.coords.accuracy
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('❌ Error getting current location:', error);
    return null;
  }
};

export const watchLocation = (callback: (location: LocationData) => void) => {
  console.log('🛰️ Starting location watching...');
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 2000, // Update every 2 seconds
      distanceInterval: 1, // Update every 1 meter
    },
    (location) => {
      console.log('🛰️ Location update received:', {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        accuracy: location.coords.accuracy
      });
      
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
      });
    }
  );
};

// LocationService object for the store to use
export const locationService = {
  startTracking: async (): Promise<void> => {
    console.log('🛰️ LocationService: Starting GPS tracking...');
    
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      throw new Error('Location permission denied. Please enable location access in your device settings.');
    }

    // Get initial location
    const initialLocation = await getCurrentLocation();
    if (initialLocation && locationCallback) {
      locationCallback(initialLocation);
    }

    // Start watching for location updates
    if (watchSubscription) {
      watchSubscription.remove();
    }

    watchSubscription = await watchLocation((location) => {
      if (locationCallback) {
        locationCallback(location);
      }
    });

    console.log('✅ GPS tracking started successfully');
  },

  stopTracking: async (): Promise<void> => {
    console.log('🛰️ LocationService: Stopping GPS tracking...');
    
    if (watchSubscription) {
      watchSubscription.remove();
      watchSubscription = null;
    }
    
    locationCallback = null;
    console.log('✅ GPS tracking stopped');
  },

  setLocationCallback: (callback: (location: LocationData) => void) => {
    locationCallback = callback;
  },

  getCurrentLocation,
  requestLocationPermissions,
}; 