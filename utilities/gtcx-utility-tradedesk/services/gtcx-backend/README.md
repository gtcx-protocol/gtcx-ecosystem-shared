# GTCX Backend - Rails 7 + Vue.js

Production-ready backend infrastructure for the GTCX platform (GeoTag™ and TradePass™).

## Architecture

- **Backend API**: Ruby on Rails 7 (API-only mode)
- **Frontend Dashboard**: Vue.js 3 with Element Plus
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **External Integration**: Ghana Government APIs

## Quick Start

### Backend (Rails API)

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Setup database:
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

3. Start Rails server:
   ```bash
   rails server -p 3000
   ```

### Frontend (Vue.js Dashboard)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run serve
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Token refresh
- `DELETE /api/v1/auth/logout` - User logout

### Location Services
- `POST /api/v1/locations` - Create location record
- `GET /api/v1/locations` - List user locations
- `POST /api/v1/locations/track` - Live tracking endpoint

### Commodity Operations
- `POST /api/v1/commodity_operations` - Create commodity operation
- `GET /api/v1/commodity_operations` - List operations
- `POST /api/v1/commodity_operations/:id/verify_permit` - Verify permit
- `POST /api/v1/commodity_operations/:id/submit_compliance` - Submit compliance report

### Ghana Government Integration
- `POST /api/v1/government/verify_permit` - Verify with Ghana Minerals Commission
- `POST /api/v1/government/submit_report` - Submit compliance report
- `GET /api/v1/government/compliance_status/:permit_id` - Check compliance status

### Commodity Lot Management
- `POST /api/v1/commodity_lots` - Create commodity lot
- `GET /api/v1/commodity_lots` - List commodity lots
- `POST /api/v1/commodity_lots/:id/verify_authenticity` - Verify authenticity
- `GET /api/v1/commodity_lots/:id/chain_of_custody` - Get chain of custody
- `POST /api/v1/commodity_lots/:id/transfer_ownership` - Transfer ownership

### Payment Processing
- `POST /api/v1/payments` - Create payment
- `POST /api/v1/payments/mobile_money` - Mobile money payment
- `POST /api/v1/payments/bank_transfer` - Bank transfer payment

## Environment Configuration

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/gtcx_backend_development

# Security
SECRET_KEY_BASE=your_secret_key_here
JWT_SECRET=your_jwt_secret_here

# Ghana Government API
GHANA_MINERALS_API_URL=https://api.mineralscommission.gov.gh
GHANA_MINERALS_API_KEY=your_api_key_here
GHANA_CLIENT_ID=your_client_id_here

# Payment Processing
MTN_MOMO_API_KEY=your_mtn_momo_key
VODAFONE_CASH_API_KEY=your_vodafone_key

# Cloud Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=gtcx-production

# Redis (for background jobs)
REDIS_URL=redis://localhost:6379/0
```

## Database Schema

### Users
- Authentication and role management
- Biometric data storage
- Permit verification
- Wallet integration

### Locations
- GPS coordinates with timestamps
- Accuracy measurements
- Cryptographic proofs
- Commodity operation associations

### Commodity Operations
- Permit validation
- Compliance tracking
- Government reporting
- Production records

### Commodity Lots
- Supply chain tracking
- Authenticity verification
- Ownership transfers
- Certificate generation

## Security Features

- JWT authentication with token refresh
- CORS configuration for mobile apps
- Rate limiting with Rack::Attack
- Encrypted sensitive data storage
- API request logging and monitoring

## Ghana Government Integration

The system integrates with Ghana's Minerals Commission APIs:

1. **Permit Verification**: Real-time permit status checking
2. **Compliance Reporting**: Automated compliance submissions
3. **Legal Documentation**: Government-approved certificate generation
4. **Audit Trail**: Complete tracking for government inspections

## Production Deployment

### Rails API Deployment
- Deploy to AWS/Heroku with PostgreSQL
- Configure environment variables
- Set up SSL certificates
- Enable application monitoring

### Vue.js Dashboard Deployment
- Build for production: `npm run build`
- Deploy to CDN (AWS CloudFront/Netlify)
- Configure API endpoint URLs

## Testing

Run backend tests:
```bash
bundle exec rspec
```

Run frontend tests:
```bash
cd frontend && npm run test:unit
```

## Contributing

1. Follow Rails conventions and Vue.js best practices
2. Write comprehensive tests for all features
3. Document API changes
4. Ensure Ghana government compliance requirements are met

## Support

For technical support regarding the GTCX backend infrastructure, please refer to the main project documentation or contact the development team.

---

**GTCX Backend v1.0** - Production-ready Rails 7 + Vue.js infrastructure for Ghana's commodity sector digitization.