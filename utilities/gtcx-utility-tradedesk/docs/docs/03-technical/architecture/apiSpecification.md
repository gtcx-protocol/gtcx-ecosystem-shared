# 🔌 GTCX API Specification
*Complete API documentation for the GTCX platform*

---

## 📋 **API Overview**

### **Base Information**
- **Production URL**: `http://18.118.199.111:3002`
- **API Version**: v1
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: JWT Bearer tokens

### **API Endpoints Structure**
```
http://18.118.199.111:3002/
├── /health                     # System health check
├── /api/v1/
│   ├── /status                # System status with metrics
│   ├── /auth/
│   │   ├── /register         # User registration
│   │   └── /login            # User authentication
│   ├── /users/
│   │   ├── /profile          # User profile management
│   │   └── /preferences      # User settings
│   ├── /mining/
│   │   ├── /locations        # GPS location verification
│   │   ├── /lots            # Gold lot management
│   │   └── /certificates     # Mining certificates
│   └── /trading/
│       ├── /offers          # Buy/sell offers
│       ├── /transactions    # Transaction history
│       └── /compliance      # Regulatory compliance
```

---

## 🔐 **Authentication**

### **JWT Token Format**
```json
{
  "user_id": 123,
  "email": "miner@ghana.com",
  "role": "miner",
  "exp": 1628123456
}
```

### **Authentication Headers**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 📚 **API Endpoints**

### **🏥 Health Check**

#### **GET /health**
Check system health and availability.

**Request:**
```http
GET /health HTTP/1.1
Host: 18.118.199.111:3002
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-10T01:19:41+0000"
}
```

**Response Codes:**
- `200`: System healthy
- `503`: System unavailable

---

### **📊 System Status**

#### **GET /api/v1/status**
Get detailed system status and metrics.

**Request:**
```http
GET /api/v1/status HTTP/1.1
Host: 18.118.199.111:3002
```

**Response:**
```json
{
  "status": "operational",
  "database": "connected",
  "users": {
    "count": 1247
  },
  "timestamp": "2025-08-10T01:19:46+0000"
}
```

**Response Codes:**
- `200`: Status retrieved successfully
- `500`: System error

---

## 🔐 **Authentication Endpoints**

### **👤 User Registration**

#### **POST /api/v1/auth/register**
Register a new user account.

**Request:**
```http
POST /api/v1/auth/register HTTP/1.1
Host: 18.118.199.111:3002
Content-Type: application/json

{
  "email": "miner@ghana.com",
  "password": "SecurePass123!",
  "firstName": "Kwame",
  "lastName": "Asante",
  "role": "miner",
  "phoneNumber": "+233241234567",
  "country": "Ghana",
  "region": "Ashanti"
}
```

**Response (Success):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 123,
    "email": "miner@ghana.com",
    "firstName": "Kwame",
    "lastName": "Asante",
    "role": "miner",
    "country": "Ghana",
    "createdAt": "2025-08-10T01:20:00+0000"
  }
}
```

**Response (Error):**
```json
{
  "error": "Email already exists",
  "code": "DUPLICATE_EMAIL"
}
```

**Response Codes:**
- `201`: User created successfully
- `400`: Invalid request data
- `409`: Email already exists
- `500`: Server error

**Validation Rules:**
- **Email**: Valid email format, unique
- **Password**: Minimum 8 characters, must contain uppercase, lowercase, number
- **Role**: One of: `miner`, `trader`, `government`, `admin`
- **Phone**: Valid international format
- **Country**: ISO country code

---

### **🔑 User Login**

#### **POST /api/v1/auth/login**
Authenticate user and receive JWT token.

**Request:**
```http
POST /api/v1/auth/login HTTP/1.1
Host: 18.118.199.111:3002
Content-Type: application/json

{
  "email": "miner@ghana.com",
  "password": "SecurePass123!"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsImVtYWlsIjoibWluZXJAZ2hhbmEuY29tIiwicm9sZSI6Im1pbmVyIiwiZXhwIjoxNjI4MTIzNDU2fQ.xyz",
  "expiresIn": 86400,
  "user": {
    "id": 123,
    "email": "miner@ghana.com",
    "firstName": "Kwame",
    "lastName": "Asante",
    "role": "miner",
    "country": "Ghana",
    "lastLogin": "2025-08-10T01:20:00+0000"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials",
  "code": "AUTHENTICATION_FAILED"
}
```

**Response Codes:**
- `200`: Login successful
- `401`: Invalid credentials
- `400`: Invalid request format
- `429`: Too many login attempts
- `500`: Server error

---

## 👤 **User Management**

### **📱 User Profile**

#### **GET /api/v1/users/profile**
Get current user's profile information.

**Request:**
```http
GET /api/v1/users/profile HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "user": {
    "id": 123,
    "email": "miner@ghana.com",
    "firstName": "Kwame",
    "lastName": "Asante",
    "role": "miner",
    "phoneNumber": "+233241234567",
    "country": "Ghana",
    "region": "Ashanti",
    "verified": true,
    "createdAt": "2025-07-15T08:30:00+0000",
    "lastLogin": "2025-08-10T01:20:00+0000",
    "miningLicense": {
      "number": "ML-2025-001234",
      "status": "active",
      "expiryDate": "2026-07-15T00:00:00+0000"
    }
  }
}
```

**Response Codes:**
- `200`: Profile retrieved successfully
- `401`: Authentication required
- `403`: Insufficient permissions
- `500`: Server error

---

#### **PUT /api/v1/users/profile**
Update user profile information.

**Request:**
```http
PUT /api/v1/users/profile HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Kwame",
  "lastName": "Asante",
  "phoneNumber": "+233241234567",
  "region": "Greater Accra"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 123,
    "email": "miner@ghana.com",
    "firstName": "Kwame",
    "lastName": "Asante",
    "phoneNumber": "+233241234567",
    "region": "Greater Accra",
    "updatedAt": "2025-08-10T01:25:00+0000"
  }
}
```

**Response Codes:**
- `200`: Profile updated successfully
- `400`: Invalid data provided
- `401`: Authentication required
- `500`: Server error

---

## 🏗️ **Mining Operations**

### **📍 Location Verification**

#### **POST /api/v1/mining/locations**
Submit GPS location for verification.

**Request:**
```http
POST /api/v1/mining/locations HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "latitude": 6.6885,
  "longitude": -1.6244,
  "altitude": 234.5,
  "accuracy": 2.1,
  "timestamp": "2025-08-10T01:30:00+0000",
  "deviceInfo": {
    "model": "iPhone 14 Pro",
    "os": "iOS 16.5",
    "appVersion": "1.0.0"
  },
  "metadata": {
    "miningLicense": "ML-2025-001234",
    "activityType": "exploration",
    "notes": "Initial site survey"
  }
}
```

**Response:**
```json
{
  "message": "Location verified successfully",
  "verification": {
    "id": "loc_2025081001300001",
    "status": "verified",
    "accuracy": "high",
    "cryptographicProof": "0x1234567890abcdef...",
    "timestamp": "2025-08-10T01:30:15+0000",
    "coordinates": {
      "latitude": 6.6885,
      "longitude": -1.6244,
      "accuracy": 2.1
    },
    "compliance": {
      "withinLicensedArea": true,
      "environmentalClearance": "valid",
      "governmentApproval": "pending"
    }
  }
}
```

**Response Codes:**
- `201`: Location verified and recorded
- `400`: Invalid coordinates or data
- `401`: Authentication required  
- `403`: Location outside licensed area
- `422`: Insufficient GPS accuracy
- `500`: Server error

---

#### **GET /api/v1/mining/locations**
Retrieve location history for current user.

**Request:**
```http
GET /api/v1/mining/locations?limit=50&offset=0&startDate=2025-08-01 HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `limit`: Number of records to return (1-100, default: 50)
- `offset`: Number of records to skip (default: 0)
- `startDate`: Filter locations after date (ISO 8601)
- `endDate`: Filter locations before date (ISO 8601)
- `accuracy`: Minimum accuracy level (`high`, `medium`, `low`)

**Response:**
```json
{
  "locations": [
    {
      "id": "loc_2025081001300001",
      "coordinates": {
        "latitude": 6.6885,
        "longitude": -1.6244,
        "accuracy": 2.1
      },
      "timestamp": "2025-08-10T01:30:00+0000",
      "status": "verified",
      "activityType": "exploration",
      "compliance": {
        "withinLicensedArea": true,
        "approved": true
      }
    }
  ],
  "pagination": {
    "total": 1247,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Response Codes:**
- `200`: Locations retrieved successfully
- `401`: Authentication required
- `400`: Invalid query parameters
- `500`: Server error

---

### **💰 Gold Lot Management**

#### **POST /api/v1/mining/lots**
Register a new gold lot for trading.

**Request:**
```http
POST /api/v1/mining/lots HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

{
  "weight": 15.75,
  "purity": 18.5,
  "source": {
    "locationId": "loc_2025081001300001",
    "miningDate": "2025-08-09T14:00:00+0000",
    "method": "artisanal"
  },
  "certificates": [
    {
      "type": "assay",
      "number": "ASY-2025-001234",
      "issuedBy": "Ghana Standards Authority",
      "issuedDate": "2025-08-10T10:00:00+0000"
    }
  ],
  "photos": ["photo1.jpg", "photo2.jpg"],
  "description": "High-grade artisanal gold from licensed concession",
  "askingPrice": 58750.00,
  "currency": "USD"
}
```

**Response:**
```json
{
  "message": "Gold lot registered successfully",
  "lot": {
    "id": "lot_2025081001350001",
    "weight": 15.75,
    "purity": 18.5,
    "estimatedValue": 58750.00,
    "status": "available",
    "qrCode": "https://api.gtcx.com/v1/lots/lot_2025081001350001/qr",
    "blockchain": {
      "transactionHash": "0xabcdef1234567890...",
      "blockNumber": 12345678,
      "verified": true
    },
    "compliance": {
      "kimberleyProcess": "compliant",
      "conflictFree": "verified",
      "environmentalImpact": "low"
    },
    "createdAt": "2025-08-10T01:35:00+0000"
  }
}
```

**Response Codes:**
- `201`: Lot created successfully
- `400`: Invalid lot data
- `401`: Authentication required
- `403`: Insufficient mining permissions
- `422`: Missing required certificates
- `500`: Server error

---

## 💱 **Trading Operations**

### **📈 Trading Offers**

#### **GET /api/v1/trading/offers**
Get available gold lots for trading.

**Request:**
```http
GET /api/v1/trading/offers?purity=18&minWeight=10&maxPrice=50000 HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `purity`: Minimum gold purity (1-24 karats)
- `minWeight`: Minimum weight in grams
- `maxWeight`: Maximum weight in grams
- `maxPrice`: Maximum price in USD
- `location`: Country or region filter
- `seller`: Filter by seller ID

**Response:**
```json
{
  "offers": [
    {
      "lotId": "lot_2025081001350001",
      "seller": {
        "id": 123,
        "name": "Kwame Asante",
        "rating": 4.8,
        "verified": true,
        "location": "Ashanti, Ghana"
      },
      "gold": {
        "weight": 15.75,
        "purity": 18.5,
        "photos": ["url1", "url2"]
      },
      "pricing": {
        "askingPrice": 58750.00,
        "pricePerGram": 3730.16,
        "currency": "USD"
      },
      "verification": {
        "certificates": ["ASY-2025-001234"],
        "blockchainVerified": true,
        "governmentApproved": true
      },
      "availability": {
        "status": "available",
        "expiresAt": "2025-08-17T01:35:00+0000"
      }
    }
  ],
  "pagination": {
    "total": 47,
    "limit": 20,
    "offset": 0
  }
}
```

**Response Codes:**
- `200`: Offers retrieved successfully
- `401`: Authentication required
- `400`: Invalid filter parameters
- `500`: Server error

---

#### **POST /api/v1/trading/offers/:lotId/purchase**
Submit purchase offer for a gold lot.

**Request:**
```http
POST /api/v1/trading/offers/lot_2025081001350001/purchase HTTP/1.1
Host: 18.118.199.111:3002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "offerPrice": 57000.00,
  "quantity": 15.75,
  "message": "Interested in purchasing for export to Dubai. Can arrange pickup within 48 hours.",
  "paymentMethod": "bank_transfer",
  "deliveryPreference": "pickup",
  "contactInfo": {
    "phone": "+233241987654",
    "preferredTime": "morning"
  }
}
```

**Response:**
```json
{
  "message": "Purchase offer submitted successfully",
  "transaction": {
    "id": "txn_2025081001400001",
    "status": "pending_seller_approval",
    "lot": {
      "id": "lot_2025081001350001",
      "weight": 15.75,
      "askingPrice": 58750.00
    },
    "offer": {
      "price": 57000.00,
      "buyerId": 456,
      "submittedAt": "2025-08-10T01:40:00+0000"
    },
    "escrow": {
      "required": true,
      "amount": 5700.00,
      "deadline": "2025-08-12T01:40:00+0000"
    },
    "compliance": {
      "buyerVerified": true,
      "exportLicenseRequired": true,
      "governmentApprovalNeeded": false
    }
  }
}
```

**Response Codes:**
- `201`: Offer submitted successfully
- `400`: Invalid offer data
- `401`: Authentication required
- `403`: Insufficient permissions
- `404`: Lot not found or unavailable
- `409`: Lot already sold
- `500`: Server error

---

## 🔒 **Security Features**

### **Rate Limiting**
- **Authentication**: 5 attempts per minute per IP
- **API Calls**: 100 requests per minute per user
- **File Uploads**: 10 files per minute per user

### **Data Validation**
- **Input Sanitization**: All inputs sanitized against XSS
- **SQL Injection Protection**: Parameterized queries only
- **File Upload Security**: Type and size validation

### **Encryption**
- **Passwords**: BCrypt with salt rounds = 12
- **JWT Tokens**: HS256 algorithm
- **Data at Rest**: AES-256 encryption
- **Data in Transit**: TLS 1.3

---

## 🚨 **Error Handling**

### **Error Response Format**
```json
{
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-10T01:45:00+0000",
  "requestId": "req_2025081001450001",
  "details": {
    "field": "email",
    "violation": "format"
  }
}
```

### **Common Error Codes**
- `AUTHENTICATION_REQUIRED`: User must log in
- `AUTHENTICATION_FAILED`: Invalid credentials
- `AUTHORIZATION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server-side error

### **HTTP Status Codes**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## 📊 **API Performance**

### **Response Time Targets**
- **Health Check**: <50ms
- **Authentication**: <200ms
- **Data Retrieval**: <300ms
- **Data Creation**: <500ms
- **File Upload**: <2000ms

### **Pagination**
All list endpoints support pagination:
```json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "hasMore": true,
    "nextUrl": "/api/v1/resource?offset=50&limit=50"
  }
}
```

### **Caching**
- **Static Data**: 1 hour cache
- **User Data**: 5 minutes cache
- **Real-time Data**: No cache

---

## 🧪 **Testing**

### **API Testing Collection**
Postman collection available at: `/docs/api/GTCX.postman_collection.json`

### **Test Environment**
- **Staging URL**: `https://staging-api.gtcx.com`
- **Test Credentials**: Available in development documentation

### **API Monitoring**
- **Health Checks**: Every 30 seconds
- **Performance Monitoring**: Response time tracking
- **Error Alerting**: Real-time notifications

---

*Last Updated: August 10, 2025*  
*API Version: 1.0*  
*For API questions, contact the development team*