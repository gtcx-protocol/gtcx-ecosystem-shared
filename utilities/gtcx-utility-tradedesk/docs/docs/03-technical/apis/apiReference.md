# GeoTag™ API Reference

## Document Information
- **Version**: 2.1.0
- **Date**: January 2025
- **API Version**: v2
- **Base URL**: `https://api.geotag.com/v2`
- **Classification**: Technical Reference

## Table of Contents
1. [Authentication](#authentication)
2. [Core APIs](#core-apis)
3. [Mining Operations API](#mining-operations-api)
4. [Certificates API](#certificates-api)
5. [Compliance API](#compliance-api)
6. [Geolocation API](#geolocation-api)
7. [User Management API](#user-management-api)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Webhooks](#webhooks)

## Authentication

### Overview
GeoTag™ API uses JWT-based authentication with role-based access control (RBAC). All API requests must include a valid authentication token.

### Authentication Flow
```typescript
interface AuthenticationFlow {
  1: 'User provides credentials (email/password, biometric, or MFA)';
  2: 'System validates credentials and user role';
  3: 'JWT token issued with role-specific claims';
  4: 'Client includes token in Authorization header';
  5: 'API validates token signature and expiration';
}
```

### Token Structure
```typescript
interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  role: UserRole;        // User role (miner, inspector, trader, etc.)
  permissions: string[]; // Specific permissions
  iat: number;          // Issued at timestamp
  exp: number;          // Expiration timestamp
  jti: string;          // JWT ID for revocation
}

type UserRole = 
  | 'small-scale-miner'
  | 'government-inspector'
  | 'mining-company'
  | 'gold-trader'
  | 'regulatory-authority'
  | 'environmental-officer';
```

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive access token.

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password?: string;      // Optional if using biometric
  biometricData?: string; // Base64 encoded biometric data
  mfaCode?: string;       // MFA code if required
  deviceId: string;       // Unique device identifier
}
```

**Response:**
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;     // Seconds until expiration
  user: {
    id: string;
    email: string;
    role: UserRole;
    profile: UserProfile;
  };
}
```

**Example:**
```bash
curl -X POST https://api.geotag.com/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miner@goldfields.gh",
    "password": "securePassword123",
    "deviceId": "device-12345"
  }'
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
  deviceId: string;
}
```

#### POST /auth/logout
Invalidate current session and tokens.

**Request:**
```typescript
interface LogoutRequest {
  refreshToken: string;
  deviceId: string;
}
```

## Core APIs

### Standard Request Headers
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
Accept: application/json
User-Agent: GeoTag-Mobile/2.1.0 (iOS/Android)
X-Device-ID: <unique-device-id>
X-Request-ID: <uuid-v4>
```

### Standard Response Format
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

## Mining Operations API

### GET /operations
Retrieve mining operations for authenticated user.

**Query Parameters:**
```typescript
interface OperationsQueryParams {
  page?: number;          // Page number (default: 1)
  limit?: number;         // Items per page (default: 20, max: 100)
  status?: OperationStatus; // Filter by status
  startDate?: string;     // ISO 8601 date string
  endDate?: string;       // ISO 8601 date string
  location?: {            // Geographic bounding box
    northEast: { lat: number; lng: number };
    southWest: { lat: number; lng: number };
  };
  sortBy?: 'createdAt' | 'updatedAt' | 'location';
  sortOrder?: 'asc' | 'desc';
}

type OperationStatus = 
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'completed';
```

**Response:**
```typescript
interface OperationsResponse {
  operations: MiningOperation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface MiningOperation {
  id: string;
  userId: string;
  type: 'gold-extraction' | 'exploration' | 'processing';
  status: OperationStatus;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    address?: string;
  };
  goldData?: {
    estimatedWeight: number;
    purity?: number;
    assayResults?: AssayResult[];
  };
  documentation: Document[];
  certificates: Certificate[];
  complianceStatus: ComplianceStatus;
  timestamps: {
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
    approvedAt?: string;
  };
  signature: {
    algorithm: 'Ed25519';
    publicKey: string;
    signature: string;
    timestamp: string;
  };
}
```

### POST /operations
Create new mining operation.

**Request:**
```typescript
interface CreateOperationRequest {
  type: 'gold-extraction' | 'exploration' | 'processing';
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
  };
  goldData?: {
    estimatedWeight: number;
    purity?: number;
  };
  documentation: DocumentUpload[];
  photos: PhotoUpload[];
  notes?: string;
}

interface DocumentUpload {
  filename: string;
  contentType: string;
  base64Data: string;
  documentType: 'license' | 'permit' | 'assay' | 'environmental' | 'other';
}

interface PhotoUpload {
  filename: string;
  base64Data: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}
```

### PUT /operations/{id}
Update existing mining operation.

### DELETE /operations/{id}
Delete mining operation (only drafts can be deleted).

### POST /operations/{id}/submit
Submit operation for regulatory review.

**Request:**
```typescript
interface SubmitOperationRequest {
  finalDocumentation: DocumentUpload[];
  certificationRequests: string[]; // Certificate types requested
  notes?: string;
}
```

## Certificates API

### GET /certificates
Retrieve certificates for user operations.

**Response:**
```typescript
interface Certificate {
  id: string;
  operationId: string;
  type: CertificateType;
  issuer: {
    name: string;
    authority: string;
    publicKey: string;
  };
  status: 'pending' | 'issued' | 'expired' | 'revoked';
  validFrom: string;
  validUntil?: string;
  data: CertificateData;
  signature: {
    algorithm: 'Ed25519';
    signature: string;
    timestamp: string;
  };
  qrCode: {
    data: string;
    imageUrl: string;
    verificationUrl: string;
  };
}

type CertificateType = 
  | 'origin-certificate'
  | 'assay-certificate'
  | 'export-permit'
  | 'compliance-certificate'
  | 'environmental-clearance';

interface CertificateData {
  goldLotId: string;
  weight: number;
  purity: number;
  origin: {
    location: { latitude: number; longitude: number };
    miner: string;
    extractionDate: string;
  };
  chainOfCustody: ChainOfCustodyEntry[];
}
```

### POST /certificates/verify
Verify certificate authenticity using QR code data.

**Request:**
```typescript
interface VerifyCertificateRequest {
  qrCodeData: string;
  signature?: string; // Optional additional signature check
}
```

**Response:**
```typescript
interface VerificationResponse {
  valid: boolean;
  certificate?: Certificate;
  verificationDetails: {
    signatureValid: boolean;
    timestampValid: boolean;
    issuerTrusted: boolean;
    certificateActive: boolean;
  };
  warnings?: string[];
}
```

## Compliance API

### GET /compliance/requirements
Get compliance requirements for user's jurisdiction.

**Query Parameters:**
```typescript
interface ComplianceRequirementsParams {
  country: string;        // ISO 3166-1 alpha-2 country code
  region?: string;        // Specific mining region
  operationType: string;  // Type of mining operation
}
```

**Response:**
```typescript
interface ComplianceRequirements {
  jurisdiction: {
    country: string;
    region?: string;
    regulatoryFramework: string;
  };
  requirements: ComplianceRequirement[];
  deadlines: ComplianceDeadline[];
  authorities: RegulatoryAuthority[];
}

interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  type: 'license' | 'permit' | 'assessment' | 'report' | 'inspection';
  mandatory: boolean;
  frequency?: 'one-time' | 'annual' | 'quarterly' | 'monthly';
  documents: RequiredDocument[];
  penalties?: Penalty[];
}
```

### GET /compliance/status
Get compliance status for operations.

**Response:**
```typescript
interface ComplianceStatus {
  operationId: string;
  overallStatus: 'compliant' | 'non-compliant' | 'pending' | 'expired';
  requirements: RequirementStatus[];
  lastAssessment?: {
    date: string;
    inspector: string;
    score: number;
    notes: string;
  };
  nextDeadlines: ComplianceDeadline[];
}

interface RequirementStatus {
  requirementId: string;
  status: 'met' | 'not-met' | 'pending' | 'expired';
  evidence?: Document[];
  dueDate?: string;
  completedDate?: string;
}
```

### POST /compliance/report-violation
Report compliance violation.

**Request:**
```typescript
interface ViolationReport {
  operationId: string;
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: DocumentUpload[];
  location?: {
    latitude: number;
    longitude: number;
  };
  reporterRole: UserRole;
  anonymous?: boolean;
}
```

## Geolocation API

### POST /geolocation/validate
Validate location coordinates for compliance.

**Request:**
```typescript
interface LocationValidationRequest {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  purpose: 'mining' | 'inspection' | 'transport' | 'storage';
}
```

**Response:**
```typescript
interface LocationValidationResponse {
  valid: boolean;
  geofenceStatus: {
    insidePermittedZone: boolean;
    zoneType?: 'mining-concession' | 'protected-area' | 'restricted-zone';
    zoneName?: string;
    distanceToNearest: number; // meters
  };
  environmentalConcerns: EnvironmentalAlert[];
  nearbyOperations: NearbyOperation[];
}
```

### GET /geolocation/zones
Get geofence zones for area.

**Query Parameters:**
```typescript
interface GeofenceQuery {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
  zoneTypes?: string[];
}
```

## User Management API

### GET /users/profile
Get current user profile.

**Response:**
```typescript
interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  personalInfo: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    nationality: string;
  };
  businessInfo?: {
    companyName: string;
    licenseNumber: string;
    registrationCountry: string;
  };
  preferences: {
    language: string;
    country: string;
    notifications: NotificationPreferences;
  };
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    businessVerified: boolean;
  };
  permissions: string[];
}
```

### PUT /users/profile
Update user profile.

### POST /users/verify-identity
Submit identity verification documents.

**Request:**
```typescript
interface IdentityVerificationRequest {
  documents: VerificationDocument[];
  selfiePhoto: string; // Base64 encoded
  livenessData?: string; // For liveness detection
}

interface VerificationDocument {
  type: 'passport' | 'national-id' | 'drivers-license' | 'mining-license';
  frontImage: string; // Base64 encoded
  backImage?: string; // Base64 encoded
}
```

## Error Handling

### Standard Error Codes
```typescript
enum ErrorCode {
  // Authentication & Authorization
  INVALID_CREDENTIALS = 'AUTH001',
  TOKEN_EXPIRED = 'AUTH002',
  INSUFFICIENT_PERMISSIONS = 'AUTH003',
  ACCOUNT_SUSPENDED = 'AUTH004',
  
  // Validation Errors
  INVALID_INPUT = 'VAL001',
  MISSING_REQUIRED_FIELD = 'VAL002',
  INVALID_LOCATION = 'VAL003',
  INVALID_SIGNATURE = 'VAL004',
  
  // Business Logic Errors
  OPERATION_NOT_FOUND = 'BUS001',
  OPERATION_ALREADY_SUBMITTED = 'BUS002',
  COMPLIANCE_VIOLATION = 'BUS003',
  CERTIFICATE_EXPIRED = 'BUS004',
  
  // System Errors
  INTERNAL_SERVER_ERROR = 'SYS001',
  DATABASE_ERROR = 'SYS002',
  EXTERNAL_SERVICE_ERROR = 'SYS003',
  RATE_LIMIT_EXCEEDED = 'SYS004',
}
```

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: {
      field?: string;
      validationErrors?: ValidationError[];
      suggestedAction?: string;
    };
  };
  metadata: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

## Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Bucket: user-specific
```

### Rate Limit Policies
| Endpoint Category | Limit | Window | Scope |
|------------------|-------|--------|-------|
| Authentication | 10 requests | 5 minutes | IP Address |
| Read Operations | 1000 requests | 1 hour | User |
| Write Operations | 100 requests | 1 hour | User |
| File Uploads | 20 requests | 1 hour | User |
| Verification | 5 requests | 1 day | User |

## Webhooks

### Webhook Events
```typescript
interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  data: Record<string, any>;
  timestamp: string;
  signature: string; // HMAC-SHA256 signature
}

type WebhookEventType = 
  | 'operation.created'
  | 'operation.submitted'
  | 'operation.approved'
  | 'operation.rejected'
  | 'certificate.issued'
  | 'certificate.expired'
  | 'compliance.violation'
  | 'user.verified';
```

### Webhook Security
Webhooks are secured using HMAC-SHA256 signatures:

```typescript
// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}
```

---

**Document Control:**
- **Author**: GeoTag™ API Team
- **Technical Review**: Senior Software Architects
- **Security Review**: Information Security Team
- **Next Review**: April 2025

**Classification: CONFIDENTIAL**  
*API keys and implementation details must be kept secure. Unauthorized access or distribution is prohibited.*