# TRADEPASS™ RAILS BACKEND - WORLD-CLASS AI PROMPTS
# Copy these prompts directly into Cursor/Claude for instant development

# =============================================================================
# PROMPT 1: RAILS IDENTITY FOUNDATION (Cursor + Claude Prompt)
# =============================================================================

# Prompt for Cursor IDE:
"""
Generate a complete Ruby on Rails identity management backend for TradePass™ - a self-sovereign digital identity system for Ghana commodity trading.

PROJECT CONTEXT:
- Digital identity and verifiable credentials for miners, government officials, inspectors, traders
- Integration with Ghana government ID systems (Ghana Card, Minerals Commission)
- Multi-role authentication with biometric verification
- Cryptographic credential issuance and verification
- Real-time compliance monitoring and reporting
- Government-grade security and audit trails

TECHNICAL REQUIREMENTS:
- Rails 7.1 with Ruby 3.2+ and PostgreSQL 15
- Devise + JWT for authentication with role-based access
- ActiveAdmin for government dashboard interface
- GraphQL + REST APIs for Vue.js and React Native clients
- Sidekiq + Redis for background processing and job queues
- WebAuthn integration for biometric authentication
- ActionCable for real-time updates and notifications

IDENTITY FEATURES REQUIRED:
1. Self-sovereign DID (Decentralized Identifier) management
2. Verifiable credentials for mining roles and certifications
3. Multi-factor authentication (biometric + PIN + government ID)
4. Role-based permissions (admin, government, miner, inspector, trader)
5. Cryptographic proof generation and verification
6. Government API integration (Ghana Minerals Commission)
7. Real-time compliance monitoring and alerting
8. Audit trails and forensic logging

GENERATE COMPLETE:
1. Gemfile with all necessary gems for government-grade identity system
2. Database schema with proper indexing and constraints
3. Rails application configuration with security middleware
4. User model with roles, DIDs, and credential management
5. Credential model with JSONB storage and cryptographic proofs
6. Authentication controllers for web and API access
7. ActiveAdmin configuration with role-based dashboards
8. GraphQL schema for flexible API queries
9. Background job classes for government integration
10. Security configuration with audit logging and CORS

SECURITY REQUIREMENTS:
- Government-grade authentication with multi-factor verification
- Cryptographic credential signatures using Ed25519
- Zero-knowledge proof integration for privacy
- Audit logging with PaperTrail for all identity operations
- Rate limiting and intrusion detection
- GDPR/data protection compliance with encrypted PII storage

GHANA GOVERNMENT INTEGRATION:
- Ghana Minerals Commission API integration
- Ghana Card (National ID) verification service
- Real-time license status checking and updates
- Automated compliance reporting and notifications
- Multi-language support (English/Twi) for government interfaces

OUTPUT FORMAT:
Provide complete file contents for all Rails components organized by directory structure with deployment and testing instructions.
"""

# =============================================================================
# PROMPT 2: IDENTITY MODELS & CRYPTOGRAPHY (Claude Prompt)
# =============================================================================

# Prompt for Claude:
"""
Generate comprehensive Rails models for TradePass™ digital identity system with advanced cryptographic features.

BUSINESS CONTEXT:
- Self-sovereign identity for Ghana mining ecosystem participants
- Verifiable credentials with cryptographic proofs
- Government integration with Ghana Minerals Commission
- Role-based access control with inherited permissions
- Real-time compliance monitoring and verification

MODELS REQUIRED:

1. USER MODEL (Identity Foundation):
   - Roles: admin, government_official, miner, inspector, trader, buyer
   - DID (Decentralized Identifier) with Ed25519 key pairs
   - Biometric templates and WebAuthn credentials
   - Government ID integration (Ghana Card number and verification status)
   - Multi-factor authentication preferences and backup methods

2. CREDENTIAL MODEL (Verifiable Credentials):
   - W3C Verifiable Credential specification compliance
   - JSONB storage for flexible credential schemas
   - Cryptographic signatures and proof chains
   - Expiration handling and renewal workflows
   - Issuer verification and trust chains

3. DIGITAL_IDENTITY MODEL (DID Management):
   - DID document storage and resolution
   - Public/private key management with secure storage
   - Key rotation and recovery mechanisms
   - Identity verification status and reputation scores
   - Cross-platform identity linking

4. GOVERNMENT_INTEGRATION MODEL:
   - Ghana Minerals Commission license tracking
   - Ghana Card verification records and status updates
   - Automated compliance checking and alerting
   - Government API interaction logging and audit trails
   - Multi-agency coordination and data sharing

5. AUDIT_LOG MODEL (Security and Compliance):
   - Comprehensive audit trails for all identity operations
   - Cryptographic integrity verification for log entries
   - Government compliance reporting and data export
   - Security incident detection and response logging
   - Performance monitoring and analytics data

6. ROLE_PERMISSION MODEL (Authorization Engine):
   - Granular permission definitions and inheritance
   - Dynamic role assignment with approval workflows
   - Resource-based access control with context awareness
   - Permission delegation and temporary access grants
   - Compliance-driven permission enforcement

GENERATE FOR EACH MODEL:
- Complete Ruby class with associations, validations, and business logic
- Database migration with proper indexes, constraints, and performance optimization
- ActiveAdmin resource with search, filters, export, and government-specific views
- RSpec model specification with comprehensive test coverage including edge cases
- FactoryBot factory with realistic test data for Ghana mining scenarios
- Enum definitions for status fields with human-readable labels
- Scope definitions for common queries and government reporting
- JSON serializers for API responses with security-appropriate data filtering
- Service objects for complex business logic and external integrations

TECHNICAL REQUIREMENTS:
- Rails 7.1 conventions with modern Ruby patterns
- PostgreSQL JSONB for flexible credential schemas
- Cryptographic operations with RbNaCl and Ed25519 signatures
- Foreign key constraints and referential integrity
- Audit trail integration with PaperTrail and custom logging
- Soft deletion with paranoia gem for data retention compliance
- Government compliance validation with custom validators
- Ghana-specific data formats and validation rules
- Performance optimization with database indexing and query optimization

CRYPTOGRAPHIC FEATURES:
- Ed25519 key pair generation and management
- Verifiable credential signing and verification
- Zero-knowledge proof generation for privacy preservation
- Credential revocation lists and status checking
- Cross-credential verification and trust scoring
- Hardware security module integration where available

OUTPUT FORMAT:
Provide complete file contents for:
- app/models/*.rb (model classes with full business logic)
- db/migrate/*.rb (migration files with proper indexing)
- app/admin/*.rb (ActiveAdmin resources with government dashboards)
- spec/models/*.rb (comprehensive RSpec tests)
- spec/factories/*.rb (FactoryBot factories with realistic data)
- app/services/*.rb (service objects for complex operations)
"""

# =============================================================================
# PROMPT 3: AUTHENTICATION & AUTHORIZATION SYSTEM (Cursor Prompt)
# =============================================================================

# Prompt for Cursor:
"""
Implement a comprehensive authentication and authorization system for TradePass™ Rails application with government-grade security.

SECURITY CONTEXT:
- Multi-stakeholder identity verification for Ghana mining operations
- Government official access with elevated security requirements
- Biometric authentication with WebAuthn and hardware security keys
- Role-based access control with inherited permissions and delegation
- Real-time fraud detection and security monitoring
- Integration with Ghana government identity systems

AUTHENTICATION FEATURES:
- Devise with JWT tokens for stateless API authentication
- WebAuthn integration for biometric authentication (fingerprint, face ID)
- Multi-factor authentication with SMS, email, and authenticator apps
- Hardware security key support (YubiKey, government-issued tokens)
- Government ID verification with Ghana Card integration
- Account lockout and suspicious activity detection
- Session management with automatic timeout and concurrent session limits

AUTHORIZATION FEATURES:
- Pundit policies with role-based access control and resource permissions
- ActiveAdmin authorization with government hierarchy respect
- GraphQL field-level permissions with context-aware access control
- API key management for government system integrations
- Permission inheritance with role delegation and temporary access grants
- Resource-level access controls with geographic and temporal restrictions
- Compliance-driven permission enforcement with automatic revocation

GOVERNMENT INTEGRATION:
- Ghana Minerals Commission API authentication and authorization
- Ghana Card verification service with real-time status updates
- Multi-agency access coordination with secure data sharing
- Government PKI integration for certificate-based authentication
- Automated compliance reporting with role-based data access
- Emergency access procedures with proper audit logging

GENERATE COMPLETE:
1. Devise configuration with JWT and WebAuthn integration
2. User model with comprehensive role management and security features
3. Pundit policies for all user roles with inheritance and delegation
4. Authentication controllers for web, API, and government interfaces
5. JWT token management service with rotation and blacklisting
6. ActiveAdmin authentication with role-based dashboard customization
7. GraphQL authentication and authorization with field-level security
8. WebAuthn service for biometric authentication with fallback options
9. Security middleware for intrusion detection and rate limiting
10. Audit logging service for all authentication and authorization events

SECURITY IMPLEMENTATION:
- bcrypt password hashing with configurable cost factors
- JWT token signing with RS256 and automatic rotation
- WebAuthn credential verification with attestation checking
- CSRF protection for web interfaces with token validation
- Rate limiting for authentication endpoints with progressive penalties
- Suspicious activity detection with machine learning integration
- Secure session management with httpOnly and secure cookie flags

GHANA-SPECIFIC FEATURES:
- Ghana Card number validation with luhn algorithm verification
- Ghana Minerals Commission license verification and status tracking
- Multi-language support for government interfaces (English/Twi)
- Time zone handling for Ghana Standard Time with automatic adjustments
- Currency and number formatting for Ghanaian standards
- Government holiday and business hour integration for access controls

OUTPUT FORMAT:
Complete file contents organized by Rails directory structure with:
- Comprehensive security configuration and middleware setup
- Role-based access control with inheritance and delegation
- Government integration with proper error handling and failover
- Audit logging with cryptographic integrity verification
- Performance optimization with caching and query optimization
- Testing suite with security-focused scenarios and edge cases
"""

# =============================================================================
# PROMPT 4: GRAPHQL & REST API LAYER (Claude Prompt)
# =============================================================================

# Prompt for Claude:
"""
Generate a comprehensive API layer for TradePass™ Rails application with both GraphQL and REST endpoints optimized for Vue.js and React Native clients.

API ARCHITECTURE REQUIREMENTS:
- GraphQL API for flexible Vue.js frontend queries with real-time subscriptions
- RESTful API following JSON:API specification for React Native mobile app
- Government integration webhooks with secure callback handling
- Real-time subscriptions for compliance monitoring and identity verification
- File upload handling for identity documents with virus scanning and validation
- Comprehensive error handling with government-appropriate messaging and logging

GRAPHQL SCHEMA DESIGN:

1. IDENTITY OPERATIONS:
   - User registration and identity verification queries and mutations
   - DID creation and management with cryptographic key operations
   - Credential issuance and verification with real-time status updates
   - Biometric authentication with WebAuthn integration and fallback methods
   - Government ID verification with Ghana Card and Minerals Commission APIs

2. CREDENTIAL MANAGEMENT:
   - Verifiable credential queries with flexible filtering and sorting
   - Credential issuance mutations with cryptographic proof generation
   - Credential verification with trust chain validation and status checking
   - Revocation list management with real-time updates and notifications
   - Cross-credential verification with reputation scoring and trust metrics

3. GOVERNMENT INTEGRATION:
   - Ghana Minerals Commission license queries with real-time status updates
   - Ghana Card verification with automatic validation and error handling
   - Compliance reporting with automated generation and submission
   - Multi-agency data sharing with secure API integration and audit logging
   - Real-time notification subscriptions for government alerts and updates

4. REAL-TIME SUBSCRIPTIONS:
   - Identity verification status updates with progress tracking
   - Compliance monitoring with automatic alerting and escalation
   - Government integration status with connection health monitoring
   - Security event notifications with threat assessment and response
   - Cross-platform synchronization with conflict resolution and data consistency

REST API ENDPOINTS:

1. AUTHENTICATION ENDPOINTS:
   - POST /api/v1/auth/register (identity registration with government verification)
   - POST /api/v1/auth/login (multi-factor authentication with biometric support)
   - POST /api/v1/auth/refresh (JWT token refresh with automatic rotation)
   - DELETE /api/v1/auth/logout (secure session termination with token invalidation)
   - POST /api/v1/auth/verify (identity verification with government API integration)

2. IDENTITY MANAGEMENT:
   - GET /api/v1/identities (list with role-based filtering and pagination)
   - GET /api/v1/identities/:id (detailed identity with permissions and credentials)
   - PUT /api/v1/identities/:id (profile updates with verification workflow)
   - POST /api/v1/identities/:id/verify_government_id (Ghana Card verification)
   - GET /api/v1/identities/:id/credentials (associated credentials with status)

3. CREDENTIAL OPERATIONS:
   - GET /api/v1/credentials (user credentials with filtering and export options)
   - POST /api/v1/credentials (issue new credential with cryptographic proof)
   - GET /api/v1/credentials/:id/verify (verification with trust chain validation)
   - PUT /api/v1/credentials/:id/renew (renewal with automated workflow)
   - DELETE /api/v1/credentials/:id/revoke (revocation with notification system)

4. GOVERNMENT INTEGRATION:
   - GET /api/v1/government/licenses (mining license status with real-time updates)
   - POST /api/v1/government/verify (government verification with multiple agencies)
   - GET /api/v1/government/compliance (compliance status with reporting dashboard)
   - POST /api/v1/government/webhook (secure webhook handling with verification)

GENERATE COMPLETE:
1. GraphQL schema with types, queries, mutations, and subscriptions
2. GraphQL resolvers with authentication, authorization, and performance optimization
3. REST API controllers with proper error handling and status codes
4. API versioning strategy with backward compatibility and migration paths
5. Request/response serializers with security-appropriate data filtering
6. Rate limiting and throttling with role-based limits and progressive penalties
7. Caching strategies with Redis for performance optimization
8. Background job integration for heavy operations with progress tracking
9. Webhook handlers for government integrations with signature verification
10. Comprehensive API documentation with interactive examples and testing tools

TECHNICAL SPECIFICATIONS:
- GraphQL-Ruby with field-level authorization and query complexity analysis
- JSON:API compliance for REST endpoints with proper relationship handling
- JWT authentication for all endpoints with automatic token refresh
- Role-based authorization with context-aware permission checking
- Request validation with strong parameters and input sanitization
- Response caching with Redis and intelligent cache invalidation
- Background processing with Sidekiq for heavy operations
- Real-time updates with ActionCable and WebSocket connections
- File upload with Active Storage and virus scanning integration
- API documentation with GraphQL playground and OpenAPI specifications

SECURITY FEATURES:
- JWT authentication with RS256 signing and automatic rotation
- Role-based authorization with inheritance and delegation support
- Input sanitization and validation with custom validators
- Rate limiting per user and IP with progressive penalties
- Request logging and monitoring with security event detection
- CORS configuration for Vue.js frontend with secure origins
- API key management for government integrations with rotation
- Webhook signature verification with HMAC validation

PERFORMANCE OPTIMIZATION:
- Database query optimization with eager loading and indexing
- Redis caching with intelligent invalidation and warming
- Background job processing with priority queues and retry logic
- API response compression with gzip and content negotiation
- Connection pooling with automatic scaling and health monitoring
- Query complexity analysis with automatic limiting and optimization
- Real-time subscription management with efficient memory usage

OUTPUT FORMAT:
Complete file contents for GraphQL schema, resolvers, controllers, and documentation with:
- Comprehensive API coverage for all TradePass™ functionality
- Government integration with proper error handling and failover
- Security implementation with audit logging and monitoring
- Performance optimization with caching and background processing
- Testing suite with realistic scenarios and edge case coverage
"""

# =============================================================================
# PROMPT 5: BACKGROUND JOBS & GOVERNMENT INTEGRATION (Cursor Prompt)
# =============================================================================

# Prompt for Cursor:
"""
Implement comprehensive background job system and government integration layer for TradePass™ Rails application.

INTEGRATION CONTEXT:
- Ghana Minerals Commission API integration with real-time license verification
- Ghana Card (National ID) system integration with biometric verification
- Multi-agency coordination with secure data sharing and audit trails
- Automated compliance reporting with government-specified formats
- Real-time notification system for government alerts and updates
- Fault-tolerant integration with offline capabilities and intelligent retry

BACKGROUND JOB CATEGORIES:

1. GOVERNMENT INTEGRATION JOBS:
   - Ghana Minerals Commission license synchronization with conflict resolution
   - Ghana Card verification with biometric template matching
   - Multi-agency compliance reporting with automated submission
   - Government API health monitoring with failover and alerting
   - Cross-agency data reconciliation with audit trail generation

2. IDENTITY PROCESSING JOBS:
   - DID generation and cryptographic key management with secure storage
   - Verifiable credential issuance with proof generation and validation
   - Biometric template processing with privacy-preserving techniques
   - Identity verification workflow with multi-step approval processes
   - Cross-platform identity synchronization with conflict resolution

3. COMPLIANCE MONITORING JOBS:
   - Real-time compliance score calculation with weighted algorithms
   - Automated violation detection with machine learning integration
   - Government notification dispatch with priority-based routing
   - Audit report generation with cryptographic integrity verification
   - Compliance trend analysis with predictive modeling and alerting

4. SECURITY AND MAINTENANCE JOBS:
   - Security event analysis with threat detection and response automation
   - Cryptographic key rotation with zero-downtime migration
   - Database maintenance with performance optimization and cleanup
   - Backup verification with automated recovery testing
   - System health monitoring with predictive failure detection

GOVERNMENT API INTEGRATION:

GHANA MINERALS COMMISSION INTEGRATION:
- Real-time license verification with status caching and update notifications
- Mining permit validation with geographic boundary checking
- Compliance history retrieval with trend analysis and reporting
- Violation reporting with automated escalation and government notification
- License renewal workflow with automated reminders and processing

GHANA CARD INTEGRATION:
- National ID verification with biometric matching and liveness detection
- Identity document validation with fraud detection and reporting
- Demographic data synchronization with privacy protection and consent management
- Status update monitoring with real-time notification and audit logging
- Cross-reference validation with multiple government databases

GENERATE COMPLETE:
1. Sidekiq configuration with Redis clustering and high availability
2. Job classes for all integration categories with comprehensive error handling
3. Government API service classes with circuit breaker pattern and failover
4. Webhook controllers for government callbacks with signature verification
5. Job scheduling with cron jobs and intelligent timing optimization
6. Job monitoring and failure handling with automatic recovery and escalation
7. Retry logic with exponential backoff and intelligent failure classification
8. Job priority and queue management with government SLA compliance
9. Performance monitoring with detailed metrics and government reporting
10. Comprehensive job testing with government API mocking and edge cases

TECHNICAL IMPLEMENTATION:
- Sidekiq Pro with enterprise features and government-grade reliability
- Redis Cluster configuration with automatic failover and data persistence
- Circuit breaker pattern with intelligent failure detection and recovery
- Exponential backoff with jitter for retry optimization and API protection
- Dead letter queues with manual intervention and audit trail generation
- Job progress tracking with real-time updates and government transparency
- Resource management and throttling with API rate limit compliance
- Security for sensitive government data with encryption and audit logging
- Integration patterns with idempotent operations and transaction safety
- Monitoring and alerting with government notification requirements

GOVERNMENT COMPLIANCE FEATURES:
- Automated compliance reporting with government-specified formats and schedules
- Data retention policies with legal compliance and secure deletion
- Audit trail generation with cryptographic integrity and government access
- Privacy protection with consent management and data minimization
- Cross-border data handling with sovereignty requirements and encryption
- Government access controls with proper authorization and logging
- Emergency procedures with government coordination and rapid response
- Disaster recovery with government continuity requirements and testing

PERFORMANCE AND RELIABILITY:
- High availability with multiple data centers and automatic failover
- Load balancing with intelligent routing and government SLA compliance
- Database replication with real-time synchronization and consistency
- Backup and recovery with government data protection requirements
- Performance monitoring with government reporting and optimization
- Capacity planning with automatic scaling and resource optimization
- Security monitoring with government threat intelligence integration
- Compliance verification with automated testing and government validation

OUTPUT FORMAT:
Complete file contents for job classes, services, and configuration with:
- Government integration with proper error handling and failover mechanisms
- Security implementation with audit logging and encryption for sensitive data
- Performance optimization with intelligent queuing and resource management
- Monitoring and alerting with government notification and reporting requirements
- Testing suite with government API mocking and comprehensive edge case coverage
- Documentation with government integration procedures and troubleshooting guides
"""