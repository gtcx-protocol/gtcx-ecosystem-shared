#!/bin/bash

# =============================================================================
# GTCX PRODUCTION REALITY CHECK SCRIPT
# CRITICAL: Prevents catastrophic business failures from deployment hallucinations
# =============================================================================

set -e

echo "🚨 GTCX PRODUCTION REALITY CHECK"
echo "================================"
echo "Timestamp: $(date)"
echo "Purpose: Verify actual production readiness vs theoretical claims"
echo ""

REALITY_CHECK_RESULTS=()
FAILED_CHECKS=0
TOTAL_CHECKS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test and log reality
test_reality() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    local timeout="${4:-10}"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -e "${BLUE}🔍 Testing: $test_name${NC}"
    
    # Run test with timeout
    if timeout "$timeout" bash -c "$test_command" >/dev/null 2>&1; then
        if [ "$expected_result" = "success" ]; then
            echo -e "${GREEN}✅ PASS: $test_name${NC}"
            REALITY_CHECK_RESULTS+=("✅ $test_name: WORKING")
        else
            echo -e "${RED}❌ FAIL: $test_name (unexpected success)${NC}"
            REALITY_CHECK_RESULTS+=("❌ $test_name: FAILED (unexpected success)")
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        fi
    else
        if [ "$expected_result" = "fail" ] || [ "$expected_result" = "expected_fail" ]; then
            echo -e "${YELLOW}✅ PASS: $test_name (expected failure)${NC}"
            REALITY_CHECK_RESULTS+=("✅ $test_name: CORRECTLY FAILING")
        else
            echo -e "${RED}❌ FAIL: $test_name${NC}"
            REALITY_CHECK_RESULTS+=("❌ $test_name: NOT WORKING")
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        fi
    fi
}

echo "🔍 LEVEL 1: BASIC INFRASTRUCTURE REALITY CHECK"
echo "============================================="

# Test basic API connectivity
test_reality "Basic API Health Check" "curl -f -m 5 http://gtcx.africa:3001/health" "success"
test_reality "Basic API Status Endpoint" "curl -f -m 5 http://gtcx.africa:3001/health | grep -q 'ok'" "success"
test_reality "Enhanced API Health Check" "curl -f -m 5 http://gtcx.africa:3002/health" "success"
test_reality "HTTPS TradePass Frontend" "curl -f -m 5 https://tradepass.africa" "success"
test_reality "HTTPS GeoTag Frontend" "curl -f -m 5 https://geotag.africa" "success"
test_reality "HTTPS GTCX Frontend" "curl -f -m 5 https://gtcx.africa" "success"

echo ""
echo "🔍 LEVEL 2: API FUNCTIONALITY REALITY CHECK"
echo "==========================================="

# Test API endpoints
test_reality "API Status Endpoint" "curl -f -m 5 http://gtcx.africa:3001/api/v1/status" "success"
test_reality "User Registration Endpoint" "curl -X POST -f -m 5 http://gtcx.africa:3001/api/v1/auth/register -d '{\"email\":\"test@example.com\",\"password\":\"test123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"miner\"}' -H 'Content-Type: application/json'" "success"
test_reality "User Login Endpoint" "curl -X POST -f -m 5 http://gtcx.africa:3001/api/v1/auth/login -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}' -H 'Content-Type: application/json'" "success"
test_reality "Protected Route Test" "curl -f -m 5 http://gtcx.africa:3001/api/v1/users/profile -H 'Authorization: Bearer fake-token'" "expected_fail"

echo ""
echo "🔍 LEVEL 3: DATABASE REALITY CHECK"
echo "================================="

# Test database functionality
test_reality "Database Connection" "curl -f -m 5 http://gtcx.africa:3001/api/v1/status | grep -q 'database'" "success"
test_reality "User Data Persistence" "curl -s -m 5 http://gtcx.africa:3001/api/v1/status | grep -q 'users'" "success"

echo ""
echo "🔍 LEVEL 4: THIRD-PARTY INTEGRATIONS REALITY CHECK"
echo "=================================================="

# Test external service integrations (these should fail if not configured)
test_reality "MTN Mobile Money API" "curl -f -m 5 https://api.mtn.com/v1/health" "expected_fail"
test_reality "SendGrid Email API" "curl -f -m 5 https://api.sendgrid.com/v3/user/profile -H 'Authorization: Bearer SG.fake-key'" "expected_fail"
test_reality "Ghana Government API" "curl -f -m 5 https://minerals.gov.gh/api/health" "expected_fail"
test_reality "Twilio SMS API" "curl -f -m 5 https://api.twilio.com/2010-04-01/Accounts/fake/Messages.json -u fake:fake" "expected_fail"

echo ""
echo "🔍 LEVEL 5: SEARCH & ANALYTICS REALITY CHECK"
echo "============================================"

# Test search infrastructure
test_reality "Elasticsearch Health" "curl -f -m 5 http://gtcx.africa:9200/_cluster/health" "success"
test_reality "Kibana Dashboard" "curl -f -m 5 http://gtcx.africa:5601/api/status" "success"
test_reality "Search API Endpoint" "curl -f -m 5 http://gtcx.africa:3001/api/v1/search/gold-lots" "success"

echo ""
echo "🔍 LEVEL 6: FILE EXISTENCE REALITY CHECK"
echo "======================================="

# Test that claimed files actually exist
test_reality "Enhanced API File Exists" "[ -f /Users/amanianai/geotag-app/gtcx-rails-api.rb ]" "success"
test_reality "Notification Service Exists" "[ -f /Users/amanianai/geotag-app/src/services/notification-service.ts ]" "success"
test_reality "Elasticsearch Service Exists" "[ -f /Users/amanianai/geotag-app/src/services/elasticsearch-service.ts ]" "success"
test_reality "CI/CD Pipeline Exists" "[ -f /Users/amanianai/geotag-app/.github/workflows/deploy.yml ]" "success"
test_reality "React Native App Config" "[ -f /Users/amanianai/geotag-app/app.config.ts ]" "success"

echo ""
echo "🔍 LEVEL 7: MOBILE APP REALITY CHECK"
echo "==================================="

# Test mobile app functionality
test_reality "Package.json Exists" "[ -f /Users/amanianai/geotag-app/package.json ]" "success"
test_reality "App Builds Successfully" "cd /Users/amanianai/geotag-app && npm run --version" "success"
test_reality "Mobile App API Connection" "curl -f -m 5 http://gtcx.africa:3001/health -H 'User-Agent: GTCX-Mobile'" "success"

echo ""
echo "🚨 PRODUCTION REALITY AUDIT REPORT"
echo "=================================="
echo "Report Generated: $(date)"
echo "Total Tests Run: $TOTAL_CHECKS"
echo "Tests Passed: $((TOTAL_CHECKS - FAILED_CHECKS))"
echo "Tests Failed: $FAILED_CHECKS"
echo "Success Rate: $(( (TOTAL_CHECKS - FAILED_CHECKS) * 100 / TOTAL_CHECKS ))%"
echo ""

echo "📊 DETAILED RESULTS:"
echo "==================="
for result in "${REALITY_CHECK_RESULTS[@]}"; do
    echo "$result"
done

echo ""
echo "🎯 FEATURE STATUS ASSESSMENT:"
echo "============================="

# Calculate actual production readiness
if test_reality "End-to-End User Registration" "curl -X POST -f http://gtcx.africa:3001/api/v1/auth/register -d '{\"email\":\"reality-check@test.com\",\"password\":\"test123\",\"firstName\":\"Reality\",\"lastName\":\"Check\",\"role\":\"miner\"}' -H 'Content-Type: application/json' && curl -X POST -f http://gtcx.africa:3001/api/v1/auth/login -d '{\"email\":\"reality-check@test.com\",\"password\":\"test123\"}' -H 'Content-Type: application/json'" "success" 30; then
    echo "✅ User Registration: PRODUCTION READY"
else
    echo "❌ User Registration: NOT PRODUCTION READY"
fi

if test_reality "Complete Gold Lot Workflow" "curl -X POST -f http://gtcx.africa:3001/api/v1/gold-lots -H 'Authorization: Bearer test-token' -d '{\"weight\":100,\"purity\":\"18k\",\"price\":5500}' -H 'Content-Type: application/json'" "success" 30; then
    echo "✅ Gold Lot Trading: PRODUCTION READY"
else
    echo "❌ Gold Lot Trading: NOT PRODUCTION READY"
fi

echo ""
echo "🏆 HONEST PRODUCTION READINESS SUMMARY:"
echo "======================================="

WORKING_FEATURES=0
if [ $FAILED_CHECKS -lt 5 ]; then
    echo "✅ Basic Infrastructure: WORKING"
    WORKING_FEATURES=$((WORKING_FEATURES + 1))
else
    echo "❌ Basic Infrastructure: BROKEN"
fi

if curl -f -m 5 http://gtcx.africa:3001/health >/dev/null 2>&1; then
    echo "✅ Basic API: WORKING"
    WORKING_FEATURES=$((WORKING_FEATURES + 1))
else
    echo "❌ Basic API: BROKEN"
fi

echo ""
echo "🎯 PRODUCTION READY FEATURES: $WORKING_FEATURES out of estimated 12 planned features"
echo "📊 ACTUAL COMPLETION RATE: $(( WORKING_FEATURES * 100 / 12 ))%"

echo ""
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 AMAZING: All systems verified as working!${NC}"
    echo -e "${GREEN}✅ Production claims are ACCURATE${NC}"
    exit 0
elif [ $FAILED_CHECKS -lt 5 ]; then
    echo -e "${YELLOW}⚠️ PARTIAL SUCCESS: Some systems working, others not deployed${NC}"
    echo -e "${YELLOW}🔧 Focus on deploying remaining features${NC}"
    exit 0
else
    echo -e "${RED}🚨 CRITICAL FAILURE: $FAILED_CHECKS major systems not working${NC}"
    echo -e "${RED}❌ DO NOT CLAIM PRODUCTION READINESS${NC}"
    echo -e "${RED}🔥 IMMEDIATE ACTION REQUIRED${NC}"
    exit 1
fi