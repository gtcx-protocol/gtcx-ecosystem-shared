# API Documentation
## GeoTag™ + TradePass™ REST API

### 🚀 API Overview

The GeoTag™ + TradePass™ API provides programmatic access to Ghana's premier gold mining and trading platform. This RESTful API enables integration with existing mining operations, trading platforms, and regulatory systems.

**Base URL**: `https://api.geotag.gh/v1`
**Authentication**: JWT Bearer tokens
**Rate Limiting**: 1000 requests/hour per API key
**Response Format**: JSON

---

## 🔐 Authentication

### Obtain Access Token

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "deviceId": "device_unique_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "miner"
    }
  }
}
```

### Refresh Access Token

```http
POST /auth/refresh
```

**Headers:**
```
Authorization: Bearer <refresh_token>
```

### API Key Authentication (Server-to-Server)

For server-to-server integration, use API keys:

```http
GET /api/resource
```

**Headers:**
```
X-API-Key: your_api_key_here
Content-Type: application/json
```

---

## 🏃‍♂️ **GeoTag™ API Endpoints**

### User Management

#### Get User Profile
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "miner@example.com",
    "name": "Kwame Asante",
    "phone": "+233244123456",
    "geotagRole": {
      "type": "small-scale-miner",
      "licenseNumber": "SSM-001-2024",
      "verificationLevel": "enhanced",
      "permissions": ["mining", "registration", "trading"]
    },
    "profile": {
      "avatar": "https://cdn.geotag.gh/avatars/user_123456.jpg",
      "location": {
        "region": "Ashanti",
        "district": "Obuasi",
        "coordinates": {
          "latitude": 6.2028,
          "longitude": -1.2636
        }
      }
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:22:30Z"
  }
}
```

#### Update User Profile
```http
PUT /users/profile
```

**Request Body:**
```json
{
  "name": "Kwame Asante Jr.",
  "phone": "+233244123457",
  "profile": {
    "location": {
      "region": "Western",
      "district": "Tarkwa"
    }
  }
}
```

### Gold Lot Management

#### Register New Gold Discovery
```http
POST /goldlots
```

**Request Body:**
```json
{
  "discoveryDate": "2024-01-20",
  "location": {
    "latitude": 6.2028,
    "longitude": -1.2636,
    "accuracy": 3.2,
    "address": "Obuasi Mining Site, Block A"
  },
  "goldDetails": {
    "estimatedQuantity": 15.5,
    "purity": 85,
    "color": "bright yellow",
    "form": "nugget"
  },
  "photos": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  ],
  "notes": "High-quality gold found near riverbank"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "GL-20240120-001",
    "discoveryLocation": {
      "latitude": 6.2028,
      "longitude": -1.2636,
      "accuracy": 3.2,
      "altitude": 285,
      "timestamp": 1705749600000
    },
    "discoveryDate": "2024-01-20",
    "minerId": "user_123456",
    "weight": 15.5,
    "purity": 85,
    "cryptoProof": "a1b2c3d4e5f6...",
    "certificateId": "CERT-20240120-001",
    "status": "verified",
    "photos": [
      "https://cdn.geotag.gh/photos/GL-20240120-001-1.jpg",
      "https://cdn.geotag.gh/photos/GL-20240120-001-2.jpg"
    ],
    "createdAt": "2024-01-20T15:30:00Z",
    "updatedAt": "2024-01-20T15:32:15Z"
  }
}
```

#### Get Gold Lots
```http
GET /goldlots
```

**Query Parameters:**
- `status` - Filter by status (discovered, verified, traded, exported)
- `minerId` - Filter by miner ID
- `region` - Filter by region
- `limit` - Number of results (default: 20, max: 100)
- `offset` - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "goldLots": [
      {
        "id": "GL-20240120-001",
        "discoveryDate": "2024-01-20",
        "weight": 15.5,
        "purity": 85,
        "status": "verified",
        "estimatedValue": 12750,
        "location": {
          "region": "Ashanti",
          "district": "Obuasi"
        }
      }
    ],
    "pagination": {
      "total": 145,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### Get Gold Lot Details
```http
GET /goldlots/{goldLotId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "GL-20240120-001",
    "discoveryLocation": {
      "latitude": 6.2028,
      "longitude": -1.2636,
      "address": "Obuasi Mining Site, Block A"
    },
    "discoveryDate": "2024-01-20",
    "minerId": "user_123456",
    "miner": {
      "name": "Kwame Asante",
      "verificationLevel": "enhanced"
    },
    "weight": 15.5,
    "purity": 85,
    "status": "verified",
    "photos": [
      "https://cdn.geotag.gh/photos/GL-20240120-001-1.jpg"
    ],
    "compliance": {
      "status": "compliant",
      "checkedAt": "2024-01-20T15:32:15Z",
      "checkedBy": "system"
    },
    "tradingHistory": [
      {
        "date": "2024-01-21",
        "traderId": "trader_456",
        "price": 12750,
        "status": "completed"
      }
    ]
  }
}
```

### Compliance & Regulatory

#### Get Compliance Dashboard
```http
GET /compliance/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRecords": 1250,
      "compliantPercentage": 94.5,
      "pendingIssues": 12,
      "criticalViolations": 2,
      "complianceScore": 87
    },
    "byCategory": {
      "licensing": {
        "total": 450,
        "compliant": 425,
        "violations": 25
      },
      "environmental": {
        "total": 300,
        "compliant": 285,
        "violations": 15
      }
    },
    "recentActivity": [
      {
        "type": "violation",
        "description": "Mining without valid permit",
        "severity": "high",
        "location": "Western Region",
        "date": "2024-01-20"
      }
    ]
  }
}
```

#### Generate Compliance Report
```http
POST /compliance/reports
```

**Request Body:**
```json
{
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "regions": ["Ashanti", "Western"],
  "format": "detailed",
  "includePhotos": true
}
```

---

## 💼 **TradePass™ API Endpoints**

### Trading Operations

#### Get Available Gold Lots
```http
GET /trading/goldlots/available
```

**Query Parameters:**
- `minPurity` - Minimum gold purity (%)
- `maxDistance` - Maximum distance from user (km)
- `priceRange` - Price range (min,max)
- `sortBy` - Sort by (price, distance, purity, date)

**Response:**
```json
{
  "success": true,
  "data": {
    "availableGoldLots": [
      {
        "id": "GL-20240120-001",
        "weight": 15.5,
        "purity": 85,
        "estimatedValue": 12750,
        "distance": 5.2,
        "miner": {
          "id": "user_123456",
          "name": "Kwame Asante",
          "rating": 4.8,
          "verificationLevel": "enhanced"
        },
        "location": {
          "region": "Ashanti",
          "district": "Obuasi",
          "approximateCoordinates": {
            "latitude": 6.200,
            "longitude": -1.260
          }
        },
        "listedAt": "2024-01-20T15:30:00Z"
      }
    ],
    "summary": {
      "totalLots": 45,
      "totalWeight": 892.5,
      "averagePurity": 82.3,
      "totalEstimatedValue": 714750
    }
  }
}
```

#### Calculate Fair Price
```http
POST /trading/price-calculator
```

**Request Body:**
```json
{
  "goldLotId": "GL-20240120-001",
  "weight": 15.5,
  "purity": 85,
  "location": {
    "latitude": 6.2028,
    "longitude": -1.2636
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fairPrice": 12750.00,
    "currency": "GHS",
    "breakdown": {
      "basePrice": 13000.00,
      "purityAdjustment": -150.00,
      "transportCost": -100.00,
      "marketFactor": 0.98
    },
    "priceRange": {
      "minimum": 12200.00,
      "maximum": 13500.00
    },
    "marketData": {
      "londonFixPrice": 2048.50,
      "localMarketRate": 0.85,
      "exchangeRate": 12.45
    },
    "calculatedAt": "2024-01-20T16:15:30Z",
    "validUntil": "2024-01-20T18:15:30Z"
  }
}
```

#### Submit Trade Offer
```http
POST /trading/offers
```

**Request Body:**
```json
{
  "goldLotId": "GL-20240120-001",
  "offeredPrice": 12500.00,
  "paymentMethod": "mobile_money",
  "deliveryLocation": {
    "latitude": 6.2028,
    "longitude": -1.2636,
    "address": "Obuasi Gold Market"
  },
  "notes": "Can meet today afternoon"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "offerId": "OFF-20240120-001",
    "goldLotId": "GL-20240120-001",
    "traderId": "trader_456",
    "minerId": "user_123456",
    "offeredPrice": 12500.00,
    "status": "pending",
    "expiresAt": "2024-01-21T16:15:30Z",
    "createdAt": "2024-01-20T16:15:30Z"
  }
}
```

#### Execute Trade
```http
POST /trading/execute
```

**Request Body:**
```json
{
  "offerId": "OFF-20240120-001",
  "agreedPrice": 12600.00,
  "paymentDetails": {
    "method": "mobile_money",
    "accountNumber": "+233244123456",
    "provider": "mtn"
  },
  "meetingLocation": {
    "latitude": 6.2028,
    "longitude": -1.2636,
    "address": "Obuasi Gold Market"
  }
}
```

### Analytics & Reporting

#### Get Trading Analytics
```http
GET /trading/analytics
```

**Query Parameters:**
- `period` - Time period (24h, 7d, 30d, 3m, 1y)
- `region` - Filter by region

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "summary": {
      "totalTransactions": 145,
      "totalVolume": 2845.5,
      "totalValue": 2276400.00,
      "averagePrice": 799.50,
      "averagePurity": 83.2
    },
    "trends": {
      "priceMovement": "increasing",
      "volumeTrend": "stable",
      "purityTrend": "improving"
    },
    "topRegions": [
      {
        "region": "Ashanti",
        "transactions": 68,
        "volume": 1245.5,
        "averagePrice": 825.30
      }
    ],
    "priceHistory": [
      {
        "date": "2024-01-20",
        "averagePrice": 799.50,
        "volume": 95.5
      }
    ]
  }
}
```

---

## 🔗 **Cross-App Integration**

### Messaging System

#### Send Cross-App Message
```http
POST /integration/messages
```

**Request Body:**
```json
{
  "toApp": "tradepass",
  "type": "gold_lot_notification",
  "recipientId": "trader_456",
  "payload": {
    "goldLotId": "GL-20240120-001",
    "message": "New high-quality gold lot available",
    "urgency": "high"
  }
}
```

#### Get Messages
```http
GET /integration/messages
```

### User Session Management

#### Switch App Context
```http
POST /integration/switch-app
```

**Request Body:**
```json
{
  "targetApp": "tradepass"
}
```

### Analytics Integration

#### Get Cross-App Analytics
```http
GET /integration/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalGoldLots": 1250,
    "totalTrades": 450,
    "averageTradeValue": 5067.50,
    "topTradingRegions": [
      {
        "region": "Ashanti",
        "goldLots": 485,
        "trades": 180,
        "volume": 2450.5
      }
    ],
    "integrationHealth": "excellent",
    "crossAppSessions": 2340,
    "messageDeliveryRate": 99.8
  }
}
```

---

## 📊 **Webhooks**

### Webhook Events

The API supports webhooks for real-time notifications:

#### Available Events
- `gold_lot.created` - New gold lot registered
- `gold_lot.verified` - Gold lot passed compliance
- `trade.offer_received` - New trade offer
- `trade.completed` - Trade transaction completed
- `compliance.violation` - Compliance violation detected
- `user.verification_completed` - User verification finished

#### Webhook Payload Example
```json
{
  "event": "gold_lot.created",
  "timestamp": "2024-01-20T15:30:00Z",
  "data": {
    "goldLot": {
      "id": "GL-20240120-001",
      "minerId": "user_123456",
      "weight": 15.5,
      "purity": 85,
      "status": "pending_verification"
    }
  },
  "signature": "sha256=1234567890abcdef..."
}
```

### Register Webhook
```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["gold_lot.created", "trade.completed"],
  "secret": "webhook_secret_key"
}
```

---

## 🚨 **Error Handling**

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid gold lot data provided",
    "details": {
      "field": "purity",
      "reason": "Purity must be between 1 and 100"
    },
    "timestamp": "2024-01-20T15:30:00Z",
    "requestId": "req_1234567890"
  }
}
```

### Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 📈 **Rate Limiting**

### Default Limits
- **Free Tier**: 1,000 requests/hour
- **Basic Plan**: 10,000 requests/hour
- **Premium Plan**: 100,000 requests/hour
- **Enterprise**: Custom limits

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705746000
```

---

## 🔧 **SDKs & Libraries**

### Official SDKs
- **JavaScript/Node.js**: `npm install @geotag/api-client`
- **Python**: `pip install geotag-api`
- **PHP**: `composer require geotag/api-php`
- **Java**: Maven/Gradle available

### Example Usage (JavaScript)
```javascript
const GeoTagAPI = require('@geotag/api-client');

const client = new GeoTagAPI({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Register new gold discovery
const goldLot = await client.goldLots.create({
  discoveryDate: '2024-01-20',
  location: {
    latitude: 6.2028,
    longitude: -1.2636
  },
  goldDetails: {
    estimatedQuantity: 15.5,
    purity: 85
  }
});

console.log('Gold lot registered:', goldLot.id);
```

---

## 🧪 **Testing**

### Sandbox Environment
**Base URL**: `https://api-sandbox.geotag.gh/v1`

### Test Data
- Test user credentials available
- Sample gold lots for testing
- Mock payment processing
- Compliance simulation

### Postman Collection
Download our Postman collection: [GeoTag API Collection](https://api.geotag.gh/postman-collection.json)

---

## 📞 **Support**

### Developer Support
- **Email**: developers@geotag.gh
- **Documentation**: https://docs.geotag.gh
- **Status Page**: https://status.geotag.gh
- **GitHub**: https://github.com/geotag-ghana

### API Status
- **Uptime**: 99.9% SLA
- **Response Time**: < 200ms average
- **Support Hours**: 8 AM - 6 PM GMT (Monday-Friday)

---

**API Version**: 1.0.0  
**Last Updated**: January 2024  
**Next Update**: Q2 2024 (Blockchain integration, GraphQL endpoint)