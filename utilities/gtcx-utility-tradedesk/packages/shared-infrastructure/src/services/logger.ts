/**
 * Centralized Logging and Debugging System
 * Enterprise-grade logging for GeoTag™ and future TradeDesk™ integration
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Log Levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log Categories
export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  GPS = 'gps',
  CRYPTO = 'crypto',
  STORAGE = 'storage',
  NETWORK = 'network',
  UI = 'ui',
  PERFORMANCE = 'performance',
  BUSINESS_LOGIC = 'business-logic',
  INTEGRATION = 'integration',
}

// Log Entry Interface
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  error?: Error;
  stack?: string;
  userId?: string;
  sessionId?: string;
  deviceInfo?: {
    platform: string;
    version: string;
    model: string;
  };
  context?: {
    screen?: string;
    action?: string;
    metadata?: Record<string, any>;
  };
}

// Logger Configuration
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  enableRemoteLogging: boolean;
  maxStoredEntries: number;
  remoteEndpoint?: string;
  batchSize: number;
  flushInterval: number;
}

class LoggingService {
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private sessionId: string;
  private userId?: string;
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.config = {
      level: __DEV__ ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: __DEV__,
      enableStorage: true,
      enableRemoteLogging: !__DEV__,
      maxStoredEntries: 1000,
      batchSize: 50,
      flushInterval: 30000, // 30 seconds
    };
    
    this.sessionId = this.generateId();
    this.startFlushTimer();
  }

  // Configuration Methods
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Core Logging Methods
  debug(category: LogCategory, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  info(category: LogCategory, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  warn(category: LogCategory, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  error(category: LogCategory, message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, category, message, data, error);
  }

  fatal(category: LogCategory, message: string, error?: Error, data?: any): void {
    this.log(LogLevel.FATAL, category, message, data, error);
  }

  // Enhanced Logging Methods
  logGPSEvent(event: string, data?: any): void {
    this.info(LogCategory.GPS, `GPS Event: ${event}`, data);
  }

  logCryptoOperation(operation: string, success: boolean, data?: any): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    this.log(level, LogCategory.CRYPTO, `Crypto Operation: ${operation}`, {
      success,
      ...data,
    });
  }

  logBusinessOperation(operation: string, result: 'success' | 'failure', data?: any): void {
    const level = result === 'success' ? LogLevel.INFO : LogLevel.ERROR;
    this.log(level, LogCategory.BUSINESS_LOGIC, `Business Operation: ${operation}`, {
      result,
      ...data,
    });
  }

  logPerformanceMetric(metric: string, value: number, unit: string = 'ms'): void {
    this.info(LogCategory.PERFORMANCE, `Performance Metric: ${metric}`, {
      value,
      unit,
      timestamp: Date.now(),
    });
  }

  logUserInteraction(screen: string, action: string, data?: any): void {
    this.info(LogCategory.UI, `User Interaction: ${action}`, {
      screen,
      action,
      ...data,
    });
  }

  // Core Log Method
  private log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any,
    error?: Error
  ): void {
    if (level < this.config.level) {
      return; // Skip logs below configured level
    }

    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
      stack: error?.stack,
      userId: this.userId,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      context: this.getCurrentContext(),
    };

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Add to queue for batch processing
    this.logQueue.push(entry);

    // Immediate flush for critical errors
    if (level >= LogLevel.ERROR) {
      this.flushLogs();
    }
  }

  // Console Logging
  private logToConsole(entry: LogEntry): void {
    const { level, category, message, data, error } = entry;
    const prefix = `[${LogLevel[level]}][${category.toUpperCase()}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, message, data, error);
        break;
    }
  }

  // Batch Processing
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.config.flushInterval);
  }

  async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) {
      return;
    }

    const batch = this.logQueue.splice(0, this.config.batchSize);

    // Store locally
    if (this.config.enableStorage) {
      try {
        await this.storeLogsLocally(batch);
      } catch (error) {
        console.error('Failed to store logs locally:', error);
      }
    }

    // Send to remote endpoint
    if (this.config.enableRemoteLogging && this.config.remoteEndpoint) {
      try {
        await this.sendLogsRemotely(batch);
      } catch (error) {
        console.error('Failed to send logs remotely:', error);
        // Re-queue failed logs
        this.logQueue.unshift(...batch);
      }
    }
  }

  // Local Storage
  private async storeLogsLocally(logs: LogEntry[]): Promise<void> {
    try {
      const existingLogs = await this.getStoredLogs();
      const allLogs = [...existingLogs, ...logs];
      
      // Limit stored entries
      if (allLogs.length > this.config.maxStoredEntries) {
        allLogs.splice(0, allLogs.length - this.config.maxStoredEntries);
      }

      await AsyncStorage.setItem('app_logs', JSON.stringify(allLogs));
    } catch (error) {
      throw new Error(`Failed to store logs: ${error}`);
    }
  }

  async getStoredLogs(): Promise<LogEntry[]> {
    try {
      const stored = await AsyncStorage.getItem('app_logs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve stored logs:', error);
      return [];
    }
  }

  async clearStoredLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem('app_logs');
    } catch (error) {
      console.error('Failed to clear stored logs:', error);
    }
  }

  // Remote Logging
  private async sendLogsRemotely(logs: LogEntry[]): Promise<void> {
    if (!this.config.remoteEndpoint) {
      return;
    }

    const response = await fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logs,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Remote logging failed: ${response.status}`);
    }
  }

  // Debug Utilities
  async exportLogs(format: 'json' | 'csv' = 'json'): Promise<string> {
    const logs = await this.getStoredLogs();
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    // CSV format
    const headers = 'Timestamp,Level,Category,Message,Data\n';
    const rows = logs.map(log => 
      `${log.timestamp},${LogLevel[log.level]},${log.category},"${log.message}","${JSON.stringify(log.data)}"`
    ).join('\n');
    
    return headers + rows;
  }

  // Statistics
  async getLogStatistics(): Promise<{
    total: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
    errors: number;
    warnings: number;
  }> {
    const logs = await this.getStoredLogs();
    
    const byLevel: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let errors = 0;
    let warnings = 0;

    logs.forEach(log => {
      const levelName = LogLevel[log.level];
      byLevel[levelName] = (byLevel[levelName] || 0) + 1;
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
      
      if (log.level >= LogLevel.ERROR) errors++;
      if (log.level === LogLevel.WARN) warnings++;
    });

    return {
      total: logs.length,
      byLevel,
      byCategory,
      errors,
      warnings,
    };
  }

  // Utility Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private getDeviceInfo(): LogEntry['deviceInfo'] {
    return {
      platform: 'react-native', // Could be enhanced with actual device info
      version: '1.0.0',
      model: 'unknown',
    };
  }

  private getCurrentContext(): LogEntry['context'] {
    // This could be enhanced to capture current navigation state
    return {
      screen: 'unknown',
      action: 'unknown',
    };
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushLogs(); // Final flush
  }
}

// Global Logger Instance
export const logger = new LoggingService();

// Development Helper Methods
export const debugLogger = {
  logAppStart: () => logger.info(LogCategory.APP, 'Application started'),
  logAppBackground: () => logger.info(LogCategory.APP, 'Application backgrounded'),
  logAppForeground: () => logger.info(LogCategory.APP, 'Application foregrounded'),
  logScreenView: (screenName: string) => 
    logger.info(LogCategory.UI, `Screen viewed: ${screenName}`, { screen: screenName }),
  logButtonPress: (buttonName: string, screen?: string) =>
    logger.logUserInteraction(screen || 'unknown', `Button pressed: ${buttonName}`),
  logAPICall: (endpoint: string, method: string, success: boolean) =>
    logger.info(LogCategory.NETWORK, `API Call: ${method} ${endpoint}`, { success }),
};

// Error Boundary Integration
export const logError = (error: Error, errorInfo: any) => {
  logger.fatal(LogCategory.APP, 'Unhandled React Error', error, {
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
  });
};

export default logger;