#!/bin/bash

# PumpSui Deployment Script
# This script deploys the entire PumpSui application (frontend, backend, and contracts)

echo "🚀 Starting PumpSui deployment..."

# Check if environment is provided
if [ -z "$1" ]; then
    echo "❌ Environment not specified. Usage: ./deploy-all.sh [testnet|mainnet]"
    exit 1
fi

ENVIRONMENT=$1

if [ "$ENVIRONMENT" != "testnet" ] && [ "$ENVIRONMENT" != "mainnet" ]; then
    echo "❌ Invalid environment. Use 'testnet' or 'mainnet'."
    exit 1
fi

echo "🌐 Deploying to $ENVIRONMENT environment"

# Build frontend
echo "⚙️ Building frontend..."
cd frontend
pnpm build
cd ..

# Build backend
echo "⚙️ Building backend..."
cd backend
pnpm build
cd ..

# Deploy contracts
echo "⚙️ Deploying smart contracts..."
cd contracts
./scripts/deploy.sh $ENVIRONMENT
cd ..

# Get contract address from deployment
if [ -f "contracts/deployed_$ENVIRONMENT.json" ]; then
    PACKAGE_ID=$(cat "contracts/deployed_$ENVIRONMENT.json" | grep -o '"packageId": "[^"]*' | cut -d'"' -f4)
    echo "📝 Smart contract deployed with package ID: $PACKAGE_ID"
    
    # Update backend .env with package ID
    if [ -f "backend/.env" ]; then
        sed -i '' "s/PACKAGE_ID=.*/PACKAGE_ID=$PACKAGE_ID/g" backend/.env
        echo "✅ Updated backend .env with package ID"
    fi
    
    # Update frontend .env with package ID
    if [ -f "frontend/.env" ]; then
        sed -i '' "s/VITE_PACKAGE_ID=.*/VITE_PACKAGE_ID=$PACKAGE_ID/g" frontend/.env
        echo "✅ Updated frontend .env with package ID"
    fi
else
    echo "⚠️ Could not find deployed contract information"
fi

# Deploy backend (placeholder - would use your actual deployment method)
echo "⚙️ Deploying backend..."
echo "⚠️ This is a placeholder. Replace with your actual backend deployment command."
# Example: aws elasticbeanstalk deploy ...

# Deploy frontend (placeholder - would use your actual deployment method)
echo "⚙️ Deploying frontend..."
echo "⚠️ This is a placeholder. Replace with your actual frontend deployment command."
# Example: vercel --prod

echo "🎉 Deployment complete!"
