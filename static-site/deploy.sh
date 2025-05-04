#!/bin/bash

# PumpSui Static Site Deployment Script
# This script helps deploy the static site to Netlify

echo "🚀 PumpSui Static Site Deployment"
echo "=================================="

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
else
    echo "✅ Netlify CLI is installed"
fi

# Login check
echo "🔑 Checking Netlify authentication..."
netlify status

# Deployment options
echo ""
echo "Select deployment type:"
echo "1) Draft deployment (for testing)"
echo "2) Production deployment"
read -p "Enter your choice (1/2): " choice

if [ "$choice" = "1" ]; then
    echo "📦 Creating draft deployment..."
    netlify deploy --dir=.
elif [ "$choice" = "2" ]; then
    echo "🚀 Creating production deployment..."
    netlify deploy --dir=. --prod
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✨ Deployment process completed!"
