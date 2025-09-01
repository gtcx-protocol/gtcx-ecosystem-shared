# 🏗️ **COMPREHENSIVE TECHNOLOGY STACK & ARCHITECTURE**
*Complete Technical Documentation for GTCX Platform*

## 🎯 **SYSTEM OVERVIEW**

The GTCX platform is a comprehensive mining and trading ecosystem built on modern, scalable architecture that serves Ghana's mining sector with global expansion capabilities.

### **High-Level Architecture**
```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │ TradePass™   │ │  GeoTag™     │ │    Admin Dashboard      │  │
│  │ Mobile App   │ │  Mobile App  │ │      (Vue.js)          │  │
│  │(React Native)│ │(React Native)│ └─────────────────────────┘  │
│  └──────────────┘ └──────────────┘                              │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │ Telegram Bot │ │ SMS Gateway  │ │   WhatsApp Business     │  │
│  │ Integration  │ │  Interface   │ │        API              │  │
│  └──────────────┘ └──────────────┘ └─────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                     API GATEWAY LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Nginx Reverse Proxy                          │    │
│  │   • Load Balancing    • SSL Termination               │    │
│  │   • Rate Limiting     • Security Headers              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                 APPLICATION LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Rails 7 API Backend                     │    │
│  │  • RESTful APIs        • Background Jobs (Sidekiq)     │    │
│  │  • GraphQL Endpoint    • Real-time Updates (ActionCable)│   │
│  │  • Authentication      • File Processing               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                │                                │
│  ┌─────────────────────────────▼───────────────────────────┐    │
│  │            TradePass Protocol Layer                     │    │
│  │  • Cryptographic Identity  • Zero-Knowledge Proofs     │    │
│  │  • Smart Contracts        • Distributed Validation    │    │
│  │  • Reputation Engine      • Privacy-Preserving Analytics│   │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                INTEGRATION LAYER                               │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │ Ghana Gov    │ │ Payment      │ │    Messaging           │  │
│  │ APIs         │ │ Providers    │ │    Services            │  │
│  │• Minerals    │ │• MTN MoMo    │ │• Telegram API          │  │
│  │• EPA         │ │• Vodafone    │ │• Twilio SMS            │  │
│  │• Revenue     │ │• AirtelTigo  │ │• WhatsApp Business     │  │
│  └──────────────┘ └──────────────┘ └─────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                   DATA LAYER                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL 15 + PostGIS                   │    │
│  │  • Transactional Data    • Geospatial Queries         │    │
│  │  • User Management       • Mining Operations          │    │
│  │  • Location History      • Payment Records            │    │
│  │  • Cryptographic Proofs  • Smart Contract State      │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Redis 7                              │    │
│  │  • Session Storage      • Cache Layer                  │    │
│  │  • Job Queue           • Real-time Data               │    │
│  │  • Rate Limiting       • WebSocket State              │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   File Storage                          │    │
│  │  • AWS S3 (Primary)     • Image Processing            │    │
│  │  • Document Storage     • Backup & Archive            │    │
│  │  • CDN Integration      • Compliance Documents        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ **BACKEND TECHNOLOGY STACK**

### **Core Application Framework**
```yaml
Framework: Ruby on Rails 7.1.2
Language: Ruby 3.2.2
Architecture: RESTful API with GraphQL endpoint
Design Pattern: MVC with Service Objects and Repository Pattern
```

#### **Key Rails Features & Gems**
```ruby
# Gemfile - Core Dependencies
gem 'rails', '~> 7.1.2'
gem 'pg', '~> 1.1'                    # PostgreSQL adapter
gem 'redis', '~> 5.0'                 # Redis client
gem 'puma', '~> 6.0'                  # Web server
gem 'sidekiq', '~> 7.0'               # Background jobs
gem 'bootsnap', '>= 1.4.4'           # Boot performance
gem 'image_processing', '~> 1.2'      # Image variants

# Authentication & Authorization  
gem 'devise', '~> 4.9'                # Authentication
gem 'jwt', '~> 2.7'                   # JSON Web Tokens
gem 'pundit', '~> 2.3'                # Authorization
gem 'bcrypt', '~> 3.1.7'              # Password hashing

# API & Serialization
gem 'jbuilder', '~> 2.7'              # JSON APIs
gem 'graphql', '~> 2.0'               # GraphQL endpoint
gem 'active_model_serializers'         # API serialization
gem 'rack-cors'                        # CORS handling

# Database & Geospatial
gem 'activerecord-postgis-adapter'     # PostGIS support
gem 'rgeo', '~> 3.0'                  # Geospatial calculations
gem 'rgeo-geojson'                     # GeoJSON support

# External Integrations
gem 'httparty', '~> 0.21'             # HTTP client
gem 'faraday', '~> 2.7'               # Advanced HTTP client
gem 'twilio-ruby', '~> 6.0'           # SMS/Voice integration
gem 'telegram-bot-ruby', '~> 1.0'     # Telegram bot

# Background Processing
gem 'sidekiq-web', '~> 7.0'           # Sidekiq web interface
gem 'sidekiq-cron', '~> 1.9'          # Scheduled jobs

# Monitoring & Performance
gem 'newrelic_rpm'                     # Performance monitoring
gem 'sentry-ruby'                      # Error tracking
gem 'sentry-rails'                     # Rails integration
gem 'rack-mini-profiler'               # Performance profiling

# Security
gem 'brakeman'                         # Security scanner
gem 'bundler-audit'                    # Dependency security
gem 'secure_headers'                   # Security headers

# Testing
gem 'rspec-rails', '~> 6.0'           # Testing framework
gem 'factory_bot_rails', '~> 6.2'     # Test factories  
gem 'faker', '~> 3.2'                 # Test data generation
gem 'webmock', '~> 3.18'              # HTTP mocking
gem 'vcr', '~> 6.1'                   # HTTP interaction recording

# Development Tools
gem 'annotate', '~> 3.2'              # Model annotations
gem 'bullet', '~> 7.0'                # N+1 query detection
gem 'rails_best_practices'             # Code quality
gem 'rubocop-rails', '~> 2.22'        # Code style
```

### **Application Architecture Patterns**

#### **Service Objects Pattern**
```ruby
# app/services/ghana_government_service.rb
class GhanaGovernmentService
  include HTTParty
  
  base_uri ENV.fetch('GHANA_MINERALS_API_URL')
  
  def self.verify_permit(permit_number)
    response = post('/permits/verify', 
      headers: default_headers,
      body: { permit_number: permit_number }.to_json
    )
    
    handle_response(response)
  end
  
  private
  
  def self.handle_response(response)
    # Comprehensive error handling and response parsing
  end
end
```

#### **Repository Pattern**
```ruby
# app/repositories/location_repository.rb
class LocationRepository
  def self.find_by_user_and_date_range(user, start_date, end_date)
    user.locations
        .includes(:mining_operation)
        .where(recorded_at: start_date..end_date)
        .order(recorded_at: :desc)
  end
  
  def self.within_radius(latitude, longitude, radius_km)
    Location.where(
      "ST_DWithin(coordinates, ST_MakePoint(?, ?), ?)",
      longitude, latitude, radius_km * 1000
    )
  end
end
```

#### **Presenter Pattern**
```ruby
# app/presenters/mining_operation_presenter.rb
class MiningOperationPresenter < SimpleDelegator
  def formatted_coordinates
    "#{latitude.round(6)}, #{longitude.round(6)}"
  end
  
  def government_compliance_status
    government_verified? ? 'Compliant' : 'Pending Verification'
  end
  
  def mining_duration_hours
    return 0 unless end_time && start_time
    ((end_time - start_time) / 1.hour).round(2)
  end
end
```

---

## 📱 **MOBILE APPLICATION TECHNOLOGY STACK**

### **React Native with Expo Framework**
```json
{
  "expo": "~50.0.0",
  "react-native": "0.73.2",
  "@expo/vector-icons": "^13.0.0",
  "expo-router": "~3.4.0",
  "expo-location": "~16.5.0",
  "expo-secure-store": "~12.8.0",
  "expo-sqlite": "~13.2.0"
}
```

#### **Core Mobile Dependencies**
```json
{
  "dependencies": {
    // Navigation & Routing
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "expo-router": "~3.4.0",
    
    // State Management
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.48.2",
    
    // Location & Maps
    "expo-location": "~16.5.0",
    "react-native-maps": "1.10.0",
    "expo-task-manager": "~11.6.0",
    "expo-background-fetch": "~12.0.0",
    
    // Storage & Persistence
    "expo-secure-store": "~12.8.0",
    "expo-sqlite": "~13.2.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    
    // Networking & API
    "axios": "^1.6.2",
    "expo-network": "~5.8.0",
    
    // UI & Design
    "react-native-paper": "^5.11.6",
    "@expo/vector-icons": "^13.0.0",
    "react-native-vector-icons": "^10.0.3",
    "expo-linear-gradient": "~12.7.0",
    
    // Device Features
    "expo-device": "~5.8.0",
    "expo-camera": "~14.0.0",
    "expo-media-library": "~15.9.0",
    "expo-contacts": "~12.8.0",
    "expo-sms": "~12.0.0",
    
    // Security & Authentication
    "expo-local-authentication": "~13.8.0",
    "expo-crypto": "~12.8.0",
    
    // Development & Testing
    "expo-dev-client": "~3.3.0",
    "@testing-library/react-native": "^12.4.2",
    "jest-expo": "~50.0.0"
  }
}
```

#### **Mobile App Architecture**
```typescript
// src/app/_layout.tsx - Root Layout
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// src/services/api-client.ts - API Integration
export class GTCXApiClient {
  private baseURL = 'https://api.gtcx.com/api/v1';
  
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    // Intelligent retry logic with exponential backoff
    // Token refresh handling
    // Offline queue management
    // Error handling and recovery
  }
}

// src/stores/location-store.ts - State Management
export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      locationHistory: [],
      isTracking: false,
      
      startTracking: async () => {
        // GPS tracking with background task
      },
      
      recordLocation: async (location: LocationData) => {
        // Cryptographic proof generation
        // Government verification
        // Local storage with sync queue
      }
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
```

### **Build Configuration**

#### **Expo Configuration (app.config.js)**
```javascript
export default {
  expo: {
    name: 'TradePass',
    slug: 'tradepass-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.gtcx.tradepass',
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'TradePass needs location access for mining verification',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'TradePass needs background location for continuous mining tracking',
        NSCameraUsageDescription: 'TradePass needs camera access for document scanning'
      }
    },
    android: {
      package: 'com.gtcx.tradepass',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'CAMERA',
        'READ_EXTERNAL_STORAGE'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow TradePass to use your location for mining verification.'
        }
      ]
    ]
  }
};
```

#### **EAS Build Configuration (eas.json)**
```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-key.json",
        "track": "internal"
      },
      "ios": {
        "ascAppId": "1234567890"
      }
    }
  }
}
```

---

## 🎨 **FRONTEND TECHNOLOGY STACK**

### **Admin Dashboard (Vue.js 3)**
```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^4.5.2"
  }
}
```

#### **Vue.js Admin Dashboard Stack**
```json
{
  "dependencies": {
    // Core Vue 3
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    
    // UI Framework
    "vuetify": "^3.4.0",
    "@mdi/font": "^7.3.67",
    "material-design-icons-iconfont": "^6.7.0",
    
    // Charts & Visualization
    "chart.js": "^4.4.0",
    "vue-chartjs": "^5.3.0",
    "leaflet": "^1.9.4",
    "vue-leaflet": "^0.10.1",
    
    // HTTP Client & State
    "axios": "^1.6.2",
    "@tanstack/vue-query": "^5.17.0",
    
    // Utilities
    "date-fns": "^2.30.0",
    "lodash-es": "^4.17.21",
    "uuid": "^9.0.1",
    
    // Development
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^4.5.2"
  }
}
```

#### **Admin Dashboard Architecture**
```typescript
// src/stores/admin.ts - Pinia Store
export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const locations = ref<Location[]>([])
  const payments = ref<Payment[]>([])
  
  const fetchDashboardData = async () => {
    // Fetch aggregated data for admin dashboard
  }
  
  const updateUserStatus = async (userId: string, status: UserStatus) => {
    // Update user status with optimistic updates
  }
  
  return {
    users,
    locations,
    payments,
    fetchDashboardData,
    updateUserStatus
  }
})

// src/components/MiningOperationsMap.vue
<template>
  <div class="mining-map">
    <LMap
      :zoom="zoom"
      :center="center"
      style="height: 600px"
    >
      <LTileLayer
        :url="tileUrl"
        :attribution="attribution"
      />
      <LMarker
        v-for="operation in miningOperations"
        :key="operation.id"
        :lat-lng="[operation.latitude, operation.longitude]"
        @click="selectOperation(operation)"
      >
        <LPopup>
          <div class="operation-popup">
            <h3>{{ operation.name }}</h3>
            <p>Status: {{ operation.status }}</p>
            <p>Last Update: {{ formatDate(operation.updatedAt) }}</p>
          </div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>
```

---

## 💾 **DATABASE ARCHITECTURE**

### **PostgreSQL 15 with PostGIS Extension**

#### **Database Configuration**
```yaml
# PostgreSQL Production Settings
Version: PostgreSQL 15.5
Extensions:
  - PostGIS 3.4 (Geospatial functions)
  - uuid-ossp (UUID generation)
  - pgcrypto (Cryptographic functions)
  - pg_trgm (Trigram matching)
  - vector (ML embeddings - if using pgvector)

Configuration:
  shared_buffers: 25% of RAM
  effective_cache_size: 75% of RAM
  work_mem: RAM / (max_connections * 3)
  maintenance_work_mem: RAM / 16
  wal_buffers: 16MB
  checkpoint_completion_target: 0.9
  max_connections: 200
```

#### **Core Database Schema**
```sql
-- Users table with enhanced fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_digest VARCHAR(255) NOT NULL,
    
    -- Role and Status
    role VARCHAR(50) NOT NULL DEFAULT 'miner',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    
    -- Ghana-specific fields
    ghana_national_id VARCHAR(20) UNIQUE,
    permit_number VARCHAR(50),
    mining_license_type VARCHAR(50),
    
    -- TradePass Protocol Integration
    trade_pass_id UUID UNIQUE,
    public_key VARCHAR(130) UNIQUE,
    identity_hash VARCHAR(64) UNIQUE,
    reputation_score DECIMAL(5,2) DEFAULT 50.00,
    
    -- Financial
    wallet_balance DECIMAL(20,2) DEFAULT 0.00,
    wallet_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Authentication & Security
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- External Integration IDs
    telegram_id BIGINT UNIQUE,
    telegram_username VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_role_status (role, status),
    INDEX idx_users_reputation (reputation_score DESC),
    INDEX idx_users_telegram (telegram_id),
    
    -- Constraints
    CONSTRAINT check_role_valid CHECK (role IN ('miner', 'trader', 'government_official', 'inspector', 'admin')),
    CONSTRAINT check_status_valid CHECK (status IN ('pending', 'active', 'suspended', 'banned')),
    CONSTRAINT check_wallet_balance_positive CHECK (wallet_balance >= 0)
);

-- Enhanced locations table with cryptographic proofs
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mining_operation_id UUID REFERENCES mining_operations(id),
    
    -- GPS Coordinates (high precision)
    latitude DECIMAL(12,9) NOT NULL,
    longitude DECIMAL(12,9) NOT NULL,
    altitude DECIMAL(10,2),
    accuracy DECIMAL(8,2) NOT NULL,
    
    -- Additional GPS metadata
    speed DECIMAL(8,2),
    heading DECIMAL(6,2),
    satellites INTEGER,
    constellation VARCHAR(50), -- GPS, GLONASS, Galileo, BeiDou
    
    -- PostGIS geometry column
    coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    
    -- Cryptographic Verification
    location_hash VARCHAR(64) NOT NULL,
    cryptographic_proof TEXT,
    digital_signature VARCHAR(256),
    
    -- Government Integration
    government_verified BOOLEAN DEFAULT FALSE,
    government_verified_at TIMESTAMP WITH TIME ZONE,
    verification_reference VARCHAR(100),
    
    -- Metadata
    device_id VARCHAR(100),
    source VARCHAR(20) DEFAULT 'gps', -- 'gps', 'manual', 'sms'
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Spatial index for PostGIS
    INDEX idx_locations_coordinates USING GIST (coordinates),
    INDEX idx_locations_user_time (user_id, recorded_at DESC),
    INDEX idx_locations_mining_op (mining_operation_id),
    INDEX idx_locations_verified (government_verified, government_verified_at DESC),
    
    -- Constraints
    CONSTRAINT check_latitude_valid CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT check_longitude_valid CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT check_accuracy_positive CHECK (accuracy > 0)
);

-- Enhanced payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mining_operation_id UUID REFERENCES mining_operations(id),
    
    -- Payment Details
    reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'GHS',
    phone_number VARCHAR(20) NOT NULL,
    description TEXT,
    
    -- Status Tracking
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_type VARCHAR(50) NOT NULL,
    
    -- Provider Information
    provider VARCHAR(20), -- 'mtn', 'vodafone', 'airtel'
    provider_payment_id VARCHAR(100),
    provider_status VARCHAR(50),
    provider_response JSONB,
    
    -- TradePass Protocol Integration
    trade_pass_proof JSONB, -- Cryptographic payment proof
    smart_contract_id UUID REFERENCES smart_contracts(contract_id),
    
    -- Timing
    initiated_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Failure handling
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_payments_user_status (user_id, status),
    INDEX idx_payments_reference (reference),
    INDEX idx_payments_provider (provider, provider_status),
    INDEX idx_payments_status_time (status, initiated_timestamp DESC),
    INDEX idx_payments_phone (phone_number),
    
    -- Constraints
    CONSTRAINT check_amount_positive CHECK (amount > 0),
    CONSTRAINT check_status_valid CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired')),
    CONSTRAINT check_currency_valid CHECK (currency IN ('GHS', 'USD')),
    CONSTRAINT check_provider_valid CHECK (provider IS NULL OR provider IN ('mtn', 'vodafone', 'airtel'))
);

-- Mining operations table
CREATE TABLE mining_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    operation_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    
    -- Location Information
    latitude DECIMAL(12,9) NOT NULL,
    longitude DECIMAL(12,9) NOT NULL,
    coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
    area_description TEXT,
    boundary_coordinates GEOGRAPHY(POLYGON, 4326),
    
    -- Government Integration
    permit_number VARCHAR(100),
    license_type VARCHAR(50),
    government_verified BOOLEAN DEFAULT FALSE,
    government_verified_at TIMESTAMP WITH TIME ZONE,
    government_operation_id VARCHAR(100),
    
    -- Operational Details
    start_date DATE,
    end_date DATE,
    estimated_duration_days INTEGER,
    equipment_list JSONB,
    
    -- Financial Information
    estimated_investment DECIMAL(20,2),
    revenue_to_date DECIMAL(20,2) DEFAULT 0.00,
    
    -- Environmental & Compliance
    environmental_plan TEXT,
    restoration_plan TEXT,
    safety_measures JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_mining_ops_user (user_id),
    INDEX idx_mining_ops_coordinates USING GIST (coordinates),
    INDEX idx_mining_ops_status (status),
    INDEX idx_mining_ops_permit (permit_number),
    INDEX idx_mining_ops_verified (government_verified),
    
    -- Constraints
    CONSTRAINT check_operation_type_valid CHECK (operation_type IN ('small_scale', 'medium_scale', 'large_scale', 'artisanal')),
    CONSTRAINT check_status_valid CHECK (status IN ('pending', 'active', 'suspended', 'completed', 'cancelled'))
);
```

### **Redis Configuration & Usage**
```yaml
# Redis 7 Configuration
Version: Redis 7.2
Configuration:
  maxmemory: 2GB
  maxmemory-policy: allkeys-lru
  save: 900 1 300 10 60 10000
  appendonly: yes
  appendfsync: everysec

Usage Patterns:
  - Session Storage: user sessions and authentication tokens
  - Cache Layer: API responses and computed data
  - Job Queue: Sidekiq background job processing
  - Real-time Data: WebSocket connection state
  - Rate Limiting: API rate limiting counters
```

#### **Redis Data Structures**
```ruby
# Session Storage
# Key: "session:#{user_id}"
# Type: Hash
# TTL: 24 hours
# Data: { user_id, role, permissions, last_activity }

# API Response Cache  
# Key: "api_cache:#{endpoint}:#{params_hash}"
# Type: String (JSON)
# TTL: 15 minutes
# Data: Serialized API response

# Location Cache
# Key: "location:#{user_id}:current"
# Type: Hash
# TTL: 5 minutes
# Data: { latitude, longitude, accuracy, timestamp }

# Payment Status
# Key: "payment:#{payment_id}:status"
# Type: String
# TTL: 1 hour
# Data: Current payment processing status

# Rate Limiting
# Key: "rate_limit:#{ip_address}:#{endpoint}"
# Type: String (counter)
# TTL: 1 hour
# Data: Request count
```

---

## 🔗 **EXTERNAL INTEGRATIONS**

### **Ghana Government APIs**

#### **Minerals Commission Integration**
```ruby
# app/services/ghana_minerals_service.rb
class GhanaMineralsService
  include HTTParty
  
  base_uri ENV.fetch('GHANA_MINERALS_API_URL')
  
  def self.verify_permit(permit_number)
    response = post('/api/v1/permits/verify',
      headers: {
        'Authorization' => "Bearer #{ENV['GHANA_MINERALS_API_KEY']}",
        'Content-Type' => 'application/json'
      },
      body: {
        permit_number: permit_number,
        verification_type: 'digital',
        timestamp: Time.current.iso8601
      }.to_json
    )
    
    parse_verification_response(response)
  end
  
  def self.submit_compliance_report(report_data)
    # Submit mining compliance report
  end
  
  def self.register_mining_operation(operation_data)
    # Register new mining operation with government
  end
end
```

### **Mobile Money Providers**

#### **MTN Mobile Money Integration**
```ruby
# app/services/mtn_mobile_money_service.rb
class MtnMobileMoneyService
  include HTTParty
  
  base_uri ENV.fetch('MTN_MOMO_API_URL')
  
  def self.request_to_pay(phone_number, amount, reference)
    token = get_access_token
    
    response = post('/collection/v1_0/requesttopay',
      headers: {
        'Authorization' => "Bearer #{token}",
        'X-Reference-Id' => SecureRandom.uuid,
        'X-Target-Environment' => ENV.fetch('MTN_ENVIRONMENT', 'sandbox'),
        'Content-Type' => 'application/json',
        'Ocp-Apim-Subscription-Key' => ENV['MTN_SUBSCRIPTION_KEY']
      },
      body: {
        amount: amount.to_s,
        currency: 'GHS',
        externalId: reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: normalize_phone_number(phone_number)
        },
        payerMessage: 'GTCX Mining Payment',
        payeeNote: 'Mining operation payment'
      }.to_json
    )
    
    handle_payment_response(response)
  end
end
```

### **Messaging Services**

#### **Telegram Bot Integration**
```ruby
# app/services/telegram_bot_service.rb
class TelegramBotService
  TOKEN = ENV['TELEGRAM_BOT_TOKEN']
  BASE_URL = "https://api.telegram.org/bot#{TOKEN}"
  
  def self.send_message(chat_id, text, options = {})
    HTTParty.post("#{BASE_URL}/sendMessage",
      body: {
        chat_id: chat_id,
        text: text,
        parse_mode: 'HTML',
        reply_markup: options[:reply_markup]&.to_json
      }
    )
  end
  
  def self.send_location_request(chat_id)
    send_message(chat_id, 
      "📍 Please share your current location:",
      reply_markup: {
        keyboard: [
          [{ text: "📍 Share Location", request_location: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    )
  end
end
```

---

## 🚀 **DEPLOYMENT & INFRASTRUCTURE**

### **Docker Container Architecture**
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.4
    environment:
      POSTGRES_DB: gtcx_production
      POSTGRES_USER: gtcx
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7.2-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
      
  gtcx_api:
    build:
      context: .
      dockerfile: Dockerfile.production
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgresql://gtcx:${DATABASE_PASSWORD}@postgres:5432/gtcx_production
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
    depends_on:
      - postgres
      - redis
      
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

### **AWS Infrastructure as Code**
```yaml
# infrastructure/aws-infrastructure.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'GTCX Production Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    
Resources:
  # VPC and Networking
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      
  # Application Load Balancer
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Type: application
      Scheme: internet-facing
      SecurityGroups: [!Ref ALBSecurityGroup]
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
        
  # ECS Cluster for containerized applications
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: gtcx-production
      
  # RDS PostgreSQL Database
  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: gtcx-production-db
      DBInstanceClass: db.t3.large
      Engine: postgres
      EngineVersion: '15.5'
      MasterUsername: gtcx
      MasterUserPassword: !Ref DatabasePassword
      AllocatedStorage: 500
      StorageType: gp2
      MultiAZ: true
      
  # ElastiCache Redis
  RedisCluster:
    Type: AWS::ElastiCache::ReplicationGroup
    Properties:
      ReplicationGroupId: gtcx-redis
      Description: GTCX Redis Cluster
      NodeType: cache.t3.medium
      NumCacheClusters: 2
```

### **Kubernetes Deployment (Alternative)**
```yaml
# k8s/gtcx-api-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gtcx-api
  labels:
    app: gtcx-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gtcx-api
  template:
    metadata:
      labels:
        app: gtcx-api
    spec:
      containers:
      - name: gtcx-api
        image: gtcx/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: RAILS_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: gtcx-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: gtcx-secrets
              key: redis-url
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## 📊 **MONITORING & OBSERVABILITY**

### **Application Monitoring Stack**
```yaml
# Monitoring Components
Error Tracking: Sentry
Performance Monitoring: New Relic
Infrastructure Monitoring: CloudWatch (AWS) / Stackdriver (GCP)
Log Aggregation: ELK Stack (Elasticsearch, Logstash, Kibana)
Metrics Collection: Prometheus + Grafana
Uptime Monitoring: Pingdom / UptimeRobot
```

#### **Monitoring Configuration**
```ruby
# config/initializers/monitoring.rb

# Sentry for error tracking
Sentry.init do |config|
  config.dsn = ENV['SENTRY_DSN']
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
  config.environment = Rails.env
  config.release = ENV['GIT_SHA']
  
  # Performance monitoring
  config.traces_sample_rate = 0.1
  config.profiles_sample_rate = 0.1
end

# New Relic configuration
if ENV['NEW_RELIC_LICENSE_KEY']
  require 'newrelic_rpm'
  
  NewRelic::Agent.manual_start(
    app_name: 'GTCX API',
    license_key: ENV['NEW_RELIC_LICENSE_KEY']
  )
end

# Custom metrics
class ApplicationMetrics
  def self.increment_counter(metric_name, tags = {})
    # StatsD/Prometheus metric increment
    StatsD.increment("gtcx.#{metric_name}", tags: tags)
  end
  
  def self.record_timing(metric_name, duration, tags = {})
    StatsD.timing("gtcx.#{metric_name}", duration, tags: tags)
  end
end
```

### **Health Check Endpoints**
```ruby
# app/controllers/health_controller.rb
class HealthController < ApplicationController
  skip_before_action :authenticate_request
  
  def check
    health_status = {
      status: 'healthy',
      timestamp: Time.current.iso8601,
      version: Rails.application.config.version,
      environment: Rails.env,
      checks: {
        database: check_database,
        redis: check_redis,
        external_apis: check_external_apis
      }
    }
    
    overall_status = health_status[:checks].values.all? { |check| check[:status] == 'healthy' }
    
    render json: health_status, 
           status: overall_status ? :ok : :service_unavailable
  end
  
  private
  
  def check_database
    ActiveRecord::Base.connection.execute('SELECT 1')
    { status: 'healthy', response_time: measure_time { User.count } }
  rescue => e
    { status: 'unhealthy', error: e.message }
  end
  
  def check_redis
    Redis.current.ping
    { status: 'healthy', response_time: measure_time { Redis.current.get('health_check') } }
  rescue => e
    { status: 'unhealthy', error: e.message }
  end
  
  def check_external_apis
    {
      ghana_minerals: check_ghana_api,
      mtn_mobile_money: check_mtn_api,
      telegram: check_telegram_api
    }
  end
end
```

---

## 🔒 **SECURITY ARCHITECTURE**

### **Security Layers**
```yaml
Network Security:
  - WAF (Web Application Firewall)
  - DDoS Protection (Cloudflare)
  - VPN Access for admin operations
  - Network segmentation

Application Security:
  - JWT token authentication
  - Role-based authorization (Pundit)
  - Input validation and sanitization
  - SQL injection prevention (ActiveRecord)
  - XSS protection (secure headers)
  - CSRF protection
  
Data Security:
  - Encryption at rest (database encryption)
  - Encryption in transit (TLS 1.3)
  - Sensitive data tokenization
  - PII data anonymization
  - Audit logging

Infrastructure Security:
  - Container security scanning
  - Dependency vulnerability scanning
  - Infrastructure as Code security
  - Secrets management (AWS Secrets Manager)
  - Access logging and monitoring
```

#### **Security Configuration**
```ruby
# config/initializers/security.rb

# Secure Headers
SecureHeaders::Configuration.default do |config|
  config.hsts = "max-age=#{1.year.to_i}; includeSubDomains"
  config.x_frame_options = "DENY"
  config.x_content_type_options = "nosniff"
  config.x_xss_protection = "1; mode=block"
  config.x_download_options = "noopen"
  config.x_permitted_cross_domain_policies = "none"
  config.referrer_policy = %w(origin-when-cross-origin strict-origin-when-cross-origin)
  
  config.csp = {
    default_src: %w('self'),
    script_src: %w('self' 'unsafe-inline'),
    style_src: %w('self' 'unsafe-inline'),
    img_src: %w('self' data:),
    font_src: %w('self'),
    connect_src: %w('self'),
    frame_ancestors: %w('none')
  }
end

# Rate Limiting
require 'rack/attack'

Rack::Attack.throttle('api/general', limit: 300, period: 5.minutes) do |req|
  req.ip if req.path.start_with?('/api/')
end

Rack::Attack.throttle('api/auth', limit: 10, period: 5.minutes) do |req|
  req.ip if req.path.start_with?('/api/v1/auth/')
end
```

---

This comprehensive technology stack documentation provides a complete picture of the GTCX platform's technical architecture, from mobile applications to backend infrastructure, ensuring world-class scalability, security, and maintainability! 🚀🔧