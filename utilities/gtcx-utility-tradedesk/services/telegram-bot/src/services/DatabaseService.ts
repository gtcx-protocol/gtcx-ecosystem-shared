// ============================================================================
// DATABASE SERVICE - DATA PERSISTENCE AND RETRIEVAL
// PostgreSQL integration for user data and system state
// ============================================================================

import { Pool, PoolClient } from 'pg';
import { Logger } from 'winston';

interface User {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  stakeholderType?: 'miner' | 'trader' | 'inspector' | 'buyer' | 'demo';
  verificationLevel?: 'basic' | 'enhanced' | 'premium';
  onboardingCompleted?: boolean;
  profile?: any;
  createdAt?: Date;
  lastSeen?: Date;
  isActive?: boolean;
}

interface UserSession {
  id: string;
  telegramId: number;
  sessionData: any;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface VerificationRecord {
  id: string;
  userId: string;
  documentType: string;
  documentHash: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  notes?: string;
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export class DatabaseService {
  private pool: Pool;
  private logger: Logger;

  constructor() {
    this.logger = require('winston').createLogger({
      level: 'info',
      format: require('winston').format.json(),
      transports: [new require('winston').transports.Console()]
    });

    // Initialize PostgreSQL connection pool
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'gctx_bot',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  // ============================================================================
  // DATABASE INITIALIZATION
  // ============================================================================

  async initialize(): Promise<void> {
    try {
      await this.createTables();
      await this.createIndexes();
      this.logger.info('Database initialized successfully');
    } catch (error) {
      this.logger.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          telegram_id BIGINT UNIQUE NOT NULL,
          username VARCHAR(255),
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          language_code VARCHAR(10),
          stakeholder_type VARCHAR(50),
          verification_level VARCHAR(50) DEFAULT 'basic',
          onboarding_completed BOOLEAN DEFAULT FALSE,
          profile JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT TRUE,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // User sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          telegram_id BIGINT NOT NULL,
          session_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
        )
      `);

      // Verification records table
      await client.query(`
        CREATE TABLE IF NOT EXISTS verification_records (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          document_type VARCHAR(100) NOT NULL,
          document_hash VARCHAR(256) NOT NULL,
          verification_status VARCHAR(50) DEFAULT 'pending',
          verified_by UUID REFERENCES users(id),
          verified_at TIMESTAMP WITH TIME ZONE,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Audit logs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(255) NOT NULL,
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Bot analytics table
      await client.query(`
        CREATE TABLE IF NOT EXISTS bot_analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type VARCHAR(100) NOT NULL,
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          event_data JSONB,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // System settings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS system_settings (
          key VARCHAR(255) PRIMARY KEY,
          value JSONB NOT NULL,
          description TEXT,
          updated_by UUID REFERENCES users(id),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      await client.query('COMMIT');
      this.logger.info('Database tables created successfully');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async createIndexes(): Promise<void> {
    const client = await this.pool.connect();

    try {
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id)',
        'CREATE INDEX IF NOT EXISTS idx_users_stakeholder_type ON users(stakeholder_type)',
        'CREATE INDEX IF NOT EXISTS idx_users_verification_level ON users(verification_level)',
        'CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen)',
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_telegram_id ON user_sessions(telegram_id)',
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at)',
        'CREATE INDEX IF NOT EXISTS idx_verification_records_user_id ON verification_records(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_verification_records_status ON verification_records(verification_status)',
        'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)',
        'CREATE INDEX IF NOT EXISTS idx_bot_analytics_event_type ON bot_analytics(event_type)',
        'CREATE INDEX IF NOT EXISTS idx_bot_analytics_timestamp ON bot_analytics(timestamp)'
      ];

      for (const indexQuery of indexes) {
        await client.query(indexQuery);
      }

      this.logger.info('Database indexes created successfully');

    } catch (error) {
      this.logger.error('Error creating indexes:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  async upsertUser(userData: Partial<User>): Promise<User> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO users (
          telegram_id, username, first_name, last_name, language_code, last_seen
        ) VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (telegram_id) 
        DO UPDATE SET 
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          language_code = EXCLUDED.language_code,
          last_seen = NOW(),
          updated_at = NOW()
        RETURNING *
      `;

      const values = [
        userData.telegramId,
        userData.username,
        userData.firstName,
        userData.lastName,
        userData.languageCode
      ];

      const result = await client.query(query, values);
      return this.mapUserFromDb(result.rows[0]);

    } catch (error) {
      this.logger.error('Error upserting user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserByTelegramId(telegramId: number): Promise<User | null> {
    const client = await this.pool.connect();

    try {
      const query = 'SELECT * FROM users WHERE telegram_id = $1 AND is_active = TRUE';
      const result = await client.query(query, [telegramId]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapUserFromDb(result.rows[0]);

    } catch (error) {
      this.logger.error('Error getting user by telegram ID:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateUserProfile(telegramId: number, profileData: any): Promise<User | null> {
    const client = await this.pool.connect();

    try {
      const query = `
        UPDATE users 
        SET 
          stakeholder_type = $2,
          verification_level = $3,
          onboarding_completed = $4,
          profile = $5,
          updated_at = NOW()
        WHERE telegram_id = $1
        RETURNING *
      `;

      const values = [
        telegramId,
        profileData.stakeholderType,
        profileData.verificationLevel,
        profileData.onboardingCompleted,
        JSON.stringify(profileData.profile)
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapUserFromDb(result.rows[0]);

    } catch (error) {
      this.logger.error('Error updating user profile:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  async saveUserSession(telegramId: number, sessionData: any): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO user_sessions (telegram_id, session_data)
        VALUES ($1, $2)
        ON CONFLICT (telegram_id)
        DO UPDATE SET 
          session_data = EXCLUDED.session_data,
          updated_at = NOW(),
          expires_at = NOW() + INTERVAL '7 days'
      `;

      await client.query(query, [telegramId, JSON.stringify(sessionData)]);

    } catch (error) {
      this.logger.error('Error saving user session:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserSession(telegramId: number): Promise<any | null> {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT session_data 
        FROM user_sessions 
        WHERE telegram_id = $1 AND expires_at > NOW()
      `;

      const result = await client.query(query, [telegramId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0].session_data;

    } catch (error) {
      this.logger.error('Error getting user session:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUserSession(telegramId: number): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query = 'DELETE FROM user_sessions WHERE telegram_id = $1';
      await client.query(query, [telegramId]);

    } catch (error) {
      this.logger.error('Error deleting user session:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // VERIFICATION RECORDS
  // ============================================================================

  async createVerificationRecord(record: Partial<VerificationRecord>): Promise<VerificationRecord> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO verification_records (
          user_id, document_type, document_hash, verification_status, notes
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        record.userId,
        record.documentType,
        record.documentHash,
        record.verificationStatus || 'pending',
        record.notes
      ];

      const result = await client.query(query, values);
      return this.mapVerificationRecordFromDb(result.rows[0]);

    } catch (error) {
      this.logger.error('Error creating verification record:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateVerificationStatus(
    recordId: string, 
    status: string, 
    verifiedBy?: string, 
    notes?: string
  ): Promise<VerificationRecord | null> {
    const client = await this.pool.connect();

    try {
      const query = `
        UPDATE verification_records 
        SET 
          verification_status = $2,
          verified_by = $3,
          verified_at = CASE WHEN $2 IN ('approved', 'rejected') THEN NOW() ELSE NULL END,
          notes = COALESCE($4, notes),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [recordId, status, verifiedBy, notes];
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapVerificationRecordFromDb(result.rows[0]);

    } catch (error) {
      this.logger.error('Error updating verification status:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserVerificationRecords(userId: string): Promise<VerificationRecord[]> {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT * FROM verification_records 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;

      const result = await client.query(query, [userId]);
      return result.rows.map(row => this.mapVerificationRecordFromDb(row));

    } catch (error) {
      this.logger.error('Error getting user verification records:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // AUDIT LOGGING
  // ============================================================================

  async logUserAction(
    userId: string | null, 
    action: string, 
    details?: any, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5)
      `;

      const values = [
        userId,
        action,
        details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent
      ];

      await client.query(query, values);

    } catch (error) {
      this.logger.error('Error logging user action:', error);
      // Don't throw here as audit logging shouldn't break main functionality
    } finally {
      client.release();
    }
  }

  async getUserAuditLog(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT * FROM audit_logs 
        WHERE user_id = $1 
        ORDER BY timestamp DESC 
        LIMIT $2
      `;

      const result = await client.query(query, [userId, limit]);
      return result.rows.map(row => this.mapAuditLogFromDb(row));

    } catch (error) {
      this.logger.error('Error getting user audit log:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  async trackBotEvent(eventType: string, userId?: string, eventData?: any): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO bot_analytics (event_type, user_id, event_data)
        VALUES ($1, $2, $3)
      `;

      const values = [
        eventType,
        userId,
        eventData ? JSON.stringify(eventData) : null
      ];

      await client.query(query, values);

    } catch (error) {
      this.logger.error('Error tracking bot event:', error);
      // Don't throw here as analytics shouldn't break main functionality
    } finally {
      client.release();
    }
  }

  async getBotAnalytics(startDate: Date, endDate: Date): Promise<any[]> {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT 
          event_type,
          COUNT(*) as event_count,
          COUNT(DISTINCT user_id) as unique_users,
          DATE_TRUNC('day', timestamp) as event_date
        FROM bot_analytics 
        WHERE timestamp BETWEEN $1 AND $2
        GROUP BY event_type, event_date
        ORDER BY event_date DESC, event_count DESC
      `;

      const result = await client.query(query, [startDate, endDate]);
      return result.rows;

    } catch (error) {
      this.logger.error('Error getting bot analytics:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // SYSTEM MANAGEMENT
  // ============================================================================

  async getSystemSetting(key: string): Promise<any> {
    const client = await this.pool.connect();

    try {
      const query = 'SELECT value FROM system_settings WHERE key = $1';
      const result = await client.query(query, [key]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0].value;

    } catch (error) {
      this.logger.error('Error getting system setting:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async setSystemSetting(key: string, value: any, description?: string, updatedBy?: string): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO system_settings (key, value, description, updated_by)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (key)
        DO UPDATE SET 
          value = EXCLUDED.value,
          description = COALESCE(EXCLUDED.description, system_settings.description),
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
      `;

      await client.query(query, [key, JSON.stringify(value), description, updatedBy]);

    } catch (error) {
      this.logger.error('Error setting system setting:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // CLEANUP AND MAINTENANCE
  // ============================================================================

  async cleanupExpiredSessions(): Promise<number> {
    const client = await this.pool.connect();

    try {
      const query = 'DELETE FROM user_sessions WHERE expires_at < NOW()';
      const result = await client.query(query);

      this.logger.info(`Cleaned up ${result.rowCount} expired sessions`);
      return result.rowCount || 0;

    } catch (error) {
      this.logger.error('Error cleaning up expired sessions:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async cleanupOldAuditLogs(retentionDays: number = 90): Promise<number> {
    const client = await this.pool.connect();

    try {
      const query = `
        DELETE FROM audit_logs 
        WHERE timestamp < NOW() - INTERVAL '${retentionDays} days'
      `;

      const result = await client.query(query);

      this.logger.info(`Cleaned up ${result.rowCount} old audit logs`);
      return result.rowCount || 0;

    } catch (error) {
      this.logger.error('Error cleaning up old audit logs:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // DATABASE HEALTH AND UTILITIES
  // ============================================================================

  async healthCheck(): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      await client.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    } finally {
      client.release();
    }
  }

  async getConnectionInfo(): Promise<any> {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  async close(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.info('Database connection pool closed');
    } catch (error) {
      this.logger.error('Error closing database connection pool:', error);
      throw error;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private mapUserFromDb(dbRow: any): User {
    return {
      id: dbRow.id,
      telegramId: dbRow.telegram_id,
      username: dbRow.username,
      firstName: dbRow.first_name,
      lastName: dbRow.last_name,
      languageCode: dbRow.language_code,
      stakeholderType: dbRow.stakeholder_type,
      verificationLevel: dbRow.verification_level,
      onboardingCompleted: dbRow.onboarding_completed,
      profile: dbRow.profile,
      createdAt: dbRow.created_at,
      lastSeen: dbRow.last_seen,
      isActive: dbRow.is_active
    };
  }

  private mapVerificationRecordFromDb(dbRow: any): VerificationRecord {
    return {
      id: dbRow.id,
      userId: dbRow.user_id,
      documentType: dbRow.document_type,
      documentHash: dbRow.document_hash,
      verificationStatus: dbRow.verification_status,
      verifiedBy: dbRow.verified_by,
      verifiedAt: dbRow.verified_at,
      notes: dbRow.notes
    };
  }

  private mapAuditLogFromDb(dbRow: any): AuditLog {
    return {
      id: dbRow.id,
      userId: dbRow.user_id,
      action: dbRow.action,
      details: dbRow.details,
      ipAddress: dbRow.ip_address,
      userAgent: dbRow.user_agent,
      timestamp: dbRow.timestamp
    };
  }
}