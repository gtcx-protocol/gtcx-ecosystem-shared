# 🔧 GeoTag App - Development Server Troubleshooting Guide

## Common Connection Issues & Solutions

### 🚨 "Could not connect to development server" Error

This error typically occurs when the Expo development server can't be reached. Here are the solutions:

#### **Quick Fix (Most Common)**
```bash
# Use the provided startup script
./start-dev.sh
```

#### **Manual Steps**
1. **Kill existing processes:**
   ```bash
   pkill -f "expo start"
   ```

2. **Start with localhost mode:**
   ```bash
   npx expo start --clear --localhost
   ```

3. **Access via localhost:**
   - Web: `http://localhost:8081`
   - Avoid using IP addresses like `192.168.x.x:8081`

### 📱 Testing Options

#### **1. Web Browser (Recommended for development)**
- Open: `http://localhost:8081`
- Most reliable for testing UI and functionality
- Full debugging capabilities

#### **2. iOS Simulator**
- Press `i` in the Expo terminal
- Requires Xcode to be installed
- Best for iOS-specific testing

#### **3. Android Emulator**
- Press `a` in the Expo terminal
- Requires Android Studio setup
- Best for Android-specific testing

#### **4. Physical Device (Expo Go)**
- Install Expo Go app from App Store/Play Store
- Scan QR code from terminal
- Ensure device and computer are on same WiFi network

### 🔧 Advanced Troubleshooting

#### **Port Conflicts**
If port 8081 is busy:
```bash
# Kill processes using port 8081
lsof -ti:8081 | xargs kill -9

# Or use a different port
npx expo start --port 8082
```

#### **Network Issues**
If you need to use IP address instead of localhost:
```bash
# Start with tunnel mode (slower but more reliable)
npx expo start --tunnel

# Or use LAN mode
npx expo start --lan
```

#### **Cache Issues**
If you see bundling errors:
```bash
# Clear all caches
npx expo start --clear
rm -rf node_modules/.cache
npm start -- --reset-cache
```

#### **Watchman Issues (macOS)**
If you see Watchman warnings:
```bash
# Clear Watchman cache
watchman watch-del '/Users/$(whoami)' 
watchman watch-project '/Users/$(whoami)'

# Or restart Watchman
brew services restart watchman
```

### 🐛 Common Error Messages & Fixes

| Error | Solution |
|-------|----------|
| `EMFILE: too many open files` | Increase file descriptor limit: `ulimit -n 4096` |
| `Port 8081 is running this app in another window` | Kill existing process: `pkill -f "expo start"` |
| `Unable to resolve module` | Install missing dependencies: `npm install` |
| `Metro bundler crashed` | Clear cache: `npx expo start --clear` |
| `Cannot find MIME for Buffer` | Fix corrupted assets or recreate them |

### 📊 Development Server Status Check

Use this command to verify server status:
```bash
# Check if server is running
curl -s http://localhost:8081 | head -5

# Check which ports are in use
lsof -i:8081,8082,8084,8085 | grep LISTEN

# Check Expo processes
ps aux | grep expo
```

### 🎯 Recommended Development Workflow

1. **Start Development:**
   ```bash
   ./start-dev.sh
   ```

2. **Open in Web Browser:**
   - Navigate to `http://localhost:8081`
   - Use browser dev tools for debugging

3. **Test on Device:**
   - Use iOS Simulator (`i`) or Android Emulator (`a`)
   - For physical devices, ensure same WiFi network

4. **Handle Errors:**
   - Check terminal for error messages
   - Use `r` to reload the app
   - Use `shift+m` for more Metro options

### 🔄 Reset Everything (Nuclear Option)

If nothing else works:
```bash
# Kill all processes
pkill -f expo
pkill -f metro
pkill -f node

# Clear all caches
rm -rf node_modules
rm -rf .expo
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# Reinstall dependencies
npm install

# Start fresh
npx expo start --clear --localhost
```

### 📞 Getting Help

If you're still experiencing issues:

1. **Check Terminal Output:** Look for specific error messages
2. **Check Browser Console:** Open dev tools in your web browser
3. **Verify Network:** Ensure stable internet connection
4. **Update Dependencies:** Run `npm update` to get latest packages
5. **Restart Computer:** Sometimes a full restart resolves system-level issues

### 🚀 Performance Tips

- Use `--localhost` flag for faster local development
- Use `--tunnel` only when necessary (slower but works across networks)
- Clear cache regularly with `--clear` flag
- Close unnecessary browser tabs and applications
- Use web browser for most development (fastest iteration)

---

## 📋 Quick Reference Commands

```bash
# Standard startup
npx expo start --clear --localhost

# With tunnel (for network issues)
npx expo start --tunnel

# Kill all Expo processes
pkill -f "expo start"

# Check server status
curl http://localhost:8081

# Open in browser
open http://localhost:8081
```

Remember: **localhost is more reliable than IP addresses** for local development! 