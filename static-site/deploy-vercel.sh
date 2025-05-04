#!/bin/bash

# PumpSui Static Site Deployment Script for Vercel
# This script helps deploy the static site to Vercel

echo "🚀 PumpSui Static Site Deployment to Vercel"
echo "==========================================="

# Check if Vercel CLI is installed
if ! npx vercel --version &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install --save-dev vercel
else
    echo "✅ Vercel CLI is installed"
fi

# Deployment options
echo ""
echo "Select deployment type:"
echo "1) Preview deployment (for testing)"
echo "2) Production deployment"
read -p "Enter your choice (1/2): " choice

if [ "$choice" = "1" ]; then
    echo "📦 Creating preview deployment..."
    npx vercel
elif [ "$choice" = "2" ]; then
    echo "🚀 Creating production deployment..."
    npx vercel --prod
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "✨ Deployment process completed!"
