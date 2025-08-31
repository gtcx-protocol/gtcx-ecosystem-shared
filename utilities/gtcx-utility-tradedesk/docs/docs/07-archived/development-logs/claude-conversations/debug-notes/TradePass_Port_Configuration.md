# TradePass™ Port Configuration - Always Port 8082

## Configuration Complete ✅

TradePass™ is now permanently configured to run on **port 8082**:

### Startup Commands:
```bash
# Method 1: Use npm script (recommended)
cd tradepass-app && npm start

# Method 2: Use dedicated startup script
cd tradepass-app && ./start-tradepass.sh

# Method 3: Manual command
cd tradepass-app && npx expo start --port 8082
```

### Access URLs:
- **Mobile (Expo Go)**: `exp://192.168.1.67:8082`
- **Web Browser**: `http://localhost:8082`
- **Metro Bundler**: `http://localhost:8082`

### Configuration Files Updated:
1. **package.json** - Default start script uses port 8082
2. **start-tradepass.sh** - Dedicated startup script with port cleanup
3. **metro.config.js** - Already configured with Noble package fixes

### Port Status Monitoring:
```bash
# Check if TradePass is running
lsof -i :8082

# Kill any process on port 8082
lsof -ti:8082 | xargs kill -9
```

### Troubleshooting:
- If port 8082 is occupied, the startup script will automatically kill existing processes
- If you see "port already in use", run: `./start-tradepass.sh`
- Noble package issues are permanently fixed with Metro config aliases

## IMPORTANT REMINDER:
**TradePass™ will always run on port 8082**  
If it's not on port 8082, something is wrong and needs investigation.

---
*Last Updated: 2025-08-09*  
*Status: ACTIVE CONFIGURATION*