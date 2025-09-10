#!/bin/bash
# Environment File Protection Script
# This script ensures your .env file is properly configured

echo "🔒 Checking .env file protection..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found! Restoring from backup..."
    if [ -f ".env.backup" ]; then
        cp .env.backup .env
        chmod 600 .env
        echo "✅ .env file restored from backup"
    else
        echo "❌ No backup found. Please recreate .env file"
        exit 1
    fi
fi

# Check if MONGODB_URI is set and not commented
if grep -q "^MONGODB_URI=" .env; then
    echo "✅ MONGODB_URI is properly configured"
else
    echo "❌ MONGODB_URI is missing or commented out!"
    echo "Please ensure MONGODB_URI is set in .env file"
    exit 1
fi

# Check file permissions
if [ "$(stat -c %a .env)" = "600" ]; then
    echo "✅ .env file has correct permissions (600)"
else
    echo "🔧 Setting correct permissions for .env file..."
    chmod 600 .env
    echo "✅ Permissions updated"
fi

echo "🎉 .env file is properly protected!"