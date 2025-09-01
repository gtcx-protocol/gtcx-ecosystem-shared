import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineData {
  id: string;
  timestamp: number;
  data: any;
  type: string;
}

const OFFLINE_QUEUE_KEY = '@geotag_offline_queue';

export const initializeOfflineService = () => {
  NetInfo.addEventListener(state => {
    console.log('Connection type:', state.type);
    console.log('Is connected?', state.isConnected);
    
    if (state.isConnected) {
      // Process offline queue when connection is restored
      processOfflineQueue();
    }
  });
};

export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const addToOfflineQueue = async (data: Omit<OfflineData, 'id' | 'timestamp'>) => {
  try {
    const queueData: OfflineData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...data,
    };

    const existingQueue = await getOfflineQueue();
    const updatedQueue = [...existingQueue, queueData];
    
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
    console.log('Added to offline queue:', queueData.id);
  } catch (error) {
    console.error('Error adding to offline queue:', error);
  }
};

export const getOfflineQueue = async (): Promise<OfflineData[]> => {
  try {
    const queueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueString ? JSON.parse(queueString) : [];
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
};

export const clearOfflineQueue = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    console.log('Offline queue cleared');
  } catch (error) {
    console.error('Error clearing offline queue:', error);
  }
};

export const processOfflineQueue = async () => {
  try {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} offline items...`);

    // Process each item in the queue
    for (const item of queue) {
      try {
        // Here you would implement your actual sync logic
        console.log('Processing offline item:', item.id);
        
        // For now, just log the item
        // In a real app, you'd sync this data to your server
        
      } catch (error) {
        console.error('Error processing offline item:', item.id, error);
      }
    }

    // Clear the queue after processing
    await clearOfflineQueue();
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const clearData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

export const getStorageUsage = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += new Blob([value]).size;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return 0;
  }
};

// Export service object for compatibility
export const offlineService = {
  initializeOfflineService,
  isOnline,
  addToOfflineQueue,
  getOfflineQueue,
  clearOfflineQueue,
  processOfflineQueue,
  getData,
  clearData,
  clearAllData,
  getStorageUsage,
}; 