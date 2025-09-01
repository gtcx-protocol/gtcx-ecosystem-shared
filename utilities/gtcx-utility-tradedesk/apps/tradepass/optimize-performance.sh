#!/bin/bash
# GTCX Automated Performance Optimization Script
# Generated: 2025-08-09T11:45:13.108Z

echo "🚀 Starting automated performance optimizations..."

echo "Executing: node scripts/fix-typescript-errors.js"
node scripts/fix-typescript-errors.js

echo "Executing: npm run type-check -- --incremental"
npm run type-check -- --incremental

echo "✅ Performance optimizations complete!"
