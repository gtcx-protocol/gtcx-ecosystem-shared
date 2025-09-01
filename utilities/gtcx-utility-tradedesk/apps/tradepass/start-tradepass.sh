#!/bin/bash

# TradePass™ Startup Script - Always Port 8082
# Ensures TradePass runs consistently on port 8082

echo "🔐 Starting TradePass™ on port 8082..."

# Kill any existing process on port 8082
echo "🧹 Cleaning up port 8082..."
lsof -ti:8082 | xargs -r kill -9 2>/dev/null

# Wait for port to be free
sleep 2

# Start TradePass on port 8082
echo "🚀 Launching TradePass Metro server..."
cd "$(dirname "$0")"
npx expo start --port 8082

echo "✅ TradePass™ should be running on http://localhost:8082"